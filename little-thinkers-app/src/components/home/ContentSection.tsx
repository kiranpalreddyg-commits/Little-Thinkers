'use client';

import { Story, ScienceTopic } from '@/lib/types/content';

type ContentItem = Story | ScienceTopic;

function isStory(item: ContentItem): item is Story {
  return 'title' in item;
}

interface ContentSectionProps {
  heading: string;
  description: string;
  items: ContentItem[];
  icon: React.ReactNode;
  accentColor: string;
  onItemSelect: (id: string) => void;
}

function ContentItemCard({
  item,
  accentColor,
  onSelect,
}: {
  item: ContentItem;
  accentColor: string;
  onSelect: () => void;
}) {
  const label = isStory(item) ? item.title : item.question;
  const ageLabel = `Ages ${item.ageRange.min}–${item.ageRange.max}`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open: ${label}`}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 hover:border-gray-300
        hover:shadow-sm cursor-pointer transition-all duration-150
        focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-1 focus-visible:ring-blue-500 min-h-[44px]"
    >
      <div className={`w-2 h-8 ${accentColor} rounded-full flex-shrink-0`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{label}</p>
        <p className="text-xs text-gray-500">{ageLabel}</p>
      </div>
      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="space-y-2 animate-pulse" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="w-2 h-8 bg-gray-300 rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-1" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ContentSection({
  heading,
  description,
  items,
  icon,
  accentColor,
  onItemSelect,
}: ContentSectionProps) {
  return (
    <section aria-labelledby={`section-${heading.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${accentColor.replace('bg-', 'bg-').replace('-500', '-500')} rounded-full flex items-center justify-center flex-shrink-0`} aria-hidden="true">
          {icon}
        </div>
        <div>
          <h2
            id={`section-${heading.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-lg font-bold text-gray-900"
          >
            {heading}
          </h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <ContentSkeleton />
      ) : (
        <ul role="list" className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <ContentItemCard
                item={item}
                accentColor={accentColor}
                onSelect={() => onItemSelect(item.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
