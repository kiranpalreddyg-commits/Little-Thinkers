'use client';

import type { Badge } from '@/lib/types/progression';

interface BadgeListProps {
  badges: Badge[];
}

export function BadgeList({ badges }: BadgeListProps) {
  if (badges.length === 0) {
    return (
      <p className="text-gray-500 italic py-4">
        No badges yet — keep playing!
      </p>
    );
  }

  return (
    <ul role="list" className="space-y-3">
      {badges.map((badge) => (
        <li
          key={badge.id}
          role="listitem"
          className="flex items-start gap-3 bg-white rounded-xl shadow-sm border border-yellow-100 px-4 py-3"
        >
          <span aria-hidden="true" className="text-2xl mt-0.5">🏅</span>
          <div>
            <h3 className="font-semibold text-gray-900 text-base leading-snug">
              {badge.name}
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">{badge.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
