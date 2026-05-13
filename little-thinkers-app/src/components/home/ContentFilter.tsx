'use client';

import { ContentFilter } from '@/lib/types/content';

const TOPIC_OPTIONS = [
  { value: '', label: 'All Topics' },
  { value: 'vocabulary', label: 'Vocabulary' },
  { value: 'logic', label: 'Logic & Reasoning' },
  { value: 'memory', label: 'Memory' },
  { value: 'pattern-recognition', label: 'Patterns' },
  { value: 'curiosity', label: 'Science & Curiosity' },
  { value: 'social-emotional', label: 'Social Skills' },
];

const AGE_OPTIONS = [
  { value: '7-15', label: 'All Ages (7–15)', ageMin: 7, ageMax: 15 },
  { value: '7-10', label: 'Ages 7–10', ageMin: 7, ageMax: 10 },
  { value: '11-15', label: 'Ages 11–15', ageMin: 11, ageMax: 15 },
];

interface ContentFilterProps {
  filter: ContentFilter;
  onFilterChange: (update: Partial<ContentFilter>) => void;
}

export function ContentFilterBar({ filter, onFilterChange }: ContentFilterProps) {
  const currentAgeKey = AGE_OPTIONS.find(
    (o) => o.ageMin === filter.ageMin && o.ageMax === filter.ageMax
  )?.value ?? '7-15';

  const handleAgeChange = (value: string) => {
    const option = AGE_OPTIONS.find((o) => o.value === value);
    if (option) {
      onFilterChange({ ageMin: option.ageMin, ageMax: option.ageMax });
    }
  };

  return (
    <div
      role="search"
      aria-label="Filter content by topic and age"
      className="flex flex-wrap gap-4 items-center"
    >
      <div className="flex items-center gap-2">
        <label htmlFor="filter-topic" className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Topic:
        </label>
        <select
          id="filter-topic"
          value={filter.topic}
          onChange={(e) => onFilterChange({ topic: e.target.value })}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700
            focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-1 focus-visible:ring-blue-500
            min-h-[44px] cursor-pointer"
        >
          {TOPIC_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="filter-age" className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Age:
        </label>
        <select
          id="filter-age"
          value={currentAgeKey}
          onChange={(e) => handleAgeChange(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700
            focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-1 focus-visible:ring-blue-500
            min-h-[44px] cursor-pointer"
        >
          {AGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {(filter.topic !== '' || filter.ageMin !== 7 || filter.ageMax !== 15) && (
        <button
          onClick={() => onFilterChange({ topic: '', ageMin: 7, ageMax: 15 })}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium
            focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-1 focus-visible:ring-blue-500
            rounded px-2 py-1 min-h-[44px]"
          aria-label="Clear all filters"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
