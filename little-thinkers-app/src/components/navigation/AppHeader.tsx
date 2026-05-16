'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface AppHeaderProps {
  sparkCount?: number;
}

export function AppHeader({ sparkCount = 0 }: AppHeaderProps) {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-white/50 shadow-sm">
      <div className="flex items-center justify-between px-4 h-14">
        <Link
          href="/"
          className="text-lg font-extrabold text-[var(--color-brand)] transition-all duration-150 hover:opacity-80"
        >
          Little Thinkers
        </Link>

        <span
          data-testid="spark-count"
          className="text-sm font-semibold text-[var(--color-spark)]"
          aria-live="polite"
          aria-atomic="true"
        >
          {sparkCount} Sparks
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={logout}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-150 px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
          >
            Sign Out
          </button>
          <Link
            href="/settings"
            aria-label="Open profile"
            data-testid="avatar"
            className="w-9 h-9 rounded-full bg-[var(--color-brand-light)] flex items-center justify-center text-[var(--color-brand)] font-bold text-sm transition-all duration-150 hover:ring-2 hover:ring-[var(--color-brand)]/30 active:scale-[0.97]"
          >
            <span aria-hidden="true">👤</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
