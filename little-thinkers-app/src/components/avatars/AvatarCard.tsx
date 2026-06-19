'use client';

import { AVATARS } from './index';
import type { AvatarId } from '@/lib/stores/themeStore';

type Size = 'sm' | 'md' | 'lg';

interface AvatarCardProps {
  avatarId: AvatarId;
  size?: Size;
  selected?: boolean;
  showName?: boolean;
  onClick?: () => void;
  className?: string;
}

const SIZE_MAP: Record<Size, { card: string; svg: string; name: string }> = {
  sm:  { card: 'w-12 h-12 rounded-xl',          svg: 'w-9 h-9',   name: 'text-[10px]' },
  md:  { card: 'w-20 h-20 rounded-2xl',          svg: 'w-14 h-14', name: 'text-xs' },
  lg:  { card: 'w-[88px] h-[88px] rounded-2xl',  svg: 'w-16 h-16', name: 'text-xs' },
};

export function AvatarCard({
  avatarId,
  size = 'md',
  selected = false,
  showName = false,
  onClick,
  className = '',
}: AvatarCardProps) {
  const entry = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];
  const AvatarSvg = entry.component;
  const sz = SIZE_MAP[size];

  const card = (
    <div
      className={`
        relative flex items-center justify-center transition-all duration-200 cursor-default
        ${sz.card}
        ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
        ${selected ? 'ring-[3px] shadow-lg' : 'ring-0 shadow-sm hover:shadow-md'}
        ${className}
      `}
      style={{
        backgroundColor: entry.bg,
        boxShadow: selected
          ? `0 0 0 3px ${entry.accent}, 0 4px 12px ${entry.accent}40`
          : undefined,
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-pressed={onClick ? selected : undefined}
      aria-label={`${entry.name} avatar${selected ? ', selected' : ''}`}
    >
      <AvatarSvg className={sz.svg} />

      {selected && (
        <span
          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px] font-black shadow"
          style={{ backgroundColor: entry.accent }}
          aria-hidden="true"
        >
          ✓
        </span>
      )}
    </div>
  );

  if (!showName) return card;

  return (
    <div className="flex flex-col items-center gap-1.5">
      {card}
      <span
        className={`font-semibold text-center leading-tight ${sz.name}`}
        style={{ color: entry.accent }}
      >
        {entry.name}
      </span>
    </div>
  );
}
