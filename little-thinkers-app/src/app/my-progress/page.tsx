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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
        <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>

        {/* Mascot + Streak row */}
        <section className="flex flex-wrap items-start gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Your Mascot</h2>
            <MascotWidget mascot={mascot} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Your Streak</h2>
            <StreakDisplay streak={streak} />
          </div>
        </section>

        {/* World Map */}
        <section>
          <WorldMap areas={worldAreas} />
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Your Badges</h2>
          <BadgeList badges={badges} />
        </section>
      </div>
    </main>
  );
}
