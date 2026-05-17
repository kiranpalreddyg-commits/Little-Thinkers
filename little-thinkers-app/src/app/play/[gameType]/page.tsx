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

const GAME_ICONS: Record<string, string> = {
  'word-pop': '🔤',
  'connection-quest': '🔗',
  'memory-flip': '🃏',
  'pattern-builder': '🧩',
  'grid-logic': '⊞',
};

const GAME_GRADIENTS: Record<string, string> = {
  'word-pop':         'from-blue-400 via-blue-500 to-blue-700',
  'connection-quest': 'from-emerald-400 via-emerald-500 to-emerald-700',
  'memory-flip':      'from-violet-400 via-violet-500 to-violet-700',
  'pattern-builder':  'from-amber-300 via-amber-400 to-amber-600',
  'grid-logic':       'from-rose-400 via-rose-500 to-rose-700',
};

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
  const rawGameType = params.gameType;
  const gameType = Array.isArray(rawGameType) ? rawGameType[0] : (rawGameType ?? '');

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { games, isLoading: contentLoading } = useContent();
  const { session, hydrateSession, clearSession } = useGameSession();

  const game = games.find((g) => g.type === gameType);

  const [selected, setSelected] = useState<Difficulty>('easy');
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (!game) return;
    hydrateSession(game.type);
  }, [game?.type, hydrateSession]);

  useEffect(() => {
    if (game && game.difficulties.length > 0) {
      setSelected(game.difficulties[0]);
    }
  }, [game]);

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
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand)]"
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
          <p className="text-5xl mb-4" aria-hidden="true">🤔</p>
          <p className="text-gray-700 font-semibold mb-2">Oops, we couldn&apos;t find that game!</p>
          <p className="text-gray-500 text-sm mb-6">Let&apos;s head home and pick one.</p>
          <button
            type="button"
            onClick={() => router.push('/')}
            aria-label="Back to home"
            className="px-6 py-3 bg-[var(--color-brand)] text-white font-black rounded-2xl
              hover:bg-[var(--color-brand-dark)] focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)]
              transition-colors min-h-[44px]"
          >
            Take me home 🏠
          </button>
        </div>
      </div>
    );
  }

  const gradient = GAME_GRADIENTS[gameType] ?? 'from-violet-400 via-violet-500 to-violet-700';
  const instructions =
    GAME_INSTRUCTIONS[gameType] ?? 'Follow the on-screen prompts to play this game.';

  const handleStartGame = () => {
    router.push(`/play/${game.type}/play?difficulty=${selected}`);
  };

  if (session && session.gameType === game.type) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${gradient}`}>
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
    <div className={`min-h-screen bg-gradient-to-br ${gradient}`}>
      <div data-testid="game-detail-card" className="max-w-2xl mx-auto px-4 pt-8 pb-24">
        {/* Large game icon */}
        <div
          data-testid="game-icon"
          aria-hidden="true"
          className="w-24 h-24 text-7xl flex items-center justify-center mx-auto mb-4"
        >
          {GAME_ICONS[gameType] ?? '🎮'}
        </div>

        {/* Page heading — centered, white on gradient */}
        <h1 className="text-3xl font-black text-white text-center mb-2">{game.name}</h1>
        <p className="text-white/80 text-center mb-8">{game.description}</p>

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
            type="button"
            onClick={() => router.push('/')}
            aria-label="Back to home"
            className="px-6 py-3 bg-white/20 border-2 border-white/40 text-white font-black rounded-2xl
              hover:bg-white/30 hover:border-white/60
              focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-white/50
              transition-colors min-h-[44px]"
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleStartGame}
            aria-disabled={!acknowledged}
            aria-describedby={!acknowledged ? 'start-hint' : undefined}
            disabled={!acknowledged}
            className="flex-1 px-6 py-4 bg-white text-[var(--color-brand)] font-black rounded-2xl text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-[transform,box-shadow] duration-200 will-change-transform min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none disabled:hover:scale-100"
          >
            Start Game
          </button>
        </div>
        {!acknowledged && (
          <p id="start-hint" className="sr-only">Read and acknowledge the instructions above to start.</p>
        )}
      </div>
    </div>
  );
}
