'use client';

import type { CSSProperties } from 'react';
import { useThemeStore } from '@/lib/stores/themeStore';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Avatar } from '@/components/avatars';

interface HeroSectionProps {
  childName: string;
  streakCount?: number;
}

function getStreakLabel(count: number): string {
  if (count === 1) return '1 day — you showed up!';
  if (count < 7) return `${count} days going strong!`;
  return `${count} days on fire!`;
}

// design 4a §5: one closed path, card fill, accent stroke
const CLOUD =
  'M10 58 C-2 58 -3 41 10 39 C5 25 21 15 34 23 C38 9 63 5 71 20 C83 11 99 20 97 34 C111 35 112 54 101 58 Z';

function Cloud({ style }: { style: CSSProperties }) {
  return (
    <svg viewBox="-4 -4 124 70" className="absolute w-[114px]" style={style} aria-hidden="true">
      <path
        d={CLOUD}
        fill="var(--theme-card)"
        stroke="var(--theme-accent)"
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroSection({ childName, streakCount = 0 }: HeroSectionProps) {
  const avatar = useThemeStore((s) => s.avatar);
  const reducedMotion = useAccessibility().settings.reducedMotion;
  const anim = (value: string) => (reducedMotion ? undefined : value);

  return (
    <div className="relative flex flex-col items-center text-center px-5 pt-[10px] pb-1 gap-3">
      <Cloud style={{ left: 4, top: 58, opacity: 0.72, animation: anim('float 8s ease-in-out infinite') }} />
      <Cloud style={{ right: 4, top: 24, opacity: 0.55, animation: anim('float 6s ease-in-out 1s infinite') }} />

      <div
        data-testid="mascot"
        role="img"
        aria-label="mascot character"
        className="relative z-10"
        style={{ margin: '16px auto 10px', animation: anim('float 5s ease-in-out infinite') }}
      >
        <Avatar id={avatar} size={124} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-1">
        <h1 className="text-[26px] font-bold leading-[1.1]" style={{ color: 'var(--theme-on-ground)' }}>
          Hey {childName}!
        </h1>
        <p className="text-[14.5px] font-semibold" style={{ color: 'var(--theme-on-ground)', opacity: 0.85 }}>
          Ready to play? Your brain is waiting.
        </p>
      </div>

      <div
        data-testid="streak-chip"
        className="relative z-10 inline-flex items-center gap-1 rounded-full border-[3px] px-3 py-1 text-sm font-bold"
        style={{
          backgroundColor: 'var(--theme-card)',
          borderColor: 'var(--theme-line)',
          color: 'var(--theme-ink)',
          animation: streakCount > 0 ? anim('streakPulse 2s ease-in-out infinite') : undefined,
        }}
      >
        <span aria-hidden="true">{streakCount > 0 ? '🔥' : '✨'}</span>
        <span>{streakCount > 0 ? getStreakLabel(streakCount) : '0 days — start today!'}</span>
      </div>
    </div>
  );
}
