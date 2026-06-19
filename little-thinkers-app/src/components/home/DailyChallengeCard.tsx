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
      className="rounded-[2rem] p-5 border-[3px] flex flex-col min-h-[160px] transition-transform active:translate-y-[4px]"
      style={{
        backgroundColor: 'var(--theme-card-bg)',
        borderColor: 'var(--theme-border)',
        boxShadow: '0 8px 0 var(--theme-shadow)',
      }}
    >
      <p className="text-xs font-bold tracking-widest uppercase text-white/80 mb-1">
        Daily Challenge
      </p>
      <h3 className="text-lg font-black mb-4 leading-tight" style={{ color: 'var(--theme-text)' }}>
        {title}
      </h3>
      <Link
        href={href}
        aria-label="Play Daily Challenge now"
        className="mt-auto w-full font-black h-12 rounded-full text-base flex items-center justify-center text-white transition-transform active:translate-y-[2px]"
        style={{ backgroundColor: 'var(--theme-border)' }}
      >
        Let&apos;s Go!
      </Link>
    </div>
  );
}
