'use client';

import type { WorldMapArea } from '@/lib/types/progression';

interface WorldMapProps {
  areas: WorldMapArea[];
}

export function WorldMap({ areas }: WorldMapProps) {
  return (
    <nav aria-label="World Map">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">World Map</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {areas.map((area) =>
          area.isUnlocked ? (
            <button
              key={area.id}
              type="button"
              onClick={() => console.log(`Navigating to ${area.name}`)}
              className="flex flex-col items-center gap-1 bg-white rounded-xl shadow-sm border border-green-200 px-4 py-5 text-center font-semibold text-green-700 hover:bg-green-50 active:bg-green-100 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-green-400 min-h-[44px]"
            >
              {area.name}
            </button>
          ) : (
            <div
              key={area.id}
              aria-label={`${area.name} — Locked, requires ${area.sparkThreshold} Sparks`}
              className="flex flex-col items-center gap-1 bg-gray-100 rounded-xl border border-gray-200 px-4 py-5 text-center text-gray-400 cursor-not-allowed select-none"
            >
              <span className="font-semibold">{area.name}</span>
              <span className="text-sm flex items-center gap-1">
                <span aria-hidden="true">🔒</span>
                Locked
              </span>
              <span className="text-xs">{area.sparkThreshold} Sparks needed</span>
            </div>
          )
        )}
      </div>
    </nav>
  );
}
