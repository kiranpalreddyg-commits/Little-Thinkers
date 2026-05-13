'use client';

import { Game, GameType } from '@/lib/types/content';
import { GameCard } from './GameCard';

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
        <div key={game.type} role="listitem">
          <GameCard game={game} onSelect={onGameSelect} />
        </div>
      ))}
    </div>
  );
}
