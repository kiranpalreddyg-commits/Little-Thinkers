'use client';

import { useEffect, useRef } from 'react';
import type { Badge } from '@/lib/types/progression';

interface BadgeNotificationProps {
  badge: Badge;
  onDismiss: () => void;
}

const TITLE_ID = 'badge-notif-title';
const AUTO_DISMISS_MS = 4000;

export function BadgeNotification({ badge, onDismiss }: BadgeNotificationProps) {
  const dismissButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  // Focus trap + Escape: the dialog is aria-modal, so keyboard focus must not
  // escape behind the scrim. There is exactly one focusable element (the
  // dismiss button), so any Tab/Shift+Tab simply keeps focus on it.
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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={TITLE_ID}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white rounded-2xl shadow-xl px-8 py-8 max-w-sm w-full mx-4 flex flex-col items-center gap-4 text-center"
        aria-live="assertive"
      >
        <p className="text-lg font-medium text-gray-700">
          You earned a badge! <span aria-hidden="true">🎉</span>
        </p>

        <h2 id={TITLE_ID} className="text-2xl font-bold text-yellow-600">
          {badge.name}
        </h2>

        <p className="text-gray-600">{badge.description}</p>

        <button
          ref={dismissButtonRef}
          type="button"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onClick={onDismiss}
          className="mt-2 min-h-[44px] min-w-[44px] px-6 py-2 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-gray-900 font-semibold rounded-full transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-yellow-400"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
