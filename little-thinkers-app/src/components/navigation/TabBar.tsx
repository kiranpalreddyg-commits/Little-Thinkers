'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, BookOpen, Star, User } from 'lucide-react';

const tabs = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Play', href: '/play', icon: Gamepad2 },
  { label: 'Learn', href: '/learn', icon: BookOpen },
  { label: 'Progress', href: '/my-progress', icon: Star },
  { label: 'Profile', href: '/settings', icon: User },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="bottom tab navigation"
      className="fixed bottom-0 left-0 right-0 h-[72px] bg-white shadow-lg rounded-t-3xl flex items-center justify-around md:hidden z-50"
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 px-3 py-2 relative transition-colors duration-150 active:scale-[0.95] transition-transform duration-100 text-xs font-medium ${
              isActive ? 'text-[var(--color-brand)]' : 'text-gray-400'
            }`}
          >
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-[var(--color-brand)]" />
            )}
            <Icon size={22} aria-hidden="true" />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
