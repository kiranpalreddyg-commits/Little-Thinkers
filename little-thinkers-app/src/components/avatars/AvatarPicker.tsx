'use client';

import { AVATARS } from './index';
import { AvatarCard } from './AvatarCard';
import type { AvatarId } from '@/lib/stores/themeStore';

interface AvatarPickerProps {
  value: AvatarId;
  onChange: (id: AvatarId) => void;
}

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div
      className="grid grid-cols-4 gap-3"
      role="radiogroup"
      aria-label="Choose your character"
    >
      {AVATARS.map((entry) => (
        <div key={entry.id} className="flex flex-col items-center gap-1.5">
          <AvatarCard
            avatarId={entry.id}
            size="lg"
            selected={value === entry.id}
            onClick={() => onChange(entry.id)}
          />
          <span
            className="text-[10px] font-semibold text-center leading-tight"
            style={{ color: entry.accent }}
          >
            {entry.name.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
