import { create } from 'zustand';
import { GameType, Difficulty } from '@/lib/types/content';
import { GameSession } from '@/lib/types/gameSession';

interface GameSessionState {
  session: GameSession | null;
  startSession: (gameType: GameType, difficulty: Difficulty) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  clearSession: () => void;
  /** Read-only: reads localStorage and returns the value without touching store state. */
  loadSession: (gameType: GameType) => GameSession | null;
  /** Reads localStorage and hydrates the store. Call from useEffect only. */
  hydrateSession: (gameType: GameType) => void;
}

const sessionKey = (gameType: GameType) => `lt_game_session_${gameType}`;

export const useGameSessionStore = create<GameSessionState>((set, get) => ({
  session: null,

  startSession: (gameType: GameType, difficulty: Difficulty) => {
    if (typeof window === 'undefined') return;
    const session: GameSession = {
      gameType,
      difficulty,
      startedAt: new Date().toISOString(),
      isPaused: false,
      progress: 0,
    };
    try {
      localStorage.setItem(sessionKey(gameType), JSON.stringify(session));
    } catch {
      // quota or safari-private — continue without persistence
    }
    set({ session });
  },

  pauseSession: () => {
    if (typeof window === 'undefined') return;
    const current = get().session;
    if (!current) return;
    const updated: GameSession = {
      ...current,
      isPaused: true,
      pausedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(sessionKey(current.gameType), JSON.stringify(updated));
    } catch {
      // quota or safari-private — continue without persistence
    }
    set({ session: updated });
  },

  resumeSession: () => {
    if (typeof window === 'undefined') return;
    const current = get().session;
    if (!current) return;
    const { pausedAt: _removed, ...rest } = current;
    const updated: GameSession = {
      ...rest,
      isPaused: false,
    };
    try {
      localStorage.setItem(sessionKey(current.gameType), JSON.stringify(updated));
    } catch {
      // quota or safari-private — continue without persistence
    }
    set({ session: updated });
  },

  clearSession: () => {
    if (typeof window === 'undefined') return;
    const current = get().session;
    if (current) {
      try {
        localStorage.removeItem(sessionKey(current.gameType));
      } catch {
        // quota or safari-private — continue without persistence
      }
    }
    set({ session: null });
  },

  /** Pure read — never calls set(). Safe to call during render. */
  loadSession: (gameType: GameType): GameSession | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(sessionKey(gameType));
      if (!raw) return null;
      return JSON.parse(raw) as GameSession;
    } catch {
      return null;
    }
  },

  /** Reads localStorage and updates store state. Call only from useEffect. */
  hydrateSession: (gameType: GameType) => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(sessionKey(gameType));
      if (!raw) {
        set({ session: null });
        return;
      }
      const parsed = JSON.parse(raw) as GameSession;
      set({ session: parsed });
    } catch {
      set({ session: null });
    }
  },
}));
