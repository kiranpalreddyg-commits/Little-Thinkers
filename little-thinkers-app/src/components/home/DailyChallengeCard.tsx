'use client';

import Link from 'next/link';

interface DailyChallengeCardProps {
  gameType: string;
  title: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export function DailyChallengeCard({ gameType, title, difficulty = 'medium' }: DailyChallengeCardProps) {
  const href = `/play/${gameType}?difficulty=${difficulty}`;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] p-4 shadow-lg">
      <p className="text-xs font-semibold tracking-widest uppercase text-white/70 mb-1">
        Daily Challenge
      </p>
      <h3 className="text-lg font-black text-white mb-3">{title}</h3>
      <Link
        href={href}
        aria-label="Play Daily Challenge now"
        className="w-full bg-white text-[var(--color-brand)] font-black h-14 rounded-2xl text-base transition-all duration-150 hover:bg-white/90 active:scale-[0.97] focus-visible:ring-4 focus-visible:ring-white/50 flex items-center justify-center"
      >
        Play Now
      </Link>
    </div>
  );
}
