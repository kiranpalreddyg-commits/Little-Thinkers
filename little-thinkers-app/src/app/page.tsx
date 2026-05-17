'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/hooks/useContent';
import { PuzzleOfTheDay } from '@/components/home/PuzzleOfTheDay';
import { ContentSection } from '@/components/home/ContentSection';
import { ContentFilterBar } from '@/components/home/ContentFilter';
import { DailyChallengeCard } from '@/components/home/DailyChallengeCard';
import { GameCard } from '@/components/home/GameCard';
import { HeroSection } from '@/components/home/HeroSection';
import { useProgressionStore } from '@/lib/stores/progressionStore';
import { getDailyGame } from '@/lib/utils/dailyChallenge';

const GAMES = [
  { title: 'Word Pop',         description: 'Can you crack the secret word? Go!',                href: '/play/word-pop',         color: 'blue'   as const, icon: '🔤' },
  { title: 'Connection Quest', description: "Spot what links them — it's trickier than it looks!", href: '/play/connection-quest', color: 'green'  as const, icon: '🔗' },
  { title: 'Memory Flip',      description: 'Flip, match, WIN. How fast can you go?',             href: '/play/memory-flip',      color: 'violet' as const, icon: '🃏' },
  { title: 'Pattern Builder',  description: 'Finish the pattern before time runs out!',           href: '/play/pattern-builder',  color: 'amber'  as const, icon: '🧩' },
  { title: 'Grid Logic',       description: 'Only the sharpest thinkers solve this one.',         href: '/play/grid-logic',       color: 'rose'   as const, icon: '⊞' },
];

export default function HomePage() {
  const { isAuthenticated, childProfile, isLoading: authLoading } = useAuth();
  const { streak } = useProgressionStore();
  const streakDays = streak?.currentStreak ?? 0;
  const router = useRouter();
  const {
    dailyPuzzle,
    stories,
    scienceTopics,
    filter,
    isLoading: contentLoading,
    error,
    setFilter,
    clearError,
  } = useContent();

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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" aria-live="polite" aria-busy="true">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" role="status">
          <span className="sr-only">Loading…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !childProfile) {
    return null;
  }

  const handlePuzzleStart = () => {
    if (dailyPuzzle) {
      router.push(`/play/${dailyPuzzle.type}`);
    }
  };

  const handleContentItemSelect = (id: string) => {
    router.push(`/content/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBEB] via-[#FFF7ED] to-[#F0FDF4]">
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
            <h2 id="games-heading" className="text-2xl font-black text-gray-900">
              Pick your game!
            </h2>
            {contentLoading && (
              <span className="text-sm text-gray-500" aria-live="polite">Loading…</span>
            )}
          </div>
          {/* Featured full-width Daily Challenge card */}
          <div className="mb-3">
            <DailyChallengeCard gameType={getDailyGame()} title="Your brain challenge is ready!" />
          </div>
          {/* 5-game grid */}
          <div data-testid="game-grid" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GAMES.map((game) => (
              <GameCard key={game.href} {...game} />
            ))}
          </div>
        </section>

        {/* Educational content sections */}
        <section aria-labelledby="content-heading" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 id="content-heading" className="text-2xl font-bold text-gray-900">
              Explore &amp; Learn
            </h2>
            <ContentFilterBar filter={filter} onFilterChange={setFilter} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tell Me Why */}
            <ContentSection
              heading="Tell Me Why?"
              description="Fascinating science questions answered"
              items={scienceTopics}
              accentColor="bg-amber-500"
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              onItemSelect={handleContentItemSelect}
            />

            {/* Story Time */}
            <ContentSection
              heading="Story Time"
              description="Short stories with big ideas"
              items={stories}
              accentColor="bg-pink-500"
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              }
              onItemSelect={handleContentItemSelect}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
