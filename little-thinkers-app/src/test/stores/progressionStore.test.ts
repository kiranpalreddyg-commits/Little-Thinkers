import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// Vitest 4 breaks jsdom localStorage — stub a manual implementation.
const _store: Record<string, string> = {};
const _localStorage = {
  getItem: (key: string) => _store[key] ?? null,
  setItem: (key: string, value: string) => { _store[key] = value; },
  removeItem: (key: string) => { delete _store[key]; },
  clear: () => { Object.keys(_store).forEach((k) => delete _store[k]); },
  get length() { return Object.keys(_store).length; },
  key: (n: number) => Object.keys(_store)[n] ?? null,
};

beforeAll(() => {
  vi.stubGlobal('localStorage', _localStorage);
});

import { useProgressionStore } from '@/lib/stores/progressionStore';
import type { Badge } from '@/lib/types/progression';

const CHILD_ID = 'child-1';
const progressionKey = `lt_progression_${CHILD_ID}`;
const streakKey = `lt_streak_${CHILD_ID}`;

beforeEach(() => {
  _localStorage.clear();
  useProgressionStore.setState({
    badges: [],
    worldAreas: [],
    mascot: null,
    streak: null,
    newBadgeNotification: null,
  });
});

describe('progressionStore', () => {
  describe('hydrateProgression (AC1, AC2, AC4, AC5)', () => {
    it('initialises defaults when localStorage is empty', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      const { badges, worldAreas, mascot } = useProgressionStore.getState();
      expect(badges).toEqual([]);
      expect(worldAreas.length).toBe(5);
      expect(mascot).not.toBeNull();
      expect(mascot?.level).toBe(1);
      expect(mascot?.experience).toBe(0);
      expect(mascot?.accessories).toEqual([]);
    });

    it('default world areas have only Word Woods unlocked', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      const { worldAreas } = useProgressionStore.getState();
      const wordWoods = worldAreas.find((a) => a.id === 'word-woods');
      const mathMountains = worldAreas.find((a) => a.id === 'math-mountains');
      expect(wordWoods?.isUnlocked).toBe(true);
      expect(mathMountains?.isUnlocked).toBe(false);
    });

    it('loads badges, worldAreas and mascot from localStorage when present', () => {
      const savedBadge: Badge = {
        id: 'b1',
        childId: CHILD_ID,
        badgeType: 'first-correct',
        name: 'First Spark!',
        description: 'You got your first correct answer — brilliant start!',
        earnedAt: '2026-05-01T10:00:00.000Z',
      };
      _localStorage.setItem(progressionKey, JSON.stringify({
        badges: [savedBadge],
        worldAreas: [
          { id: 'word-woods', name: 'Word Woods', isUnlocked: true, sparkThreshold: 0 },
          { id: 'math-mountains', name: 'Math Mountains', isUnlocked: true, sparkThreshold: 20 },
        ],
        mascot: { childId: CHILD_ID, level: 2, experience: 25, accessories: ['glasses'] },
      }));
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      const { badges, mascot, worldAreas } = useProgressionStore.getState();
      expect(badges).toHaveLength(1);
      expect(badges[0].badgeType).toBe('first-correct');
      expect(mascot?.level).toBe(2);
      expect(mascot?.accessories).toEqual(['glasses']);
      expect(worldAreas.find((a) => a.id === 'math-mountains')?.isUnlocked).toBe(true);
    });

    it('computes correct mascot level and accessories from stored experience', () => {
      _localStorage.setItem(progressionKey, JSON.stringify({
        badges: [],
        worldAreas: [],
        mascot: { childId: CHILD_ID, level: 3, experience: 55, accessories: ['glasses', 'hat'] },
      }));
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      const { mascot } = useProgressionStore.getState();
      expect(mascot?.level).toBe(3);
      expect(mascot?.accessories).toEqual(['glasses', 'hat']);
    });

    it('loads streak from localStorage when present', () => {
      _localStorage.setItem(streakKey, JSON.stringify({
        childId: CHILD_ID,
        currentStreak: 3,
        longestStreak: 7,
        lastActivityDate: '2026-05-14',
        pausedUntil: null,
      }));
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      const { streak } = useProgressionStore.getState();
      expect(streak?.currentStreak).toBe(3);
      expect(streak?.longestStreak).toBe(7);
      expect(streak?.lastActivityDate).toBe('2026-05-14');
    });
  });

  describe('updateFromSparks (AC2, AC5)', () => {
    it('keeps only Word Woods unlocked at 0 sparks', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().updateFromSparks(CHILD_ID, 0);
      const { worldAreas } = useProgressionStore.getState();
      expect(worldAreas.filter((a) => a.isUnlocked).map((a) => a.id)).toEqual(['word-woods']);
    });

    it('unlocks Math Mountains at 20 sparks', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().updateFromSparks(CHILD_ID, 20);
      const { worldAreas } = useProgressionStore.getState();
      expect(worldAreas.find((a) => a.id === 'math-mountains')?.isUnlocked).toBe(true);
      expect(worldAreas.find((a) => a.id === 'science-sea')?.isUnlocked).toBe(false);
    });

    it('unlocks multiple areas at 100 sparks', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().updateFromSparks(CHILD_ID, 100);
      const { worldAreas } = useProgressionStore.getState();
      const unlocked = worldAreas.filter((a) => a.isUnlocked).map((a) => a.id);
      expect(unlocked).toContain('word-woods');
      expect(unlocked).toContain('math-mountains');
      expect(unlocked).toContain('science-sea');
      expect(unlocked).toContain('art-archipelago');
      expect(unlocked).not.toContain('history-highlands');
    });

    it('awards explorer badge when first additional area unlocks (sparks cross 20)', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().updateFromSparks(CHILD_ID, 20);
      const { badges } = useProgressionStore.getState();
      expect(badges.some((b) => b.badgeType === 'explorer')).toBe(true);
    });

    it('does not award explorer badge twice', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().updateFromSparks(CHILD_ID, 20);
      useProgressionStore.getState().updateFromSparks(CHILD_ID, 60);
      const { badges } = useProgressionStore.getState();
      expect(badges.filter((b) => b.badgeType === 'explorer')).toHaveLength(1);
    });

    it('updates mascot level and accessories from sparks', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().updateFromSparks(CHILD_ID, 40);
      const { mascot } = useProgressionStore.getState();
      // floor(40 / 20) + 1 = 3
      expect(mascot?.level).toBe(3);
      expect(mascot?.experience).toBe(40);
      expect(mascot?.accessories).toEqual(['glasses', 'hat']);
    });

    it('gives level 4+ mascot the cape accessory', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().updateFromSparks(CHILD_ID, 60);
      const { mascot } = useProgressionStore.getState();
      // floor(60 / 20) + 1 = 4
      expect(mascot?.level).toBe(4);
      expect(mascot?.accessories).toEqual(['glasses', 'hat', 'cape']);
    });
  });

  describe('checkAndAwardBadges — correct-answer (AC1)', () => {
    it('awards first-correct badge at totalCorrect=1', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      const awarded = useProgressionStore.getState().checkAndAwardBadges(CHILD_ID, {
        type: 'correct-answer',
        totalCorrect: 1,
      });
      expect(awarded.map((b) => b.badgeType)).toContain('first-correct');
      expect(useProgressionStore.getState().badges.some((b) => b.badgeType === 'first-correct')).toBe(true);
    });

    it('awards ten-correct badge at totalCorrect=10', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      const awarded = useProgressionStore.getState().checkAndAwardBadges(CHILD_ID, {
        type: 'correct-answer',
        totalCorrect: 10,
      });
      expect(awarded.map((b) => b.badgeType)).toContain('ten-correct');
    });

    it('does not award any badge at totalCorrect=5', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      const awarded = useProgressionStore.getState().checkAndAwardBadges(CHILD_ID, {
        type: 'correct-answer',
        totalCorrect: 5,
      });
      expect(awarded).toEqual([]);
    });

    it('does not re-award first-correct badge once earned', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().checkAndAwardBadges(CHILD_ID, { type: 'correct-answer', totalCorrect: 1 });
      const awardedAgain = useProgressionStore.getState().checkAndAwardBadges(CHILD_ID, { type: 'correct-answer', totalCorrect: 1 });
      expect(awardedAgain).toEqual([]);
      expect(useProgressionStore.getState().badges.filter((b) => b.badgeType === 'first-correct')).toHaveLength(1);
    });

    it('sets newBadgeNotification when a badge is awarded', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().checkAndAwardBadges(CHILD_ID, { type: 'correct-answer', totalCorrect: 1 });
      expect(useProgressionStore.getState().newBadgeNotification?.badgeType).toBe('first-correct');
    });
  });

  describe('checkAndAwardBadges — game-complete (AC1)', () => {
    it('awards game-complete badge on first game-complete event', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      const awarded = useProgressionStore.getState().checkAndAwardBadges(CHILD_ID, { type: 'game-complete' });
      expect(awarded.map((b) => b.badgeType)).toContain('game-complete');
    });

    it('does not double-award game-complete badge', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().checkAndAwardBadges(CHILD_ID, { type: 'game-complete' });
      const awardedAgain = useProgressionStore.getState().checkAndAwardBadges(CHILD_ID, { type: 'game-complete' });
      expect(awardedAgain).toEqual([]);
      expect(useProgressionStore.getState().badges.filter((b) => b.badgeType === 'game-complete')).toHaveLength(1);
    });
  });

  describe('checkAndAwardBadges — streak-check (AC1, AC6)', () => {
    it('awards five-day-streak badge at streakDays=5', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      const awarded = useProgressionStore.getState().checkAndAwardBadges(CHILD_ID, { type: 'streak-check', streakDays: 5 });
      expect(awarded.map((b) => b.badgeType)).toContain('five-day-streak');
    });

    it('awards five-day-streak badge at streakDays greater than 5', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      const awarded = useProgressionStore.getState().checkAndAwardBadges(CHILD_ID, { type: 'streak-check', streakDays: 8 });
      expect(awarded.map((b) => b.badgeType)).toContain('five-day-streak');
    });

    it('does not award five-day-streak badge at streakDays=4', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      const awarded = useProgressionStore.getState().checkAndAwardBadges(CHILD_ID, { type: 'streak-check', streakDays: 4 });
      expect(awarded).toEqual([]);
    });
  });

  describe('recordActivity (AC6)', () => {
    it('first activity sets currentStreak to 1', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().recordActivity(CHILD_ID, '2026-05-15');
      const { streak } = useProgressionStore.getState();
      expect(streak?.currentStreak).toBe(1);
      expect(streak?.longestStreak).toBe(1);
      expect(streak?.lastActivityDate).toBe('2026-05-15');
    });

    it('increments currentStreak on consecutive day', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().recordActivity(CHILD_ID, '2026-05-14');
      useProgressionStore.getState().recordActivity(CHILD_ID, '2026-05-15');
      const { streak } = useProgressionStore.getState();
      expect(streak?.currentStreak).toBe(2);
      expect(streak?.longestStreak).toBe(2);
    });

    it('does not change streak when activity recorded same day', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().recordActivity(CHILD_ID, '2026-05-15');
      useProgressionStore.getState().recordActivity(CHILD_ID, '2026-05-15');
      const { streak } = useProgressionStore.getState();
      expect(streak?.currentStreak).toBe(1);
    });

    it('resets currentStreak to 1 after a gap of more than 1 day', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().recordActivity(CHILD_ID, '2026-05-10');
      useProgressionStore.getState().recordActivity(CHILD_ID, '2026-05-15');
      const { streak } = useProgressionStore.getState();
      expect(streak?.currentStreak).toBe(1);
      // longest streak preserved from before the gap
      expect(streak?.longestStreak).toBe(1);
    });

    it('preserves longestStreak across a reset', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().recordActivity(CHILD_ID, '2026-05-12');
      useProgressionStore.getState().recordActivity(CHILD_ID, '2026-05-13');
      useProgressionStore.getState().recordActivity(CHILD_ID, '2026-05-14');
      useProgressionStore.getState().recordActivity(CHILD_ID, '2026-05-20'); // gap → reset
      const { streak } = useProgressionStore.getState();
      expect(streak?.currentStreak).toBe(1);
      expect(streak?.longestStreak).toBe(3);
    });

    it('does not increment streak while paused', () => {
      _localStorage.setItem(streakKey, JSON.stringify({
        childId: CHILD_ID,
        currentStreak: 3,
        longestStreak: 5,
        lastActivityDate: '2026-05-10',
        pausedUntil: '2026-05-20',
      }));
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().recordActivity(CHILD_ID, '2026-05-15');
      const { streak } = useProgressionStore.getState();
      expect(streak?.currentStreak).toBe(3);
      expect(streak?.lastActivityDate).toBe('2026-05-10');
    });
  });

  describe('dismissNotification (AC1)', () => {
    it('clears newBadgeNotification', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().checkAndAwardBadges(CHILD_ID, { type: 'correct-answer', totalCorrect: 1 });
      expect(useProgressionStore.getState().newBadgeNotification).not.toBeNull();
      useProgressionStore.getState().dismissNotification();
      expect(useProgressionStore.getState().newBadgeNotification).toBeNull();
    });
  });

  describe('localStorage persistence (AC4)', () => {
    it('persists badges and mascot to lt_progression_<childId>', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().checkAndAwardBadges(CHILD_ID, { type: 'correct-answer', totalCorrect: 1 });
      useProgressionStore.getState().updateFromSparks(CHILD_ID, 40);
      const raw = _localStorage.getItem(progressionKey);
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed.badges.some((b: Badge) => b.badgeType === 'first-correct')).toBe(true);
      expect(parsed.mascot.level).toBe(3);
    });

    it('persists streak to lt_streak_<childId>', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().recordActivity(CHILD_ID, '2026-05-15');
      const raw = _localStorage.getItem(streakKey);
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed.currentStreak).toBe(1);
      expect(parsed.lastActivityDate).toBe('2026-05-15');
    });

    it('badge state survives a re-hydrate (persists across cloud sync retries)', () => {
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      useProgressionStore.getState().checkAndAwardBadges(CHILD_ID, { type: 'game-complete' });
      // Simulate fresh load
      useProgressionStore.setState({ badges: [], worldAreas: [], mascot: null, streak: null, newBadgeNotification: null });
      useProgressionStore.getState().hydrateProgression(CHILD_ID);
      expect(useProgressionStore.getState().badges.some((b) => b.badgeType === 'game-complete')).toBe(true);
    });
  });
});
