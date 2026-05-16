'use client';

import { AppHeader } from './AppHeader';
import { TabBar } from './TabBar';

interface AppShellProps {
  children: React.ReactNode;
  hideTabBar?: boolean;
  sparkCount?: number;
}

export function AppShell({ children, hideTabBar = false, sparkCount }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-full">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-[var(--color-brand)] focus:font-bold focus:rounded-lg focus:ring-2 focus:ring-[var(--color-brand)]"
      >
        Skip to main content
      </a>
      <AppHeader sparkCount={sparkCount} />
      <main
        id="main-content"
        className="flex-1 pb-[72px] md:pb-0"
        style={{ animation: 'fadeSlideUp 300ms cubic-bezier(0.22, 1, 0.36, 1)' }}
      >
        {children}
      </main>
      {!hideTabBar && <TabBar />}
    </div>
  );
}
