'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/hooks/useContent';
import { PuzzleOfTheDay } from '@/components/home/PuzzleOfTheDay';
import { DailyChallengeCard } from '@/components/home/DailyChallengeCard';
import { GameCard } from '@/components/home/GameCard';
import { HeroSection } from '@/components/home/HeroSection';
import { useProgressionStore } from '@/lib/stores/progressionStore';
import { getDailyGame } from '@/lib/utils/dailyChallenge';
import { Type, Network, Layers, Shapes, LayoutGrid } from 'lucide-react';

const ICON_CLASS = 'w-7 h-7';

const GAMES = [
  { title: 'Word Pop',         description: 'Can you crack the secret word? Go!',                href: '/play/word-pop',         color: 'blue'   as const, icon: <Type className={ICON_CLASS} /> },
  { title: 'Connection Quest', description: "Spot what links them — it's trickier than it looks!", href: '/play/connection-quest', color: 'green'  as const, icon: <Network className={ICON_CLASS} /> },
  { title: 'Memory Flip',      description: 'Flip, match, WIN. How fast can you go?',             href: '/play/memory-flip',      color: 'violet' as const, icon: <Layers className={ICON_CLASS} /> },
  { title: 'Pattern Builder',  description: 'Finish the pattern before time runs out!',           href: '/play/pattern-builder',  color: 'amber'  as const, icon: <Shapes className={ICON_CLASS} /> },
  { title: 'Grid Logic',       description: 'Only the sharpest thinkers solve this one.',         href: '/play/grid-logic',       color: 'rose'   as const, icon: <LayoutGrid className={ICON_CLASS} /> },
];

export default function HomePage() {
  const { isAuthenticated, childProfile, isLoading: authLoading } = useAuth();
  const { streak } = useProgressionStore();
  const streakDays = streak?.currentStreak ?? 0;
  const router = useRouter();
  const { dailyPuzzle, isLoading: contentLoading, error, clearError } = useContent();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      if (!childProfile) {
        router.push('/profile-select');
        return;
      }
    }
  }, [isAuthenticated, childProfile, authLoading, router]);

  if (authLoading || !isAuthenticated || !childProfile) {
    return (
      <div className="min-h-screen animate-pulse" aria-busy="true" aria-live="polite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="h-32 bg-white/20 rounded-3xl mb-8" />
          <div className="h-24 bg-white/20 rounded-3xl mb-3" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white/20 rounded-2xl mb-3" />
          ))}
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  const handlePuzzleStart = () => {
    if (dailyPuzzle) {
      posthog.capture('daily_puzzle_started', { puzzle_type: dailyPuzzle.type });
      router.push(`/play/${dailyPuzzle.type}`);
    }
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Hero */}
        <HeroSection childName={childProfile.name} streakCount={streakDays} />

        {/* Error banner */}
        {error && (
          <div
            role="alert"
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between"
          >
            <span className="text-sm">{error}</span>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 ml-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Puzzle of the Day */}
        <div className="mb-8">
          <PuzzleOfTheDay puzzle={dailyPuzzle} onStart={handlePuzzleStart} />
        </div>

        {/* Games section */}
        <section aria-labelledby="games-heading" className="mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <h2 id="games-heading" className="text-2xl font-black text-white drop-shadow-md">
              Pick your game!
            </h2>
            {contentLoading && (
              <span className="text-sm text-white/70" aria-live="polite">Loading…</span>
            )}
          </div>
          {/* Featured full-width Daily Challenge card */}
          <div className="mb-3">
            <DailyChallengeCard gameType={getDailyGame()} title="Your brain challenge is ready!" />
          </div>
          {/* 5-game grid */}
          <div data-testid="game-grid" className="flex flex-col gap-3">
            {GAMES.map((game) => (
              <GameCard key={game.href} {...game} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
