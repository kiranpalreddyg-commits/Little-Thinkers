'use client';

import type { DailyGameType } from '@/lib/utils/dailyChallenge';
import Link from 'next/link';
import { useAccessibility } from '@/hooks/useAccessibility';

interface DailyChallengeCardProps {
  gameType: DailyGameType;
  title: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export function DailyChallengeCard({ gameType, title, difficulty = 'medium' }: DailyChallengeCardProps) {
  const reducedMotion = useAccessibility().settings.reducedMotion;
  const press = (cls: string) => (reducedMotion ? '' : cls);
  const href = `/play/${gameType}?difficulty=${difficulty}`;

  return (
    <div
      data-testid="daily-challenge-card"
      className={`rounded-[2rem] p-5 border-[3px] flex flex-col min-h-[160px] transition-transform ${press('active:translate-y-[4px]')}`}
      style={{
        backgroundColor: 'var(--theme-tint)',
        borderColor: 'var(--theme-line)',
        boxShadow: '0 8px 0 var(--theme-shadow)',
      }}
    >
      <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--theme-muted)' }}>
        Daily Challenge
      </p>
      <h3 className="text-lg font-black mb-4 leading-tight" style={{ color: 'var(--theme-ink)' }}>
        {title}
      </h3>
      <Link
        href={href}
        aria-label="Play Daily Challenge now"
        className={`mt-auto w-full font-black h-12 rounded-full text-base flex items-center justify-center transition-transform ${press('active:translate-y-[2px]')}`}
        style={{ backgroundColor: 'var(--theme-accent)', color: 'var(--theme-on-accent)' }}
      >
        Let&apos;s Go!
      </Link>
    </div>
  );
}
