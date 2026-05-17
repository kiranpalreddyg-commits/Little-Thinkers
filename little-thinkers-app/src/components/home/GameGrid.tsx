'use client';

import { Game, GameType } from '@/lib/types/content';

interface GameGridProps {
  games: Game[];
  onGameSelect: (gameType: GameType) => void;
}

function GameCardSkeleton() {
  return (
    <div className="bg-gray-100 rounded-xl p-6 animate-pulse" aria-hidden="true">
      <div className="w-14 h-14 bg-gray-300 rounded-full mx-auto mb-4" />
      <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto mb-2" />
      <div className="h-4 bg-gray-200 rounded w-full mb-1" />
      <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-4" />
      <div className="flex gap-2 justify-center">
        <div className="h-5 bg-gray-300 rounded-full w-20" />
        <div className="h-5 bg-gray-200 rounded-full w-24" />
      </div>
    </div>
  );
}

export function GameGrid({ games, onGameSelect }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy="true" aria-label="Loading games">
        {Array.from({ length: 5 }).map((_, i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      role="list"
      aria-label="Available games"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {games.map((game) => (
        <div
          key={game.type}
          role="listitem"
          tabIndex={0}
          aria-label={`Play ${game.name} — ${game.description}`}
          onClick={() => onGameSelect(game.type)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onGameSelect(game.type);
            }
          }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
        >
          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">{game.name}</h3>
          <p className="text-sm text-gray-600 text-center leading-relaxed">{game.description}</p>
        </div>
      ))}
    </div>
  );
}
