import type { Badge, WorldMapArea } from '@/lib/types/progression';
import { GAME_TYPES } from '@/lib/types/progression';

export interface ChildWeeklySummary {
  childId: string;
  currentStreak: number;
  longestStreak: number;
  totalSparks: number;
  badgesThisWeek: number;
  totalBadges: number;
  worldAreasUnlocked: number;
  mascotLevel: number;
}

export interface SkillEntry {
  gameType: string;
  displayName: string;
  difficultyLevel: number;
  hintsUsed: number;
}

export interface AssessmentRecord {
  label: string;
  date: string | null;
  score: number | null;
  status: 'completed' | 'pending';
}

export interface ChildDetailedView {
  childId: string;
  // Skill tracking (AC: detailed skill tracking)
  skills: SkillEntry[];
  // World map (AC: world map progress)
  worldAreas: WorldMapArea[];
  // Streak (AC: streak status)
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  // Badges history (AC: assessment results context)
  badges: Badge[];
  totalSparks: number;
  mascotLevel: number;
  // Assessments (AC: quarterly pre/post)
  quarterlyAssessments: AssessmentRecord[];
  // Brain Report (AC: weekly Brain Report)
  brainReport: string;
}

const GAME_DISPLAY_NAMES: Record<string, string> = {
  'word-pop': 'Word Pop',
  'connection-quest': 'Connection Quest',
  'memory-flip': 'Memory Flip',
  'pattern-builder': 'Pattern Builder',
  'grid-logic': 'Grid Logic',
};

interface StoredProgression {
  badges: Badge[];
  worldAreas: WorldMapArea[];
  mascot: { level: number; experience: number };
}

interface StoredStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

interface StoredJar {
  totalSparks: number;
}

interface StoredAI {
  gameDifficulty: Record<string, number>;
  hintsUsed: Record<string, number>;
}

function sevenDaysAgo(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 7);
  return d.toISOString();
}

function mockQuarterlyAssessments(childId: string): AssessmentRecord[] {
  // Pre-assessment is tied to account creation date — mock a fixed date
  const preDate = childId === 'child-1' ? '2026-05-01' : '2026-05-02';
  return [
    { label: 'Pre-Assessment (Q1)', date: preDate, score: 72, status: 'completed' },
    { label: 'Post-Assessment (Q1)', date: null, score: null, status: 'pending' },
  ];
}

export function generateBrainReport(
  childName: string,
  streak: number,
  totalSparks: number,
  totalBadges: number,
  worldAreasUnlocked: number,
  topSkill: SkillEntry | null,
): string {
  const streakText = streak === 0
    ? 'has not yet started a streak'
    : streak === 1
      ? 'played for 1 day'
      : `maintained a ${streak}-day streak`;

  const topSkillText = topSkill
    ? ` Their strongest area is ${topSkill.displayName} at Level ${topSkill.difficultyLevel}.`
    : '';

  return (
    `This week, ${childName} ${streakText}. ` +
    `They have earned ${totalSparks} Sparks in total and collected ${totalBadges} badge${totalBadges !== 1 ? 's' : ''}. ` +
    `${worldAreasUnlocked} world area${worldAreasUnlocked !== 1 ? 's are' : ' is'} now unlocked.` +
    topSkillText
  );
}

export function readChildSummary(childId: string): ChildWeeklySummary {
  const cutoff = sevenDaysAgo();

  let currentStreak = 0;
  let longestStreak = 0;
  let badgesThisWeek = 0;
  let totalBadges = 0;
  let worldAreasUnlocked = 1;
  let mascotLevel = 1;
  let totalSparks = 0;

  if (typeof window === 'undefined') {
    return { childId, currentStreak, longestStreak, totalSparks, badgesThisWeek, totalBadges, worldAreasUnlocked, mascotLevel };
  }

  try {
    const raw = localStorage.getItem(`lt_progression_${childId}`);
    if (raw) {
      const p = JSON.parse(raw) as StoredProgression;
      totalBadges = p.badges?.length ?? 0;
      badgesThisWeek = p.badges?.filter((b) => b.earnedAt >= cutoff).length ?? 0;
      worldAreasUnlocked = p.worldAreas?.filter((a) => a.isUnlocked).length ?? 1;
      mascotLevel = p.mascot?.level ?? 1;
    }
  } catch { /* continue with defaults */ }

  try {
    const raw = localStorage.getItem(`lt_streak_${childId}`);
    if (raw) {
      const s = JSON.parse(raw) as StoredStreak;
      currentStreak = s.currentStreak ?? 0;
      longestStreak = s.longestStreak ?? 0;
    }
  } catch { /* continue with defaults */ }

  try {
    const raw = localStorage.getItem(`lt_rewards_${childId}`);
    if (raw) {
      const r = JSON.parse(raw) as StoredJar;
      totalSparks = r.totalSparks ?? 0;
    }
  } catch { /* continue with defaults */ }

  return { childId, currentStreak, longestStreak, totalSparks, badgesThisWeek, totalBadges, worldAreasUnlocked, mascotLevel };
}

export function readChildDetailedView(childId: string, childName: string): ChildDetailedView {
  let badges: Badge[] = [];
  let worldAreas: WorldMapArea[] = [];
  let currentStreak = 0;
  let longestStreak = 0;
  let lastActivityDate: string | null = null;
  let totalSparks = 0;
  let mascotLevel = 1;
  let gameDifficulty: Record<string, number> = {};
  let hintsUsed: Record<string, number> = {};

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`lt_progression_${childId}`);
      if (raw) {
        const p = JSON.parse(raw) as StoredProgression;
        badges = p.badges ?? [];
        worldAreas = p.worldAreas ?? [];
        mascotLevel = p.mascot?.level ?? 1;
      }
    } catch { /* continue */ }

    try {
      const raw = localStorage.getItem(`lt_streak_${childId}`);
      if (raw) {
        const s = JSON.parse(raw) as StoredStreak;
        currentStreak = s.currentStreak ?? 0;
        longestStreak = s.longestStreak ?? 0;
        lastActivityDate = s.lastActivityDate ?? null;
      }
    } catch { /* continue */ }

    try {
      const raw = localStorage.getItem(`lt_rewards_${childId}`);
      if (raw) {
        const r = JSON.parse(raw) as StoredJar;
        totalSparks = r.totalSparks ?? 0;
      }
    } catch { /* continue */ }

    try {
      const raw = localStorage.getItem(`lt_ai_${childId}`);
      if (raw) {
        const ai = JSON.parse(raw) as StoredAI;
        gameDifficulty = ai.gameDifficulty ?? {};
        hintsUsed = ai.hintsUsed ?? {};
      }
    } catch { /* continue */ }
  }

  const skills: SkillEntry[] = GAME_TYPES.map((gt) => ({
    gameType: gt,
    displayName: GAME_DISPLAY_NAMES[gt] ?? gt,
    difficultyLevel: gameDifficulty[gt] ?? 2,
    hintsUsed: hintsUsed[gt] ?? 0,
  }));

  const topSkill = skills.reduce<SkillEntry | null>(
    (best, s) => (!best || s.difficultyLevel > best.difficultyLevel ? s : best),
    null,
  );

  const worldAreasUnlocked = worldAreas.filter((a) => a.isUnlocked).length || 1;

  const brainReport = generateBrainReport(
    childName,
    currentStreak,
    totalSparks,
    badges.length,
    worldAreasUnlocked,
    topSkill,
  );

  return {
    childId,
    skills,
    worldAreas,
    currentStreak,
    longestStreak,
    lastActivityDate,
    badges,
    totalSparks,
    mascotLevel,
    quarterlyAssessments: mockQuarterlyAssessments(childId),
    brainReport,
  };
}

export function formatWeekLabel(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const start = new Date(now);
  start.setUTCDate(now.getUTCDate() - day);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

  return `Week of ${fmt(start)} – ${fmt(end)}`;
}
