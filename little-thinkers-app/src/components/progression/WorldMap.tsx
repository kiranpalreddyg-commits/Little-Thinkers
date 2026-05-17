'use client';

import type { WorldMapArea } from '@/lib/types/progression';

interface WorldMapProps {
  areas: WorldMapArea[];
}

export function WorldMap({ areas }: WorldMapProps) {
  return (
    <nav aria-label="World Map" data-testid="world-map">
      <h2 className="text-xl font-black text-gray-900 mb-4">World Map</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {areas.map((area) =>
          area.isUnlocked ? (
            <button
              key={area.id}
              type="button"
              onClick={() => { /* navigation wired in later story */ }}
              className="flex flex-col items-center gap-1 bg-gradient-to-br from-green-400 to-emerald-500 text-white font-black shadow-md shadow-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/40 hover:scale-[1.05] active:scale-[0.97] transition-[transform,box-shadow] duration-150 will-change-transform rounded-2xl px-4 py-5 text-center focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-green-400 min-h-[80px]"
            >
              {area.name}
            </button>
          ) : (
            <div
              key={area.id}
              role="img"
              aria-label={`${area.name} — Locked, requires ${area.sparkThreshold} Sparks`}
              className="flex flex-col items-center gap-1 bg-gray-100 rounded-2xl border border-gray-200 px-4 py-5 text-center text-gray-400 select-none opacity-60 min-h-[80px]"
            >
              <span className="font-semibold">{area.name}</span>
              <span className="text-sm flex items-center gap-1">
                <span aria-hidden="true" className="text-2xl">🔒</span>
                Locked — {area.sparkThreshold} Sparks needed ✨
              </span>
            </div>
          )
        )}
      </div>
    </nav>
  );
}
