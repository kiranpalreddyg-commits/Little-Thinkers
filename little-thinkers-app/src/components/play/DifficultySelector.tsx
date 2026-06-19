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
          const isSelected = selected === difficulty;
          return (
            <label
              key={difficulty}
              htmlFor={id}
              className="relative flex items-center gap-2 px-5 py-2 rounded-xl border-[3px] cursor-pointer min-h-[44px] font-black transition-transform active:translate-y-[1px]"
              style={
                isSelected
                  ? {
                      backgroundColor: 'var(--theme-border)',
                      borderColor: 'var(--theme-shadow)',
                      color: 'white',
                      boxShadow: '0 4px 0 var(--theme-shadow)',
                    }
                  : {
                      backgroundColor: 'white',
                      borderColor: 'var(--theme-border)',
                      color: 'var(--theme-text)',
                      boxShadow: '0 4px 0 var(--theme-shadow)',
                    }
              }
            >
              <input
                type="radio"
                id={id}
                name="difficulty"
                value={difficulty}
                checked={isSelected}
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
