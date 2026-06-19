'use client';

import type { CSSProperties } from 'react';
import { useThemeStore } from '@/lib/stores/themeStore';
import { AVATARS } from '@/components/avatars';

interface HeroSectionProps {
  childName: string;
  streakCount?: number;
}

function getStreakLabel(count: number): string {
  if (count === 1) return '1 day — you showed up!';
  if (count < 7) return `${count} days going strong!`;
  return `${count} days on fire!`;
}

function Cloud({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 100 60"
      fill="white"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="28" cy="40" r="20" />
      <circle cx="50" cy="28" r="26" />
      <circle cx="72" cy="38" r="18" />
      <rect x="8" y="40" width="84" height="18" />
    </svg>
  );
}

export function HeroSection({ childName, streakCount = 0 }: HeroSectionProps) {
  const { avatar } = useThemeStore();
  const avatarEntry = AVATARS.find((a) => a.id === avatar) ?? AVATARS[0];
  const ActiveAvatar = avatarEntry.component;

  return (
    <div className="relative flex flex-col items-center text-center pt-6 pb-4 px-4 gap-3">
      {/* Animated clouds */}
      <Cloud
        className="absolute top-6 -left-6 w-28 opacity-70"
        style={{ animation: 'float 8s ease-in-out infinite' }}
      />
      <Cloud
        className="absolute top-2 right-4 w-20 opacity-50"
        style={{ animation: 'float 6s ease-in-out 1s infinite' }}
      />
      <Cloud
        className="absolute top-20 -right-8 w-32 opacity-80"
        style={{ animation: 'float 10s ease-in-out 2s infinite' }}
      />

      {/* Floating mascot */}
      <div
        data-testid="mascot"
        role="img"
        aria-label="mascot character"
        className="relative z-10 w-40 h-40"
        style={{ animation: 'float 5s ease-in-out infinite' }}
      >
        <ActiveAvatar className="w-full h-full drop-shadow-2xl" />
      </div>

      <div className="flex flex-col items-center gap-1 relative z-10">
        <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-md leading-tight">
          Hey {childName}! 👋
        </h1>
        <p className="text-base font-semibold text-white/80">
          Ready to play? Your brain is waiting.
        </p>
      </div>

      {streakCount > 0 ? (
        <div
          data-testid="streak-chip"
          className="relative z-10 inline-flex items-center gap-1 bg-white/20 border border-white/40 text-white text-sm font-semibold px-3 py-1 rounded-full"
          style={{ animation: 'streakPulse 2s ease-in-out infinite' }}
        >
          <span aria-hidden="true">🔥</span>
          <span>{getStreakLabel(streakCount)}</span>
        </div>
      ) : (
        <div
          data-testid="streak-chip"
          className="relative z-10 inline-flex items-center gap-1 bg-white/20 border border-white/40 text-white text-sm font-semibold px-3 py-1 rounded-full"
        >
          <span aria-hidden="true">✨</span>
          <span>0 days — start today!</span>
        </div>
      )}
    </div>
  );
}
