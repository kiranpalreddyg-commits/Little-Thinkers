interface HeroSectionProps {
  childName: string;
  streakCount?: number;
}

function getStreakLabel(count: number): string {
  if (count === 1) return '1 day — you showed up!';
  if (count < 7) return `${count} days going strong!`;
  return `${count} days on fire!`;
}

export function HeroSection({ childName, streakCount = 0 }: HeroSectionProps) {
  return (
    <div className="flex flex-col items-center text-center pt-8 pb-4 px-4 gap-4">
      <div
        data-testid="mascot"
        role="img"
        aria-label="mascot brain"
        className="w-24 h-24 text-7xl flex items-center justify-center"
        style={{ animation: 'mascotFloat 3s ease-in-out infinite' }}
      >
        🧠
      </div>

      <div className="flex flex-col items-center gap-1">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
          Hey {childName}! 👋
        </h1>
        <p className="text-base font-semibold text-gray-500">
          Ready to play? Your brain is waiting.
        </p>
      </div>

      {streakCount > 0 ? (
        <div
          data-testid="streak-chip"
          className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full"
          style={{ animation: 'streakPulse 2s ease-in-out infinite' }}
        >
          <span aria-hidden="true">🔥</span>
          <span>{getStreakLabel(streakCount)}</span>
        </div>
      ) : (
        <div
          data-testid="streak-chip"
          className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full"
        >
          <span aria-hidden="true">✨</span>
          <span>0 days — start today!</span>
        </div>
      )}
    </div>
  );
}
