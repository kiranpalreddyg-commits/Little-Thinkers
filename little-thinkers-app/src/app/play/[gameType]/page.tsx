'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/hooks/useContent';
import { useGameSession } from '@/hooks/useGameSession';
import { Difficulty } from '@/lib/types/content';
import { DifficultySelector } from '@/components/play/DifficultySelector';
import { InstructionsPanel } from '@/components/play/InstructionsPanel';
import { ResumePrompt } from '@/components/game/ResumePrompt';

const GAME_INSTRUCTIONS: Record<string, string> = {
  'word-pop':
    'Guess the hidden word by selecting letters one at a time. You have limited attempts, so choose wisely!',
  'connection-quest':
    'Find the connection between groups of words. Drag and drop words into their matching categories.',
  'memory-flip':
    'Flip cards to reveal pictures and find matching pairs. Remember the positions to find all pairs!',
  'pattern-builder':
    'Study the pattern and select the missing piece to complete the sequence.',
  'grid-logic':
    'Fill the grid using logic clues. Each row and column must satisfy all the given constraints.',
};

export default function PlayPage() {
  const router = useRouter();
  const params = useParams();
  const gameType = params.gameType as string;

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { games, isLoading: contentLoading } = useContent();
  const { session, hydrateSession, clearSession } = useGameSession();

  const game = games.find((g) => g.type === gameType);

  const [selected, setSelected] = useState<Difficulty>('easy');
  const [acknowledged, setAcknowledged] = useState(false);

  // Load any saved session for this game on mount
  useEffect(() => {
    if (!game) return;
    hydrateSession(game.type);
  }, [game?.type, hydrateSession]);

  // Sync selected to the game's first difficulty once the game is loaded
  useEffect(() => {
    if (game && game.difficulties.length > 0) {
      setSelected(game.difficulties[0]);
    }
  }, [game]);

  // Auth guard: redirect to /login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || contentLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        aria-live="polite"
        aria-busy="true"
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          role="status"
        >
          <span className="sr-only">Loading…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
          <p className="text-gray-500 mb-6">Game not found.</p>
          <button
            onClick={() => router.push('/')}
            aria-label="Back to home"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl
              hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-blue-500
              transition-colors min-h-[44px]"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const instructions =
    GAME_INSTRUCTIONS[gameType] ?? 'Follow the on-screen prompts to play this game.';

  const handleStartGame = () => {
    router.push(`/play/${game.type}/play?difficulty=${selected}`);
  };

  // If there is a saved session for this game, show the resume prompt
  if (session && session.gameType === game.type) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <ResumePrompt
          session={session}
          onResume={() =>
            router.push(`/play/${game.type}/play?difficulty=${session.difficulty}`)
          }
          onNewGame={() => clearSession()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Page heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{game.name}</h1>
        <p className="text-gray-600 mb-8">{game.description}</p>

        {/* Difficulty selector */}
        <div className="mb-8">
          <DifficultySelector
            difficulties={game.difficulties}
            selected={selected}
            onSelect={setSelected}
          />
        </div>

        {/* Instructions panel */}
        <div className="mb-8">
          <InstructionsPanel
            gameName={game.name}
            instructions={instructions}
            acknowledged={acknowledged}
            onAcknowledge={setAcknowledged}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/')}
            aria-label="Back to home"
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl
              hover:border-gray-400 hover:bg-gray-50
              focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-blue-500
              transition-colors min-h-[44px]"
          >
            Back
          </button>

          <button
            onClick={handleStartGame}
            disabled={!acknowledged}
            aria-label="Start Game"
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl
              hover:bg-blue-700
              focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-blue-500
              transition-colors min-h-[44px]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            Start Game
          </button>
        </div>
      </main>
    </div>
  );
}
