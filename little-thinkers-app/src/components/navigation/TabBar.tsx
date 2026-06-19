'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, BookOpen, Star, User } from 'lucide-react';

const tabs = [
  { label: 'Home',     href: '/',           icon: Home },
  { label: 'Play',     href: '/play',        icon: Gamepad2 },
  { label: 'Learn',    href: '/learn',       icon: BookOpen },
  { label: 'Progress', href: '/my-progress', icon: Star },
  { label: 'Profile',  href: '/settings',    icon: User },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="bottom tab navigation"
      className="fixed bottom-6 left-0 w-full px-4 z-50 flex justify-center xl:hidden"
    >
      <div
        className="bg-white rounded-[2.5rem] border-[3px] flex justify-between items-center px-3 py-2 w-full max-w-sm shadow-2xl"
        style={{ borderColor: 'var(--theme-border)' }}
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? 'page' : undefined}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-[1.25rem] text-xs font-bold transition-all duration-150 active:scale-[0.95] ${
                isActive ? 'border-[3px]' : 'text-slate-400'
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--theme-card-bg)',
                      borderColor: 'var(--theme-border)',
                      color: 'var(--theme-text)',
                    }
                  : {}
              }
            >
              <Icon size={22} aria-hidden="true" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
