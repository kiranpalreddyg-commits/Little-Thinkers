'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/hooks/useContent';
import { ContentSection } from '@/components/home/ContentSection';
import { ContentFilterBar } from '@/components/home/ContentFilter';

export default function LearnPage() {
  const { isAuthenticated, childProfile, isLoading } = useAuth();
  const router = useRouter();
  const { stories, scienceTopics, filter, setFilter, isLoading: contentLoading } = useContent();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) { router.push('/login'); return; }
      if (!childProfile)    { router.push('/profile-select'); return; }
    }
  }, [isAuthenticated, childProfile, isLoading, router]);

  if (isLoading || !isAuthenticated || !childProfile) {
    return (
      <div className="min-h-screen pb-24 animate-pulse" aria-busy="true" aria-live="polite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <div className="h-9 w-28 bg-white/20 rounded-xl" />
              <div className="h-4 w-56 bg-white/15 rounded-lg" />
            </div>
            <div className="h-10 w-36 bg-white/20 rounded-full" />
          </div>
          <div className="bg-white/10 rounded-[2rem] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[0, 1].map((col) => (
                <div key={col} className="space-y-3">
                  <div className="h-6 w-40 bg-gray-200/60 rounded-lg" />
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-100/60 rounded-xl" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  function handleItemSelect(id: string) {
    router.push(`/content/${id}`);
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-black text-white drop-shadow-md">Learn</h1>
            <p className="text-white/80 text-sm mt-0.5">Stories and science — explore and discover!</p>
          </div>
          <ContentFilterBar filter={filter} onFilterChange={setFilter} />
        </div>

        {contentLoading && (
          <p className="text-sm text-gray-400 mb-4" aria-live="polite">Loading content…</p>
        )}

        <div
          className="bg-white rounded-[2rem] border-[3px] p-6"
          style={{ borderColor: 'var(--theme-border)', boxShadow: '0 8px 0 var(--theme-shadow)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              onItemSelect={handleItemSelect}
            />
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
              onItemSelect={handleItemSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
