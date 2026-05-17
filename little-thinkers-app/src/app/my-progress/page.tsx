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

  if (!isAuthenticated) return null;

  return (
    <div
      data-testid="progress-page"
      className="min-h-screen bg-gradient-to-b from-violet-100 via-emerald-50 to-amber-50"
      style={{ animation: 'fadeSlideUp 300ms cubic-bezier(0.22, 1, 0.36, 1) both' }}
    >
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-10 pb-24">
        <h1 className="text-4xl font-black text-gray-900">My Adventures!</h1>

        {/* World Map — full width, first for visual dominance */}
        <WorldMap areas={worldAreas} />

        {/* Mascot + Streak row */}
        <section aria-labelledby="mascot-heading" className="flex flex-wrap items-start gap-8">
          <div>
            <h2 id="mascot-heading" className="text-2xl font-black text-gray-700 mb-3">Your Mascot 🧠</h2>
            <MascotWidget mascot={mascot} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-700 mb-3">Your Hot Streak 🔥</h2>
            <StreakDisplay streak={streak} />
          </div>
        </section>

        {/* Badges */}
        <section aria-labelledby="badges-heading">
          <h2 id="badges-heading" className="text-2xl font-black text-gray-700 mb-3">Your Trophy Case 🏆</h2>
          <BadgeList badges={badges} />
        </section>
      </div>
    </div>
  );
}
