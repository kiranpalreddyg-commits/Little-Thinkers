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

import { useRewardsStore } from '@/lib/stores/rewardsStore';
import type { BrainJar } from '@/lib/types/rewards';

const CHILD_ID = 'child-1';
const storageKey = `lt_rewards_${CHILD_ID}`;

beforeEach(() => {
  _localStorage.clear();
  useRewardsStore.setState({
    brainJar: null,
    feedback: null,
    isAnimating: false,
  });
});

describe('rewardsStore', () => {
  describe('hydrateRewards (AC5, AC7)', () => {
    it('initialises brainJar from localStorage when data exists', () => {
      const saved = { totalSparks: 5, capacity: 20 };
      _localStorage.setItem(storageKey, JSON.stringify(saved));
      useRewardsStore.getState().hydrateRewards(CHILD_ID);
      const { brainJar } = useRewardsStore.getState();
      expect(brainJar).not.toBeNull();
      expect(brainJar?.totalSparks).toBe(5);
      expect(brainJar?.capacity).toBe(20);
      expect(brainJar?.childId).toBe(CHILD_ID);
    });

    it('initialises brainJar with totalSparks=0 when no localStorage data', () => {
      useRewardsStore.getState().hydrateRewards(CHILD_ID);
      const { brainJar } = useRewardsStore.getState();
      expect(brainJar?.totalSparks).toBe(0);
      expect(brainJar?.capacity).toBe(20);
      expect(brainJar?.fillPercent).toBe(0);
    });

    it('computes fillPercent correctly from stored totalSparks', () => {
      const saved = { totalSparks: 10, capacity: 20 };
      _localStorage.setItem(storageKey, JSON.stringify(saved));
      useRewardsStore.getState().hydrateRewards(CHILD_ID);
      expect(useRewardsStore.getState().brainJar?.fillPercent).toBe(50);
    });
  });

  describe('loadRewards (AC7)', () => {
    it('returns null when nothing is in localStorage', () => {
      const result = useRewardsStore.getState().loadRewards(CHILD_ID);
      expect(result).toBeNull();
    });

    it('returns the BrainJar without modifying store state', () => {
      const saved = { totalSparks: 3, capacity: 20 };
      _localStorage.setItem(storageKey, JSON.stringify(saved));
      useRewardsStore.setState({ brainJar: null });
      const result = useRewardsStore.getState().loadRewards(CHILD_ID);
      expect(result?.totalSparks).toBe(3);
      // State is unchanged
      expect(useRewardsStore.getState().brainJar).toBeNull();
    });
  });

  describe('earnSpark (AC1, AC3)', () => {
    it('increments totalSparks by 1 for easy/medium difficulty', () => {
      useRewardsStore.getState().hydrateRewards(CHILD_ID);
      useRewardsStore.getState().earnSpark(CHILD_ID, 'correct-answer', 1);
      expect(useRewardsStore.getState().brainJar?.totalSparks).toBe(1);
    });

    it('increments totalSparks by 2 for hard difficulty', () => {
      useRewardsStore.getState().hydrateRewards(CHILD_ID);
      useRewardsStore.getState().earnSpark(CHILD_ID, 'correct-answer', 2);
      expect(useRewardsStore.getState().brainJar?.totalSparks).toBe(2);
    });

    it('persists updated totalSparks to localStorage', () => {
      useRewardsStore.getState().hydrateRewards(CHILD_ID);
      useRewardsStore.getState().earnSpark(CHILD_ID, 'correct-answer', 1);
      const raw = _localStorage.getItem(storageKey);
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed.totalSparks).toBe(1);
    });

    it('recalculates fillPercent after earning', () => {
      const saved = { totalSparks: 9, capacity: 20 };
      _localStorage.setItem(storageKey, JSON.stringify(saved));
      useRewardsStore.getState().hydrateRewards(CHILD_ID);
      useRewardsStore.getState().earnSpark(CHILD_ID, 'correct-answer', 1);
      expect(useRewardsStore.getState().brainJar?.totalSparks).toBe(10);
      expect(useRewardsStore.getState().brainJar?.fillPercent).toBe(50);
    });

    it('sets isAnimating to true after earning a spark', () => {
      useRewardsStore.getState().hydrateRewards(CHILD_ID);
      useRewardsStore.getState().earnSpark(CHILD_ID, 'correct-answer', 1);
      expect(useRewardsStore.getState().isAnimating).toBe(true);
    });

    it('accumulates sparks across multiple calls', () => {
      useRewardsStore.getState().hydrateRewards(CHILD_ID);
      useRewardsStore.getState().earnSpark(CHILD_ID, 'correct-answer', 1);
      useRewardsStore.getState().earnSpark(CHILD_ID, 'correct-answer', 1);
      useRewardsStore.getState().earnSpark(CHILD_ID, 'correct-answer', 1);
      expect(useRewardsStore.getState().brainJar?.totalSparks).toBe(3);
    });
  });

  describe('completionBonus (AC4)', () => {
    it('adds 5 sparks when game is completed', () => {
      useRewardsStore.getState().hydrateRewards(CHILD_ID);
      useRewardsStore.getState().completionBonus(CHILD_ID, 'word-pop');
      expect(useRewardsStore.getState().brainJar?.totalSparks).toBe(5);
    });

    it('adds 5 on top of existing sparks', () => {
      const saved = { totalSparks: 3, capacity: 20 };
      _localStorage.setItem(storageKey, JSON.stringify(saved));
      useRewardsStore.getState().hydrateRewards(CHILD_ID);
      useRewardsStore.getState().completionBonus(CHILD_ID, 'word-pop');
      expect(useRewardsStore.getState().brainJar?.totalSparks).toBe(8);
    });

    it('persists completion bonus to localStorage', () => {
      useRewardsStore.getState().hydrateRewards(CHILD_ID);
      useRewardsStore.getState().completionBonus(CHILD_ID, 'word-pop');
      const raw = _localStorage.getItem(storageKey);
      expect(JSON.parse(raw!).totalSparks).toBe(5);
    });
  });

  describe('setFeedback / clearFeedback (AC1, AC2)', () => {
    it('stores feedback in state', () => {
      useRewardsStore.getState().setFeedback({
        type: 'correct',
        message: 'Great thinking! +1 Spark ✨',
        sparksAwarded: 1,
      });
      const { feedback } = useRewardsStore.getState();
      expect(feedback?.type).toBe('correct');
      expect(feedback?.sparksAwarded).toBe(1);
    });

    it('clearFeedback sets feedback to null', () => {
      useRewardsStore.getState().setFeedback({
        type: 'incorrect',
        message: 'Nice try!',
        sparksAwarded: 0,
      });
      useRewardsStore.getState().clearFeedback();
      expect(useRewardsStore.getState().feedback).toBeNull();
    });
  });

  describe('setAnimating (AC3, AC6)', () => {
    it('sets isAnimating to the given value', () => {
      useRewardsStore.getState().setAnimating(true);
      expect(useRewardsStore.getState().isAnimating).toBe(true);
      useRewardsStore.getState().setAnimating(false);
      expect(useRewardsStore.getState().isAnimating).toBe(false);
    });
  });

  describe('fillPercent wrapping (AC3)', () => {
    it('wraps fillPercent at 100% when jar is full', () => {
      const saved = { totalSparks: 19, capacity: 20 };
      _localStorage.setItem(storageKey, JSON.stringify(saved));
      useRewardsStore.getState().hydrateRewards(CHILD_ID);
      useRewardsStore.getState().earnSpark(CHILD_ID, 'correct-answer', 1);
      // 20 sparks = 100% (or 0% if we use modulo — use 100% for full jar)
      const pct = useRewardsStore.getState().brainJar?.fillPercent ?? 0;
      expect(pct).toBe(100);
    });
  });
});
