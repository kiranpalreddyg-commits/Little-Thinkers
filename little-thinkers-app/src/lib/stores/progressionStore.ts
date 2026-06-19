import { create } from 'zustand';
import type { Badge, BadgeEvent, MascotState, ThinkingStreak, WorldMapArea, BadgeType, DifficultyLevel, GameTypeKey } from '@/lib/types/progression';
import { BADGE_META, WORLD_AREAS, GAME_TYPES } from '@/lib/types/progression';

const progressionKey = (childId: string) => `lt_progression_${childId}`;
const streakKey = (childId: string) => `lt_streak_${childId}`;

/**
 * Pure function: derive mascot accessories from level.
 * Called by store actions and may be called from UI.
 */
export function getAccessoriesForLevel(level: number): string[] {
  if (level >= 4) return ['glasses', 'hat', 'cape'];
  if (level === 3) return ['glasses', 'hat'];
  if (level === 2) return ['glasses'];
  return [];
}

interface StoredProgression {
  badges: Badge[];
  worldAreas: WorldMapArea[];
  mascot: { level: number; experience: number };
}

function defaultDifficulty(): Record<GameTypeKey, DifficultyLevel> {
  return Object.fromEntries(GAME_TYPES.map((g) => [g, 2])) as Record<GameTypeKey, DifficultyLevel>;
}

function defaultAnswerWindow(): Record<GameTypeKey, boolean[]> {
  return Object.fromEntries(GAME_TYPES.map((g) => [g, [] as boolean[]])) as Record<GameTypeKey, boolean[]>;
}

function defaultHintsUsed(): Record<GameTypeKey, number> {
  return Object.fromEntries(GAME_TYPES.map((g) => [g, 0])) as Record<GameTypeKey, number>;
}

interface ProgressionState {
  badges: Badge[];
  worldAreas: WorldMapArea[];
  mascot: MascotState | null;
  streak: ThinkingStreak | null;
  newBadgeNotification: Badge | null;
  gameDifficulty: Record<GameTypeKey, DifficultyLevel>;
  answerWindow: Record<GameTypeKey, boolean[]>;
  hintsUsed: Record<GameTypeKey, number>;

  hydrateProgression: (childId: string) => void;
  updateFromSparks: (childId: string, totalSparks: number) => Badge[];
  checkAndAwardBadges: (childId: string, event: BadgeEvent) => Badge[];
  recordActivity: (childId: string, today: string) => void;
  dismissNotification: () => void;
  recordAnswer: (childId: string, gameType: string, correct: boolean) => void;
  recordHintUsed: (gameType: string) => void;
  getDifficulty: (gameType: string) => DifficultyLevel;
}

/**
 * Generate a unique id. `crypto.randomUUID()` is only available in secure
 * contexts (HTTPS/localhost) and is absent in some test environments, so
 * fall back to a timestamp+random id when it is unavailable.
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function yesterday(today: string): string {
  const d = new Date(today + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0];
}

function readStoredProgression(childId: string): StoredProgression | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(progressionKey(childId));
    if (!raw) return null;
    return JSON.parse(raw) as StoredProgression;
  } catch {
    return null;
  }
}

function writeStoredProgression(childId: string, data: StoredProgression): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(progressionKey(childId), JSON.stringify(data));
  } catch {
    // Safari private mode or quota exceeded — continue without persistence
  }
}

function readStoredStreak(childId: string): ThinkingStreak | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(streakKey(childId));
    if (!raw) return null;
    return JSON.parse(raw) as ThinkingStreak;
  } catch {
    return null;
  }
}

function writeStoredStreak(childId: string, data: ThinkingStreak): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(streakKey(childId), JSON.stringify(data));
  } catch {
    // Safari private mode or quota exceeded — continue without persistence
  }
}

function initDefaultStreak(childId: string): ThinkingStreak {
  return {
    childId,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    pausedUntil: null,
  };
}

function initDefaultMascot(childId: string): MascotState {
  return {
    childId,
    level: 1,
    experience: 0,
    accessories: [],
  };
}

const aiKey = (childId: string) => `lt_ai_${childId}`;

function readStoredAI(childId: string): { gameDifficulty: Record<GameTypeKey, DifficultyLevel>; hintsUsed: Record<GameTypeKey, number> } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(aiKey(childId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStoredAI(childId: string, gameDifficulty: Record<GameTypeKey, DifficultyLevel>, hintsUsed: Record<GameTypeKey, number>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(aiKey(childId), JSON.stringify({ gameDifficulty, hintsUsed }));
  } catch {
    // Safari private mode or quota exceeded — continue without persistence
  }
}

export const useProgressionStore = create<ProgressionState>((set, get) => ({
  badges: [],
  worldAreas: WORLD_AREAS,
  mascot: null,
  streak: null,
  newBadgeNotification: null,
  gameDifficulty: defaultDifficulty(),
  answerWindow: defaultAnswerWindow(),
  hintsUsed: defaultHintsUsed(),

  hydrateProgression: (childId: string) => {
    const stored = readStoredProgression(childId);
    const storedStreak = readStoredStreak(childId);
    const storedAI = readStoredAI(childId);

    let badges: Badge[] = [];
    let worldAreas = WORLD_AREAS;
    let mascot = initDefaultMascot(childId);

    if (stored) {
      badges = stored.badges;
      // Merge with defaults to preserve unlock state
      worldAreas = WORLD_AREAS.map((defaultArea) => {
        const storedArea = stored.worldAreas.find((a) => a.id === defaultArea.id);
        return storedArea ? { ...defaultArea, isUnlocked: storedArea.isUnlocked } : defaultArea;
      });
      mascot = {
        childId,
        level: stored.mascot.level,
        experience: stored.mascot.experience,
        accessories: getAccessoriesForLevel(stored.mascot.level),
      };
    }

    const streak = storedStreak || initDefaultStreak(childId);

    set({
      badges, worldAreas, mascot, streak, newBadgeNotification: null,
      ...(storedAI ? { gameDifficulty: storedAI.gameDifficulty, hintsUsed: storedAI.hintsUsed } : {}),
    });
  },

  updateFromSparks: (childId: string, totalSparks: number): Badge[] => {
    const newLevel = Math.floor(totalSparks / 20) + 1;
    const newWorldAreas = WORLD_AREAS.map((area) => ({
      ...area,
      isUnlocked: totalSparks >= area.sparkThreshold,
    }));

    const currentState = get();
    const newlyUnlockedAreas = newWorldAreas.filter(
      (area) => area.isUnlocked && !currentState.worldAreas.find((a) => a.id === area.id && a.isUnlocked),
    );

    const newBadges: Badge[] = [];

    // Award explorer badge if new area was unlocked and no explorer badge exists
    if (newlyUnlockedAreas.length > 0) {
      const hasExplorerBadge = currentState.badges.some((b) => b.badgeType === 'explorer');
      if (!hasExplorerBadge) {
        newBadges.push({
          id: generateId(),
          childId,
          badgeType: 'explorer',
          name: BADGE_META['explorer'].name,
          description: BADGE_META['explorer'].description,
          earnedAt: new Date().toISOString(),
        });
      }
    }

    const updatedBadges = [...currentState.badges, ...newBadges];
    const updatedMascot: MascotState = {
      childId,
      level: newLevel,
      experience: totalSparks,
      accessories: getAccessoriesForLevel(newLevel),
    };

    const stored: StoredProgression = {
      badges: updatedBadges,
      worldAreas: newWorldAreas,
      mascot: { level: newLevel, experience: totalSparks },
    };

    writeStoredProgression(childId, stored);
    set({ worldAreas: newWorldAreas, mascot: updatedMascot, badges: updatedBadges });

    return newBadges;
  },

  checkAndAwardBadges: (childId: string, event: BadgeEvent): Badge[] => {
    const currentState = get();
    const newBadges: Badge[] = [];
    let firstNewBadge: Badge | null = null;

    const awardBadge = (badgeType: BadgeType) => {
      // Check if badge already exists
      if (currentState.badges.some((b) => b.badgeType === badgeType)) {
        return;
      }

      const badge: Badge = {
        id: generateId(),
        childId,
        badgeType,
        name: BADGE_META[badgeType].name,
        description: BADGE_META[badgeType].description,
        earnedAt: new Date().toISOString(),
      };

      newBadges.push(badge);
      if (!firstNewBadge) {
        firstNewBadge = badge;
      }
    };

    if (event.type === 'correct-answer') {
      if (event.totalCorrect === 1) {
        awardBadge('first-correct');
      }
      if (event.totalCorrect === 10) {
        awardBadge('ten-correct');
      }
    } else if (event.type === 'game-complete') {
      awardBadge('game-complete');
    } else if (event.type === 'streak-check') {
      if (event.streakDays !== undefined && event.streakDays >= 5) {
        awardBadge('five-day-streak');
      }
    }

    if (newBadges.length === 0) {
      return [];
    }

    const updatedBadges = [...currentState.badges, ...newBadges];

    const stored: StoredProgression = {
      badges: updatedBadges,
      worldAreas: currentState.worldAreas,
      mascot: currentState.mascot
        ? { level: currentState.mascot.level, experience: currentState.mascot.experience }
        : { level: 1, experience: 0 },
    };

    writeStoredProgression(childId, stored);
    set({ badges: updatedBadges, newBadgeNotification: firstNewBadge });

    return newBadges;
  },

  recordActivity: (childId: string, today: string) => {
    const prev = get().streak || initDefaultStreak(childId);

    if (prev.pausedUntil !== null && today <= prev.pausedUntil) {
      // Within a paused window — persist but do not advance the streak.
      writeStoredStreak(childId, prev);
      return;
    }

    if (prev.lastActivityDate === today) {
      return;
    }

    // Build a NEW object so Zustand subscribers re-render (do not mutate
    // the reference held in store state).
    const yesterdayStr = yesterday(today);
    const currentStreak =
      prev.lastActivityDate === yesterdayStr ? prev.currentStreak + 1 : 1;

    const streak: ThinkingStreak = {
      ...prev,
      currentStreak,
      longestStreak: Math.max(prev.longestStreak, currentStreak),
      lastActivityDate: today,
    };

    writeStoredStreak(childId, streak);
    set({ streak });
  },

  dismissNotification: () => {
    set({ newBadgeNotification: null });
  },

  recordAnswer: (childId: string, gameType: string, correct: boolean) => {
    const state = get();
    const key = gameType as GameTypeKey;
    const prevWindow = state.answerWindow[key] ?? [];
    const newWindow = [...prevWindow, correct].slice(-10);

    const last3 = newWindow.slice(-3);
    let newLevel = state.gameDifficulty[key] ?? 2;

    if (last3.length === 3) {
      if (last3.every(Boolean)) {
        newLevel = Math.min(5, newLevel + 1) as DifficultyLevel;
      } else if (last3.every((v) => !v)) {
        newLevel = Math.max(1, newLevel - 1) as DifficultyLevel;
      }
    }

    const newDifficulty = { ...state.gameDifficulty, [key]: newLevel };
    const newAnswerWindow = { ...state.answerWindow, [key]: newWindow };

    writeStoredAI(childId, newDifficulty, state.hintsUsed);
    set({ gameDifficulty: newDifficulty, answerWindow: newAnswerWindow });
  },

  recordHintUsed: (gameType: string) => {
    const state = get();
    const key = gameType as GameTypeKey;
    const newHintsUsed = { ...state.hintsUsed, [key]: (state.hintsUsed[key] ?? 0) + 1 };
    set({ hintsUsed: newHintsUsed });
  },

  getDifficulty: (gameType: string): DifficultyLevel => {
    return (get().gameDifficulty[gameType as GameTypeKey] ?? 2) as DifficultyLevel;
  },
}));
