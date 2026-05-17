import type { ReactNode } from 'react';
import Link from 'next/link';

const colorStyles = {
  blue:   { bg: 'from-blue-400 via-blue-500 to-blue-700',          text: 'text-white', iconBg: 'bg-blue-300/30',    shadow: 'shadow-blue-600/40' },
  green:  { bg: 'from-emerald-400 via-emerald-500 to-emerald-700', text: 'text-white', iconBg: 'bg-emerald-300/30', shadow: 'shadow-emerald-600/40' },
  violet: { bg: 'from-violet-400 via-violet-500 to-violet-700',    text: 'text-white', iconBg: 'bg-violet-300/30',  shadow: 'shadow-violet-600/40' },
  amber:  { bg: 'from-amber-300 via-amber-400 to-amber-600',       text: 'text-white', iconBg: 'bg-amber-200/30',   shadow: 'shadow-amber-500/40' },
  rose:   { bg: 'from-rose-400 via-rose-500 to-rose-700',          text: 'text-white', iconBg: 'bg-rose-300/30',    shadow: 'shadow-rose-600/40' },
} as const;

interface GameCardProps {
  title: string;
  description: string;
  href: string;
  color: 'blue' | 'green' | 'violet' | 'amber' | 'rose';
  icon: ReactNode;
}

export function GameCard({ title, description, href, color, icon }: GameCardProps) {
  const styles = colorStyles[color];

  return (
    <div
      data-game-color={color}
      className={`relative rounded-2xl bg-gradient-to-br ${styles.bg} shadow-lg ${styles.shadow} p-4 flex flex-col gap-2 transition-all duration-200 hover:scale-[1.04] hover:-translate-y-1 hover:shadow-2xl hover:brightness-110 active:scale-[0.95] cursor-pointer min-h-[160px]`}
    >
      <span
        aria-hidden="true"
        className={`w-11 h-11 rounded-xl ${styles.iconBg} flex items-center justify-center text-3xl`}
      >
        {icon}
      </span>
      <div>
        <h3 className={`font-black text-lg leading-tight ${styles.text}`}>{title}</h3>
        <p className={`text-sm font-medium ${styles.text} opacity-80 mt-1 line-clamp-2`}>{description}</p>
      </div>
      <Link
        href={href}
        aria-label={`Play ${title}`}
        className="absolute inset-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
      />
    </div>
  );
}
