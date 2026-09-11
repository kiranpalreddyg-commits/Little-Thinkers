import type { ReactNode } from 'react';
import Link from 'next/link';

interface GameCardProps {
  title: string;
  description: string;
  href: string;
  color: 'blue' | 'green' | 'violet' | 'amber' | 'rose';
  icon: ReactNode;
}

export function GameCard({ title, description, href, color, icon }: GameCardProps) {
  return (
    <div
      data-game-color={color}
      className="relative rounded-[2rem] p-4 flex items-center gap-4 border-[3px] transition-transform active:translate-y-[4px] cursor-pointer"
      style={{
        backgroundColor: 'var(--theme-card)',
        borderColor: 'var(--theme-line)',
        boxShadow: '0 6px 0 var(--theme-shadow)',
      }}
    >
      <div
        aria-hidden="true"
        className="w-14 h-14 rounded-[1rem] border-[3px] flex items-center justify-center shrink-0"
        style={{
          backgroundColor: 'var(--theme-tint)',
          borderColor: 'var(--theme-line)',
          color: 'var(--theme-ink)',
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className="font-black text-base leading-tight"
          style={{ color: 'var(--theme-ink)' }}
        >
          {title}
        </h3>
        <p className="text-sm font-medium mt-0.5 line-clamp-2" style={{ color: 'var(--theme-muted)' }}>{description}</p>
      </div>
      <Link
        href={href}
        aria-label={`Play ${title}`}
        className="absolute inset-0 rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      />
    </div>
  );
}
