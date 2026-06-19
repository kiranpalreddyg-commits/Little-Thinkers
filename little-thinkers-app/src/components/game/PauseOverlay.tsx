'use client';

import { useEffect, useRef } from 'react';

interface PauseOverlayProps {
  gameName: string;
  onResume: () => void;
  onQuit: () => void;
}

export function PauseOverlay({ gameName, onResume, onQuit }: PauseOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute('disabled'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onResume(); return; }
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    dialog.addEventListener('keydown', trap);
    return () => dialog.removeEventListener('keydown', trap);
  }, [onResume]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div
        ref={dialogRef}
        role="dialog"
        aria-label="Game Paused"
        aria-modal="true"
        className="bg-white rounded-xl p-8 shadow-lg max-w-sm w-full mx-4"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Game Paused</h2>
        <p className="text-center text-gray-600 mb-6">{gameName}</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={onResume}
            autoFocus
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg
              hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-blue-500
              transition-colors min-h-[44px]"
            aria-label="Resume"
          >
            Resume
          </button>
          <button
            onClick={onQuit}
            className="w-full px-6 py-3 bg-gray-300 text-gray-900 font-semibold rounded-lg
              hover:bg-gray-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-gray-500
              transition-colors min-h-[44px]"
            aria-label="Quit to Home"
          >
            Quit to Home
          </button>
        </div>
      </div>
    </div>
  );
}
