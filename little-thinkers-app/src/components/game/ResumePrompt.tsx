'use client';

import type { GameSession } from '@/lib/types/gameSession';

interface ResumePromptProps {
  session: GameSession;
  onResume: () => void;
  onNewGame: () => void;
}

export function ResumePrompt({ session, onResume, onNewGame }: ResumePromptProps) {
  const capitalizedDifficulty = session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1);

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg max-w-sm w-full">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Resume Game?</h2>

      <div className="text-center mb-6">
        <p className="text-gray-600 mb-3">You have a saved game in progress.</p>
        <p className="text-gray-600 mb-3">Continue where you left off?</p>
        <div className="flex justify-center gap-4 text-sm">
          <div>
            <span className="text-gray-500">Difficulty</span>
            <p className="font-semibold text-gray-900">{capitalizedDifficulty}</p>
          </div>
          <div>
            <span className="text-gray-500">Progress</span>
            <p className="font-semibold text-gray-900">{session.progress}%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={onResume}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg
            hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-blue-500
            transition-colors min-h-[44px]"
          aria-label="Resume Game"
        >
          Resume Game
        </button>
        <button
          onClick={onNewGame}
          className="w-full px-6 py-3 bg-gray-300 text-gray-900 font-semibold rounded-lg
            hover:bg-gray-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-gray-500
            transition-colors min-h-[44px]"
          aria-label="New Game"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
