'use client';

import type { MascotState } from '@/lib/types/progression';

interface MascotWidgetProps {
  mascot: MascotState | null;
}

const ACCESSORY_EMOJI: Record<string, string> = {
  glasses: '🕶️',
  hat: '🎩',
  cape: '🦸',
};

function getAccessoriesForLevel(level: number): string[] {
  if (level >= 4) return ['glasses', 'hat', 'cape'];
  if (level === 3) return ['glasses', 'hat'];
  if (level === 2) return ['glasses'];
  return [];
}

export function MascotWidget({ mascot }: MascotWidgetProps) {
  if (mascot === null) {
    return <div className="text-gray-500 italic">Loading mascot…</div>;
  }

  const accessories = getAccessoriesForLevel(mascot.level);
  const accessoryLabel = accessories.length === 0 ? 'no' : String(accessories.length);
  const ariaLabel = `Mascot: Level ${mascot.level} Thinker with ${accessoryLabel} accessories`;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      data-testid="mascot-widget"
      className="flex flex-col items-center gap-3 bg-gradient-to-br from-violet-100 to-emerald-50 rounded-2xl shadow-lg shadow-violet-500/40 px-8 py-8 w-fit min-w-[160px] min-h-[220px]"
      style={{ animation: 'mascotFloat 3s ease-in-out infinite' }}
    >
      <div className="relative">
        <span className="text-8xl" aria-hidden="true">🧠</span>
        {accessories.length > 0 && (
          <span className="absolute -top-3 -right-3 text-3xl" aria-hidden="true">
            {ACCESSORY_EMOJI[accessories[0]]}
          </span>
        )}
      </div>

      <p className="text-lg font-black text-[var(--color-brand)]">
        Level {mascot.level} Thinker
      </p>

      {accessories.length > 0 ? (
        <div className="flex flex-wrap gap-1 items-center justify-center">
          {accessories.map((a) => (
            <span key={a} className="text-xs bg-white/60 rounded-full px-2 py-0.5 font-semibold text-violet-700 flex items-center gap-0.5">
              <span aria-hidden="true">{ACCESSORY_EMOJI[a]}</span>
              {a}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-brand)] font-semibold">
          Level up to unlock gear! ✨
        </p>
      )}
    </div>
  );
}
