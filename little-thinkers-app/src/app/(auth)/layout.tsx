'use client';

import { useEffect } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.theme = 'turmeric'; // fixed light theme for auth screens (sunshine was retired in 4a)
  }, []);

  return <>{children}</>;
}
