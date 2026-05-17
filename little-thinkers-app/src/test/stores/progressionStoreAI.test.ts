/**
 * Story 8.2 — Adaptive Difficulty + Hint Tracking (AC1, AC4, AC5)
 *
 * RED tests: gameDifficulty / answerWindow / hintsUsed state and the three
 * new actions (recordAnswer, recordHintUsed, getDifficulty) do NOT exist yet.
 * All tests MUST FAIL until the store is extended.
 */

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

const GAME_TYPES = [
  'word-pop',
  'connection-quest',
  'memory-flip',
  'pattern-builder',
  'grid-logic',
] as const;

const CHILD_ID = 'child-1';

beforeEach(() => {
  _localStorage.clear();
  // Reset to baseline state — new AI fields must also reset to defaults.
  useProgressionStore.setState({
    badges: [],
    worldAreas: [],
    mascot: null,
    streak: null,
    newBadgeNotification: null,
    // The new state fields below don't exist yet — this setState will simply
    // not apply them, which means getDifficulty / answerWindow / hintsUsed
    // will be undefined and every test that reads them will fail as expected.
    gameDifficulty: Object.fromEntries(GAME_TYPES.map((g) => [g, 2])) as Record<string, 1|2|3|4|5>,
    answerWindow: Object.fromEntries(GAME_TYPES.map((g) => [g, []])) as Record<string, boolean[]>,
    hintsUsed: Object.fromEntries(GAME_TYPES.map((g) => [g, 0])) as Record<string, number>,
  });
});

describe('progressionStore — AI adaptive difficulty (AC1)', () => {
  describe('initial state', () => {
    it('gameDifficulty initialises at level 2 for all 5 game types', () => {
      const { gameDifficulty } = useProgressionStore.getState();
      for (const gt of GAME_TYPES) {
        expect(gameDifficulty[gt]).toBe(2);
      }
    });

    it('answerWindow initialises as empty arrays for all 5 game types', () => {
      const { answerWindow } = useProgressionStore.getState();
      for (const gt of GAME_TYPES) {
        expect(answerWindow[gt]).toEqual([]);
      }
    });

    it('hintsUsed initialises at 0 for all 5 game types', () => {
      const { hintsUsed } = useProgressionStore.getState();
      for (const gt of GAME_TYPES) {
        expect(hintsUsed[gt]).toBe(0);
      }
    });
  });

  describe('recordAnswer (AC1)', () => {
    it('adds a boolean entry to the answer window for the given game type', () => {
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', true);
      const { answerWindow } = useProgressionStore.getState();
      expect(answerWindow['word-pop']).toHaveLength(1);
      expect(answerWindow['word-pop'][0]).toBe(true);
    });

    it('does not affect answer windows for other game types', () => {
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', true);
      const { answerWindow } = useProgressionStore.getState();
      expect(answerWindow['memory-flip']).toEqual([]);
    });

    it('increases gameDifficulty after 3 consecutive correct answers', () => {
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', true);
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', true);
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', true);
      const { gameDifficulty } = useProgressionStore.getState();
      expect(gameDifficulty['word-pop']).toBe(3);
    });

    it('decreases gameDifficulty after 3 consecutive incorrect answers', () => {
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', false);
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', false);
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', false);
      const { gameDifficulty } = useProgressionStore.getState();
      expect(gameDifficulty['word-pop']).toBe(1);
    });

    it('does not change difficulty after a mixed run of 3', () => {
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', true);
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', false);
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', true);
      const { gameDifficulty } = useProgressionStore.getState();
      expect(gameDifficulty['word-pop']).toBe(2);
    });

    it('difficulty never exceeds 5 (upper bound)', () => {
      // Force difficulty to 5 first
      useProgressionStore.setState({
        gameDifficulty: { ...Object.fromEntries(GAME_TYPES.map((g) => [g, 2])), 'word-pop': 5 } as Record<string, 1|2|3|4|5>,
        answerWindow: Object.fromEntries(GAME_TYPES.map((g) => [g, []])) as Record<string, boolean[]>,
        hintsUsed: Object.fromEntries(GAME_TYPES.map((g) => [g, 0])) as Record<string, number>,
      });
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', true);
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', true);
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', true);
      const { gameDifficulty } = useProgressionStore.getState();
      expect(gameDifficulty['word-pop']).toBe(5);
    });

    it('difficulty never drops below 1 (lower bound)', () => {
      // Difficulty already at 1
      useProgressionStore.setState({
        gameDifficulty: { ...Object.fromEntries(GAME_TYPES.map((g) => [g, 2])), 'word-pop': 1 } as Record<string, 1|2|3|4|5>,
        answerWindow: Object.fromEntries(GAME_TYPES.map((g) => [g, []])) as Record<string, boolean[]>,
        hintsUsed: Object.fromEntries(GAME_TYPES.map((g) => [g, 0])) as Record<string, number>,
      });
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', false);
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', false);
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', false);
      const { gameDifficulty } = useProgressionStore.getState();
      expect(gameDifficulty['word-pop']).toBe(1);
    });

    it('answer window is capped at 10 entries (oldest entry dropped when 11th added)', () => {
      // Record 11 answers
      for (let i = 0; i < 11; i++) {
        useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', i % 2 === 0);
      }
      const { answerWindow } = useProgressionStore.getState();
      expect(answerWindow['word-pop']).toHaveLength(10);
    });
  });

  describe('recordHintUsed (AC4)', () => {
    it('increments hintsUsed for the given game type from 0 to 1', () => {
      useProgressionStore.getState().recordHintUsed('word-pop');
      const { hintsUsed } = useProgressionStore.getState();
      expect(hintsUsed['word-pop']).toBe(1);
    });

    it('increments hintsUsed a second time to reach 2', () => {
      useProgressionStore.getState().recordHintUsed('word-pop');
      useProgressionStore.getState().recordHintUsed('word-pop');
      const { hintsUsed } = useProgressionStore.getState();
      expect(hintsUsed['word-pop']).toBe(2);
    });

    it('does not affect hintsUsed for other game types', () => {
      useProgressionStore.getState().recordHintUsed('word-pop');
      const { hintsUsed } = useProgressionStore.getState();
      expect(hintsUsed['memory-flip']).toBe(0);
    });
  });

  describe('getDifficulty (AC1)', () => {
    it('returns current difficulty level 2 for word-pop by default', () => {
      const difficulty = useProgressionStore.getState().getDifficulty('word-pop');
      expect(difficulty).toBe(2);
    });

    it('returns updated difficulty after 3 consecutive correct answers', () => {
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', true);
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', true);
      useProgressionStore.getState().recordAnswer(CHILD_ID, 'word-pop', true);
      expect(useProgressionStore.getState().getDifficulty('word-pop')).toBe(3);
    });

    it('returns difficulty for a game type that has never been played (defaults to 2)', () => {
      const difficulty = useProgressionStore.getState().getDifficulty('grid-logic');
      expect(difficulty).toBe(2);
    });
  });
});
