'use client';

import type { ThinkingStreak } from '@/lib/types/progression';

interface StreakDisplayProps {
  streak: ThinkingStreak | null;
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  const count = streak?.currentStreak ?? 0;

  return (
    <div
      role="img"
      aria-label={`Thinking streak: ${count} days`}
      className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-4 py-2"
      style={count > 0 ? { animation: 'streakPulse 2s ease-in-out infinite' } : undefined}
    >
      <span aria-hidden="true" className="text-xl">🔥</span>
      <span className="font-semibold text-orange-700 text-sm">
        {count}-day streak
      </span>
    </div>
  );
}
