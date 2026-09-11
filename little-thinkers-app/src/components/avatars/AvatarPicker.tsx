'use client';

import { AVATAR_GROUPS, type AvatarId } from '@/lib/avatars/manifest';
import { Avatar } from './Avatar';

interface AvatarPickerProps {
  value: AvatarId;
  onChange: (id: AvatarId) => void;
}

/** Category cards with 5-column avatar grids (design 4a §4). */
export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div role="radiogroup" aria-label="Choose your character" className="flex flex-col gap-3">
      {AVATAR_GROUPS.map((group) => (
        <section
          key={group.id}
          aria-label={group.label}
          className="rounded-[22px] border-[3px] p-[13px]"
          style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-line)' }}
        >
          <p
            className="text-[11px] font-extrabold uppercase tracking-[.09em] mb-2"
            style={{ color: 'var(--theme-ink)', opacity: 0.55 }}
          >
            {group.label}
          </p>
          <div className="grid grid-cols-5 gap-[9px] justify-items-center">
            {group.avatars.map((id) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={value === id}
                aria-label={`Character ${id}`}
                onClick={() => onChange(id)}
                className="active:scale-[.88]"
                style={{ transition: 'transform .16s cubic-bezier(.22,1,.36,1)' }}
              >
                <Avatar id={id} size={56} selected={value === id} />
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
