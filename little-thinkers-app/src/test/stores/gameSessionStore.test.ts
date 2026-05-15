import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// Vitest 4 breaks jsdom localStorage — stub a manual implementation.
const _store: Record<string, string> = {};
const _localStorage = {
  getItem: (key: string) => _store[key] ?? null,
  setItem: (key: string, value: string) => {
    _store[key] = value;
  },
  removeItem: (key: string) => {
    delete _store[key];
  },
  clear: () => {
    Object.keys(_store).forEach((k) => delete _store[k]);
  },
  get length() {
    return Object.keys(_store).length;
  },
  key: (n: number) => Object.keys(_store)[n] ?? null,
};

beforeAll(() => {
  vi.stubGlobal('localStorage', _localStorage);
});

import { useGameSessionStore } from '@/lib/stores/gameSessionStore';
import type { GameSession } from '@/lib/types/gameSession';

beforeEach(() => {
  _localStorage.clear();
  useGameSessionStore.setState({ session: null });
});

describe('gameSessionStore', () => {
  describe('startSession (AC5, AC9)', () => {
    it('creates a new session with the given gameType and difficulty', () => {
      useGameSessionStore.getState().startSession('word-pop', 'medium');
      const { session } = useGameSessionStore.getState();
      expect(session).not.toBeNull();
      expect(session?.gameType).toBe('word-pop');
      expect(session?.difficulty).toBe('medium');
    });

    it('initialises isPaused=false and progress=0', () => {
      useGameSessionStore.getState().startSession('word-pop', 'easy');
      const { session } = useGameSessionStore.getState();
      expect(session?.isPaused).toBe(false);
      expect(session?.progress).toBe(0);
    });

    it('sets startedAt to an ISO timestamp', () => {
      useGameSessionStore.getState().startSession('memory-flip', 'easy');
      const { session } = useGameSessionStore.getState();
      expect(session?.startedAt).toBeTruthy();
      // Should be parseable as a date
      expect(Number.isNaN(Date.parse(session!.startedAt))).toBe(false);
    });

    it('persists the session to localStorage under lt_game_session_${gameType}', () => {
      useGameSessionStore.getState().startSession('word-pop', 'hard');
      const raw = _localStorage.getItem('lt_game_session_word-pop');
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!) as GameSession;
      expect(parsed.gameType).toBe('word-pop');
      expect(parsed.difficulty).toBe('hard');
      expect(parsed.isPaused).toBe(false);
    });

    it('namespaces saved sessions per gameType', () => {
      useGameSessionStore.getState().startSession('word-pop', 'easy');
      useGameSessionStore.getState().startSession('memory-flip', 'medium');
      expect(_localStorage.getItem('lt_game_session_word-pop')).not.toBeNull();
      expect(_localStorage.getItem('lt_game_session_memory-flip')).not.toBeNull();
    });
  });

  describe('pauseSession (AC5, AC9)', () => {
    it('sets isPaused=true when there is an active session', () => {
      useGameSessionStore.getState().startSession('word-pop', 'easy');
      useGameSessionStore.getState().pauseSession();
      expect(useGameSessionStore.getState().session?.isPaused).toBe(true);
    });

    it('sets pausedAt to an ISO timestamp', () => {
      useGameSessionStore.getState().startSession('word-pop', 'easy');
      useGameSessionStore.getState().pauseSession();
      const { session } = useGameSessionStore.getState();
      expect(session?.pausedAt).toBeTruthy();
      expect(Number.isNaN(Date.parse(session!.pausedAt!))).toBe(false);
    });

    it('persists the paused session back to localStorage', () => {
      useGameSessionStore.getState().startSession('word-pop', 'easy');
      useGameSessionStore.getState().pauseSession();
      const raw = _localStorage.getItem('lt_game_session_word-pop');
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!) as GameSession;
      expect(parsed.isPaused).toBe(true);
      expect(parsed.pausedAt).toBeTruthy();
    });
  });

  describe('resumeSession (AC9)', () => {
    it('sets isPaused=false', () => {
      useGameSessionStore.getState().startSession('word-pop', 'easy');
      useGameSessionStore.getState().pauseSession();
      useGameSessionStore.getState().resumeSession();
      expect(useGameSessionStore.getState().session?.isPaused).toBe(false);
    });

    it('clears pausedAt timestamp', () => {
      useGameSessionStore.getState().startSession('word-pop', 'easy');
      useGameSessionStore.getState().pauseSession();
      useGameSessionStore.getState().resumeSession();
      expect(useGameSessionStore.getState().session?.pausedAt).toBeUndefined();
    });
  });

  describe('clearSession (AC8, AC9)', () => {
    it('sets the in-memory session to null', () => {
      useGameSessionStore.getState().startSession('word-pop', 'easy');
      useGameSessionStore.getState().clearSession();
      expect(useGameSessionStore.getState().session).toBeNull();
    });

    it('removes the saved session from localStorage', () => {
      useGameSessionStore.getState().startSession('word-pop', 'easy');
      expect(_localStorage.getItem('lt_game_session_word-pop')).not.toBeNull();
      useGameSessionStore.getState().clearSession();
      expect(_localStorage.getItem('lt_game_session_word-pop')).toBeNull();
    });
  });

  describe('loadSession (AC6, AC9)', () => {
    it('returns the saved session for the given gameType from localStorage', () => {
      useGameSessionStore.getState().startSession('word-pop', 'hard');
      // Simulate a fresh page load: clear in-memory state, keep localStorage
      useGameSessionStore.setState({ session: null });
      const loaded = useGameSessionStore.getState().loadSession('word-pop');
      expect(loaded).not.toBeNull();
      expect(loaded?.gameType).toBe('word-pop');
      expect(loaded?.difficulty).toBe('hard');
    });

    it('returns null when no session exists for that gameType', () => {
      const loaded = useGameSessionStore.getState().loadSession('word-pop');
      expect(loaded).toBeNull();
    });

    it('returns null for a different gameType even when another is saved', () => {
      useGameSessionStore.getState().startSession('word-pop', 'easy');
      useGameSessionStore.setState({ session: null });
      const loaded = useGameSessionStore.getState().loadSession('memory-flip');
      expect(loaded).toBeNull();
    });
  });
});
