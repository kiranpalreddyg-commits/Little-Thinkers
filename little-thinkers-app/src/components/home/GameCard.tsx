'use client';

import { Game, GameType } from '@/lib/types/content';

const GAME_THEME: Record<
  GameType,
  { gradient: string; iconBg: string; badge: string; icon: React.ReactNode }
> = {
  'word-pop': {
    gradient: 'from-blue-50 to-blue-100',
    iconBg: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
      />
    ),
  },
  'connection-quest': {
    gradient: 'from-green-50 to-green-100',
    iconBg: 'bg-green-500',
    badge: 'bg-green-100 text-green-700',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    ),
  },
  'memory-flip': {
    gradient: 'from-purple-50 to-purple-100',
    iconBg: 'bg-purple-500',
    badge: 'bg-purple-100 text-purple-700',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    ),
  },
  'pattern-builder': {
    gradient: 'from-orange-50 to-orange-100',
    iconBg: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-700',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    ),
  },
  'grid-logic': {
    gradient: 'from-red-50 to-red-100',
    iconBg: 'bg-red-500',
    badge: 'bg-red-100 text-red-700',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    ),
  },
};

const SKILL_LABELS: Record<string, string> = {
  vocabulary: 'Vocabulary',
  logic: 'Logic',
  memory: 'Memory',
  'pattern-recognition': 'Patterns',
  curiosity: 'Curiosity',
  'social-emotional': 'Social Skills',
};

interface GameCardProps {
  game: Game;
  onSelect: (gameType: GameType) => void;
}

export function GameCard({ game, onSelect }: GameCardProps) {
  const theme = GAME_THEME[game.type];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(game.type);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Play ${game.name} — ${game.description}`}
      onClick={() => onSelect(game.type)}
      onKeyDown={handleKeyDown}
      className={`bg-gradient-to-br ${theme.gradient} rounded-xl p-6 border border-gray-200 cursor-pointer
        hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
        focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
    >
      <div className={`w-14 h-14 ${theme.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {theme.icon}
        </svg>
      </div>

      <h3 className="text-lg font-bold text-gray-900 text-center mb-2">{game.name}</h3>
      <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">{game.description}</p>

      <div className="flex flex-wrap gap-2 justify-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${theme.badge}`}>
          {SKILL_LABELS[game.cognitiveSkill] ?? game.cognitiveSkill}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          {game.themedArea}
        </span>
      </div>
    </div>
  );
}
