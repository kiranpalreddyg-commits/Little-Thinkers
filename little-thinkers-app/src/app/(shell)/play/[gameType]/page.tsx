'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import posthog from 'posthog-js';
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

  const instructions =
    GAME_INSTRUCTIONS[gameType] ?? 'Follow the on-screen prompts to play this game.';

  const handleStartGame = () => {
    posthog.capture('game_started', { game_type: game.type, difficulty: selected });
    router.push(`/play/${game.type}/play?difficulty=${selected}`);
  };

  if (session && session.gameType === game.type) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
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
    <div className="min-h-screen">
      <div data-testid="game-detail-card" className="max-w-2xl mx-auto px-4 pt-8 pb-24">
        {/* Large game icon */}
        <div
          data-testid="game-icon"
          aria-hidden="true"
          className="w-24 h-24 text-7xl flex items-center justify-center mx-auto mb-4"
        >
          {GAME_ICONS[gameType] ?? '🎮'}
        </div>

        <h1
          className="text-3xl font-black text-center mb-2 drop-shadow-md"
          style={{ color: 'var(--theme-text)' }}
        >
          {game.name}
        </h1>
        <p className="text-center mb-8 font-semibold" style={{ color: 'var(--theme-text)', opacity: 0.75 }}>
          {game.description}
        </p>

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
            className="px-6 py-3 bg-white border-[3px] font-black rounded-[1.5rem] transition-transform active:translate-y-[2px] min-h-[44px]"
            style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text)', boxShadow: '0 4px 0 var(--theme-shadow)' }}
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleStartGame}
            aria-disabled={!acknowledged}
            aria-describedby={!acknowledged ? 'start-hint' : undefined}
            disabled={!acknowledged}
            className="flex-1 px-6 py-4 font-black rounded-[1.5rem] text-lg text-white transition-transform active:translate-y-[2px] min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--theme-border)', boxShadow: '0 6px 0 var(--theme-shadow)' }}
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
