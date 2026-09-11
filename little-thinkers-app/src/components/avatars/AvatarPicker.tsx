'use client';

import { AVATAR_GROUPS, type AvatarId } from '@/lib/avatars/manifest';
import { Avatar } from './Avatar';

interface AvatarPickerProps {
  value: AvatarId;
  onChange: (id: AvatarId) => void;
}

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div role="radiogroup" aria-label="Choose your character" className="flex flex-col gap-4">
      {AVATAR_GROUPS.map((group) => (
        <section key={group.id} aria-label={group.label}>
          <p
            className="text-[11px] font-extrabold uppercase tracking-[.09em] mb-2"
            style={{ color: 'var(--theme-ink)', opacity: 0.55 }}
          >
            {group.label}
          </p>
          <div className="grid grid-cols-5 gap-[9px]">
            {group.avatars.map((id) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={value === id}
                aria-label={`Character ${id}`}
                onClick={() => onChange(id)}
                className="flex justify-center transition-transform active:scale-[.88]"
              >
                <Avatar id={id} size={40} selected={value === id} />
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
