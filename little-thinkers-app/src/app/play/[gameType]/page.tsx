'use client';

import { useRouter, useParams } from 'next/navigation';

const GAME_NAMES: Record<string, string> = {
  'word-pop': 'Word Pop',
  'connection-quest': 'Connection Quest',
  'memory-flip': 'Memory Flip',
  'pattern-builder': 'Pattern Builder',
  'grid-logic': 'Grid Logic',
};

export default function PlayPage() {
  const router = useRouter();
  const params = useParams();
  const gameType = params.gameType as string;
  const gameName = GAME_NAMES[gameType] ?? gameType;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">{gameName}</h1>
        <p className="text-gray-500 mb-8">
          This game is coming soon! Gameplay will be available in an upcoming story.
        </p>

        <button
          onClick={() => router.push('/')}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl
            hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-blue-500
            transition-colors min-h-[44px]"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
