'use client';

import { DailyPuzzle } from '@/lib/types/content';

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

interface PuzzleOfTheDayProps {
  puzzle: DailyPuzzle | null;
  onStart: () => void;
}

export function PuzzleOfTheDay({ puzzle, onStart }: PuzzleOfTheDayProps) {
  if (!puzzle) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 animate-pulse" aria-busy="true">
        <div className="h-6 bg-indigo-200 rounded w-48 mb-3" />
        <div className="h-4 bg-indigo-100 rounded w-full mb-2" />
        <div className="h-10 bg-indigo-200 rounded-lg w-36 mt-4" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Today&apos;s Puzzle</h3>
              <p className="text-sm text-gray-600 capitalize">{puzzle.type.replace('-', ' ')}</p>
            </div>
          </div>

          {puzzle.hint && (
            <p className="text-sm text-indigo-700 italic mb-3">&ldquo;{puzzle.hint}&rdquo;</p>
          )}

          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[puzzle.difficulty] ?? 'bg-gray-100 text-gray-600'}`}
          >
            {DIFFICULTY_LABELS[puzzle.difficulty] ?? puzzle.difficulty}
          </span>
        </div>

        <button
          onClick={onStart}
          className="flex-shrink-0 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg
            hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
            transition-colors min-h-[44px]"
          aria-label="Start today's puzzle"
        >
          Play Now
        </button>
      </div>
    </div>
  );
}
