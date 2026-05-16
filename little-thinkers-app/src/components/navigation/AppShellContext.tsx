'use client';

import { createContext, useContext, useState } from 'react';

interface AppShellContextValue {
  setHideTabBar: (hide: boolean) => void;
}

export const AppShellContext = createContext<AppShellContextValue>({
  setHideTabBar: () => {},
});

export function useAppShell() {
  return useContext(AppShellContext);
}

interface AppShellProviderProps {
  children: (hideTabBar: boolean) => React.ReactNode;
}

export function AppShellProvider({ children }: AppShellProviderProps) {
  const [hideTabBar, setHideTabBar] = useState(false);

  return (
    <AppShellContext.Provider value={{ setHideTabBar }}>
      {children(hideTabBar)}
    </AppShellContext.Provider>
  );
}
