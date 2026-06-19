'use client';

import { useEffect } from 'react';
import { useRewardsStore } from '@/lib/stores/rewardsStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { AppShell } from './AppShell';
import { AppShellProvider } from './AppShellContext';

interface AppShellWrapperProps {
  children: React.ReactNode;
}

export function AppShellWrapper({ children }: AppShellWrapperProps) {
  const brainJar = useRewardsStore((s) => s.brainJar);
  const sparkCount = brainJar?.totalSparks ?? 0;
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <AppShellProvider>
      {(hideTabBar) => (
        <AppShell hideTabBar={hideTabBar} sparkCount={sparkCount}>
          {children}
        </AppShell>
      )}
    </AppShellProvider>
  );
}
