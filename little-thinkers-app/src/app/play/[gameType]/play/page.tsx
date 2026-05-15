'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/hooks/useContent';
import { useGameSession } from '@/hooks/useGameSession';
import { PauseOverlay } from '@/components/game/PauseOverlay';

function GameplayPageInner() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const gameType = params.gameType as string;
  const difficulty = (searchParams.get('difficulty') ?? 'medium') as
    | 'easy'
    | 'medium'
    | 'hard';

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { games } = useContent();
  const { session, startSession, pauseSession, resumeSession, clearSession, loadSession } =
    useGameSession();

  const game = games.find((g) => g.type === gameType);

  // isPaused mirrors session?.isPaused; local state keeps the UI responsive
  // when the store is wired but not yet reflected (e.g. optimistic updates).
  const [isPaused, setIsPaused] = useState<boolean>(session?.isPaused ?? false);

  // Keep local isPaused in sync whenever the store session changes
  useEffect(() => {
    setIsPaused(session?.isPaused ?? false);
  }, [session?.isPaused]);

  // On mount: resume saved session or start fresh — uses game.type (GameType) not raw string
  useEffect(() => {
    if (!game) return;
    const existing = loadSession(game.type);
    if (existing && existing.difficulty === difficulty) {
      resumeSession(); // continue from saved state
    } else {
      startSession(game.type, difficulty); // fresh game
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.type, difficulty]);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (!game) {
    return null;
  }

  const handlePause = () => {
    pauseSession(); // persist to store
    setIsPaused(true); // optimistic UI update
  };

  const handleResume = () => {
    resumeSession(); // persist to store
    setIsPaused(false); // optimistic UI update
  };

  const handleQuit = () => {
    clearSession();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{game.name}</h1>

        {/* Placeholder game area */}
        <div
          data-testid="game-area"
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 mb-8 text-center text-gray-500 text-lg"
        >
          Gameplay coming soon
        </div>

        {/* Pause button — hidden when paused */}
        {!isPaused && (
          <button
            onClick={handlePause}
            aria-label="Pause Game"
            className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-xl
              hover:bg-yellow-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-yellow-400
              transition-colors min-h-[44px]"
          >
            Pause Game
          </button>
        )}

        {/* Pause overlay */}
        {isPaused && (
          <PauseOverlay
            gameName={game.name}
            onResume={handleResume}
            onQuit={handleQuit}
          />
        )}
      </main>
    </div>
  );
}

export default function GameplayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="sr-only">Loading…</span>
        </div>
      }
    >
      <GameplayPageInner />
    </Suspense>
  );
}
