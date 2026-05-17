'use client';

import type { Badge } from '@/lib/types/progression';

interface BadgeListProps {
  badges: Badge[];
}

export function BadgeList({ badges }: BadgeListProps) {
  return (
    <div data-testid="badge-grid" role="list" className="grid grid-cols-2 gap-4">
      {badges.length === 0 && (
        <p className="col-span-2 text-gray-500 italic py-4">No badges yet — keep playing!</p>
      )}
      {badges.map((badge) => (
        <div
          key={badge.id}
          role="listitem"
          className="flex flex-col items-center gap-2 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-lg shadow-amber-400/40 p-4 text-center min-h-[100px] transition-[transform,box-shadow] duration-150 hover:scale-[1.04] active:scale-[0.97] will-change-transform cursor-pointer"
        >
          <span aria-hidden="true" className="text-4xl">🏅</span>
          <h3 className="font-black text-gray-900 text-sm leading-tight">{badge.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{badge.description}</p>
        </div>
      ))}
    </div>
  );
}
