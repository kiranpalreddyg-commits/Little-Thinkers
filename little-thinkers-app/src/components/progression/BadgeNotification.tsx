'use client';

import { useEffect, useRef, useId } from 'react';
import type { Badge } from '@/lib/types/progression';

interface BadgeNotificationProps {
  badge: Badge;
  onDismiss: () => void;
}

const AUTO_DISMISS_MS = 4000;

export function BadgeNotification({ badge, onDismiss }: BadgeNotificationProps) {
  const dismissButtonRef = useRef<HTMLButtonElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Save previously focused element; restore it when the dialog closes
  useEffect(() => {
    prevFocusRef.current = document.activeElement as HTMLElement;
    return () => {
      prevFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onDismiss();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      dismissButtonRef.current?.focus();
    }
  }

  return (
    <div
      data-testid="badge-notification"
      className="fixed inset-0 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={handleKeyDown}
    >
      <div
        className="flex flex-col items-center gap-4 text-center px-8 py-12 max-w-sm w-full"
        style={{ animation: 'badgePopIn 350ms cubic-bezier(0.22, 1, 0.36, 1) both' }}
      >
        <div aria-hidden="true" className="text-8xl">🎉</div>

        <p className="text-white font-black text-xl">
          You earned a badge!
        </p>

        <h2 id={titleId} className="text-white font-black text-3xl">
          {badge.name}
        </h2>

        <p className="text-white/90">{badge.description}</p>

        <button
          ref={dismissButtonRef}
          type="button"
          autoFocus
          onClick={onDismiss}
          className="mt-2 min-h-[44px] min-w-[44px] px-8 py-3 bg-white text-[var(--color-brand)] font-black rounded-full shadow-lg transition-all duration-150 hover:scale-[1.04] active:scale-[0.97] focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-yellow-300"
        >
          Got it! 🎉
        </button>
      </div>
    </div>
  );
}
