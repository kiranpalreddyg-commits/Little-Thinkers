'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { GameCard } from '@/components/home/GameCard';
import { DailyChallengeCard } from '@/components/home/DailyChallengeCard';
import { getDailyGame } from '@/lib/utils/dailyChallenge';

const GAMES = [
  { title: 'Word Pop',         description: 'Can you crack the secret word? Go!',                  href: '/play/word-pop',         color: 'blue'   as const, icon: '🔤' },
  { title: 'Connection Quest', description: "Spot what links them — it's trickier than it looks!", href: '/play/connection-quest', color: 'green'  as const, icon: '🔗' },
  { title: 'Memory Flip',      description: 'Flip, match, WIN. How fast can you go?',              href: '/play/memory-flip',      color: 'violet' as const, icon: '🃏' },
  { title: 'Pattern Builder',  description: 'Finish the pattern before time runs out!',            href: '/play/pattern-builder',  color: 'amber'  as const, icon: '🧩' },
  { title: 'Grid Logic',       description: 'Only the sharpest thinkers solve this one.',          href: '/play/grid-logic',       color: 'rose'   as const, icon: '⊞'  },
];

export default function PlayPage() {
  const { isAuthenticated, childProfile, isLoading } = useAuth();
  const router = useRouter();

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
          <div className="h-9 w-20 bg-white/20 rounded-xl mb-2" />
          <div className="h-4 w-52 bg-white/15 rounded-lg mb-6" />
          <div className="h-24 bg-white/20 rounded-3xl mb-4" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white/20 rounded-2xl mb-3" />
          ))}
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <h1 className="text-3xl font-black text-white drop-shadow-md mb-2">Play</h1>
        <p className="text-white/80 text-sm mb-6">Pick a game and start thinking!</p>

        {/* Featured Daily Challenge */}
        <div className="mb-4">
          <DailyChallengeCard gameType={getDailyGame()} title="Your brain challenge is ready!" />
        </div>

        {/* Game Grid */}
        <div className="flex flex-col gap-3">
          {GAMES.map((game) => (
            <GameCard key={game.href} {...game} />
          ))}
        </div>
      </div>
    </div>
  );
}
