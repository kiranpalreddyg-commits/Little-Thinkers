'use client';

import { useRewardsStore } from '@/lib/stores/rewardsStore';
import { AppShell } from './AppShell';
import { AppShellProvider } from './AppShellContext';

interface AppShellWrapperProps {
  children: React.ReactNode;
}

export function AppShellWrapper({ children }: AppShellWrapperProps) {
  const brainJar = useRewardsStore((s) => s.brainJar);
  const sparkCount = brainJar?.totalSparks ?? 0;

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
