'use client';

import type { BrainJar } from '@/lib/types/rewards';

interface Props {
  brainJar: BrainJar | null;
}

export function BrainJarWidget({ brainJar }: Props) {
  const fillPercent = brainJar?.fillPercent ?? 0;
  const totalSparks = brainJar?.totalSparks ?? 0;
  const capacity = brainJar?.capacity ?? 20;
  // Show sparks in the current fill cycle, not cumulative total (avoids "45 of 20 Sparks")
  const currentCycleSparks = fillPercent === 100 ? capacity : totalSparks % capacity;

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm font-semibold text-gray-700">Brain Jar</span>

      {/* Jar container — carries the progressbar role so it is always visible */}
      <div
        role="progressbar"
        aria-valuenow={fillPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Brain Jar: ${currentCycleSparks} of ${capacity} Sparks`}
        className="relative w-12 h-16 border-2 border-yellow-400 rounded-b-xl rounded-t-sm bg-yellow-50 overflow-hidden"
      >
        {/* Fill level — visual only */}
        <div
          data-testid="brain-jar-fill"
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 bg-yellow-400 transition-all duration-500"
          style={{ height: `${fillPercent}%` }}
        />
      </div>

      <span className="text-xs text-gray-600">{totalSparks} Sparks</span>
    </div>
  );
}
