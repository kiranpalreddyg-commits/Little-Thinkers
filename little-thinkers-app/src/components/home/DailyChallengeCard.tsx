import type { DailyGameType } from '@/lib/utils/dailyChallenge';
import Link from 'next/link';

interface DailyChallengeCardProps {
  gameType: DailyGameType;
  title: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export function DailyChallengeCard({ gameType, title, difficulty = 'medium' }: DailyChallengeCardProps) {
  const href = `/play/${gameType}?difficulty=${difficulty}`;

  return (
    <div
      data-testid="daily-challenge-card"
      className="rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] p-4 shadow-lg shadow-violet-600/40 flex flex-col min-h-[160px] transition-all duration-200 hover:shadow-2xl hover:shadow-violet-600/50 hover:-translate-y-0.5"
    >
      <p className="text-xs font-semibold tracking-widest uppercase text-white/90 mb-1">
        Daily Challenge
      </p>
      <h3 className="text-lg font-black text-white mb-3 leading-tight">{title}</h3>
      <Link
        href={href}
        aria-label="Play Daily Challenge now"
        className="mt-auto w-full bg-white text-[var(--color-brand)] font-black h-14 rounded-full text-base transition-all duration-150 hover:scale-[1.03] hover:shadow-lg hover:shadow-white/30 active:scale-[0.95] active:brightness-95 focus-visible:ring-4 focus-visible:ring-white/50 flex items-center justify-center"
      >
        Let&apos;s Go!
      </Link>
    </div>
  );
}
