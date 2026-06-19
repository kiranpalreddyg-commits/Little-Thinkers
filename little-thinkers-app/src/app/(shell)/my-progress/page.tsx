'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProgression } from '@/hooks/useProgression';
import { BadgeList } from '@/components/progression/BadgeList';
import { MascotWidget } from '@/components/progression/MascotWidget';
import { StreakDisplay } from '@/components/progression/StreakDisplay';
import { WorldMap } from '@/components/progression/WorldMap';

export default function MyProgressPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, childProfile } = useAuth();
  const { badges, worldAreas, mascot, streak, hydrateProgression } = useProgression();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (childProfile?.id) {
      hydrateProgression(childProfile.id);
    }
  }, [childProfile?.id, hydrateProgression]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen animate-pulse" aria-busy="true" aria-live="polite">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-10 pb-24">
          <div className="h-10 w-64 bg-white/20 rounded-xl" />
          <div className="h-48 bg-white/15 rounded-3xl" />
          <div className="flex flex-wrap gap-8">
            <div className="space-y-3">
              <div className="h-6 w-36 bg-white/20 rounded-lg" />
              <div className="h-28 w-28 bg-white/15 rounded-2xl" />
            </div>
            <div className="space-y-3">
              <div className="h-6 w-36 bg-white/20 rounded-lg" />
              <div className="h-28 w-40 bg-white/15 rounded-2xl" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-6 w-48 bg-white/20 rounded-lg" />
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-white/15 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div
      data-testid="progress-page"
      className="min-h-screen"
      style={{ animation: 'fadeSlideUp 300ms cubic-bezier(0.22, 1, 0.36, 1) both' }}
    >
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-10 pb-24">
        <h1 className="text-4xl font-black text-white drop-shadow-md">My Adventures!</h1>

        {/* World Map — full width, first for visual dominance */}
        <WorldMap areas={worldAreas} />

        {/* Mascot + Streak row */}
        <section aria-labelledby="mascot-heading" className="flex flex-wrap items-start gap-8">
          <div>
            <h2 id="mascot-heading" className="text-2xl font-black text-white drop-shadow-sm mb-3">Your Mascot 🧠</h2>
            <MascotWidget mascot={mascot} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white drop-shadow-sm mb-3">Your Hot Streak 🔥</h2>
            <StreakDisplay streak={streak} />
          </div>
        </section>

        {/* Badges */}
        <section aria-labelledby="badges-heading">
          <h2 id="badges-heading" className="text-2xl font-black text-white drop-shadow-sm mb-3">Your Trophy Case 🏆</h2>
          <BadgeList badges={badges} />
        </section>
      </div>
    </div>
  );
}
