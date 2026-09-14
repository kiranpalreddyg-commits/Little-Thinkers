'use client';

import Image from 'next/image';
import { avatarSrc, type AvatarId } from '@/lib/avatars/manifest';

interface AvatarProps {
  id: AvatarId;
  /** rendered diameter in px (124 home, 72 characters header, 58 you header, 40 grid, 36 summary row) */
  size: number;
  selected?: boolean;
  className?: string;
}

/** Circular avatar: PNG inset to 96% on a --theme-tint backing with a 3px --theme-line border. */
export function Avatar({ id, size, selected = false, className = '' }: AvatarProps) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border-[3px] ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: 'var(--theme-tint)',
        borderColor: selected ? 'var(--theme-accent)' : 'var(--theme-line)',
      }}
    >
      <div className="absolute inset-[2%]">
        <Image src={avatarSrc(id)} alt="" fill sizes={`${size}px`} className="object-contain" />
      </div>
    </div>
  );
}
