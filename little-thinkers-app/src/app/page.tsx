'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/hooks/useContent';
import { GameGrid } from '@/components/home/GameGrid';
import { PuzzleOfTheDay } from '@/components/home/PuzzleOfTheDay';
import { ContentSection } from '@/components/home/ContentSection';
import { ContentFilterBar } from '@/components/home/ContentFilter';
import { GameType } from '@/lib/types/content';
import { DailyChallengeCard } from '@/components/home/DailyChallengeCard';
import { getDailyGame } from '@/lib/utils/dailyChallenge';

export default function HomePage() {
  const { isAuthenticated, childProfile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const {
    games,
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

  const handleGameSelect = (gameType: GameType) => {
    router.push(`/play/${gameType}`);
  };

  const handlePuzzleStart = () => {
    if (dailyPuzzle) {
      router.push(`/play/${dailyPuzzle.type}`);
    }
  };

  const handleContentItemSelect = (id: string) => {
    router.push(`/content/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Welcome */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {childProfile.name}!
          </h1>
          <p className="text-gray-600">Ready to continue your learning adventure?</p>

          <div className="mt-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                childProfile.gameplay_mode === 'smart'
                  ? 'bg-green-100 text-green-800'
                  : childProfile.gameplay_mode === 'chill'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800'
              }`}
              aria-label={`Current mode: ${childProfile.gameplay_mode} mode`}
            >
              {childProfile.gameplay_mode === 'smart'
                ? 'Smart Mode'
                : childProfile.gameplay_mode === 'chill'
                ? 'Chill Mode'
                : 'Challenge Mode'}
            </span>
          </div>
        </div>

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
            <h2 id="games-heading" className="text-2xl font-bold text-gray-900">
              Choose Your Game
            </h2>
            {contentLoading && (
              <span className="text-sm text-gray-500" aria-live="polite">Loading…</span>
            )}
          </div>
          <GameGrid games={games} onGameSelect={handleGameSelect} />
          <div className="mt-5">
            <DailyChallengeCard gameType={getDailyGame()} title="Today's Featured Game" />
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
