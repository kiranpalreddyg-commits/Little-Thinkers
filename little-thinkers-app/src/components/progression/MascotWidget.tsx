'use client';

import type { MascotState } from '@/lib/types/progression';

interface MascotWidgetProps {
  mascot: MascotState | null;
}

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
  const accessoryCount = accessories.length;
  const accessoryLabel = accessoryCount === 0 ? 'no' : String(accessoryCount);
  const ariaLabel = `Mascot: Level ${mascot.level} Thinker with ${accessoryLabel} accessories`;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="flex flex-col items-center gap-3 bg-white rounded-2xl shadow-sm border border-purple-100 px-6 py-5 w-fit"
    >
      <span className="text-5xl" aria-hidden="true">🧠</span>

      <p className="text-lg font-bold text-purple-700">
        Level {mascot.level} Thinker
      </p>

      {accessories.length > 0 ? (
        <p className="text-sm text-gray-600">
          Accessories: {accessories.join(', ')}
        </p>
      ) : (
        <p className="text-sm text-gray-400 italic">No accessories yet</p>
      )}
    </div>
  );
}
