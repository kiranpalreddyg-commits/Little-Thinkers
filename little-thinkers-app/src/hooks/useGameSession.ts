'use client';

import { useGameSessionStore } from '@/lib/stores/gameSessionStore';

export function useGameSession() {
  const store = useGameSessionStore();
  return {
    session: store.session,
    startSession: store.startSession,
    pauseSession: store.pauseSession,
    resumeSession: store.resumeSession,
    clearSession: store.clearSession,
    loadSession: store.loadSession,
    hydrateSession: store.hydrateSession,
    isPaused: store.session?.isPaused ?? false,
  };
}
