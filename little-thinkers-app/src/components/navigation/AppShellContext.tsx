'use client';

import { createContext, useContext, useState } from 'react';

interface AppShellContextValue {
  setHideTabBar: (hide: boolean) => void;
  setHideHeader: (hide: boolean) => void;
}

export const AppShellContext = createContext<AppShellContextValue>({
  setHideTabBar: () => {},
  setHideHeader: () => {},
});

export function useAppShell() {
  return useContext(AppShellContext);
}

export interface AppShellChrome {
  hideTabBar: boolean;
  hideHeader: boolean;
}

interface AppShellProviderProps {
  children: (chrome: AppShellChrome) => React.ReactNode;
}

export function AppShellProvider({ children }: AppShellProviderProps) {
  const [hideTabBar, setHideTabBar] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);

  return (
    <AppShellContext.Provider value={{ setHideTabBar, setHideHeader }}>
      {children({ hideTabBar, hideHeader })}
    </AppShellContext.Provider>
  );
}
