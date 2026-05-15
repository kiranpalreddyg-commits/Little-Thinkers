'use client';

import { Difficulty } from '@/lib/types/content';

interface DifficultySelectorProps {
  difficulties: Difficulty[];
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function DifficultySelector({ difficulties, selected, onSelect }: DifficultySelectorProps) {
  return (
    <fieldset
      role="radiogroup"
      aria-label="Choose Difficulty"
      className="border-0 p-0 m-0"
    >
      <legend className="sr-only">Choose Difficulty</legend>
      <div className="flex flex-wrap gap-3">
        {difficulties.map((difficulty) => {
          const id = `difficulty-${difficulty}`;
          return (
            <label
              key={difficulty}
              htmlFor={id}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer min-h-[44px]
                transition-colors duration-150
                ${
                  selected === difficulty
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                }
                focus-within:ring-4 focus-within:ring-offset-1 focus-within:ring-blue-500`}
            >
              <input
                type="radio"
                id={id}
                name="difficulty"
                value={difficulty}
                checked={selected === difficulty}
                onChange={() => onSelect(difficulty)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {capitalize(difficulty)}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
