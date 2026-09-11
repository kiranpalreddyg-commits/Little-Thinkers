'use client';

import { useEffect } from 'react';
import { useRewardsStore } from '@/lib/stores/rewardsStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { useAccessibilityStore } from '@/lib/stores/accessibilityStore';
import { AppShell } from './AppShell';
import { AppShellProvider } from './AppShellContext';

interface AppShellWrapperProps {
  children: React.ReactNode;
}

export function AppShellWrapper({ children }: AppShellWrapperProps) {
  const brainJar = useRewardsStore((s) => s.brainJar);
  const sparkCount = brainJar?.totalSparks ?? 0;
  const theme = useThemeStore((s) => s.theme);
  const childId = useAuthStore((s) => s.childProfile?.id);
  const hydrateSettings = useAccessibilityStore((s) => s.hydrateSettings);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (childId) hydrateSettings(childId);
  }, [childId, hydrateSettings]);

  return (
    <AppShellProvider>
      {({ hideTabBar, hideHeader }) => (
        <AppShell hideTabBar={hideTabBar} hideHeader={hideHeader} sparkCount={sparkCount}>
          {children}
        </AppShell>
      )}
    </AppShellProvider>
  );
}
