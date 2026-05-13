'use client';

import { useEffect } from 'react';
import { useContentStore } from '@/lib/stores/contentStore';
import { ContentFilter } from '@/lib/types/content';

export function useContent() {
  const store = useContentStore();

  useEffect(() => {
    if (store.games.length === 0) {
      store.fetchGames();
    }
    if (!store.dailyPuzzle) {
      store.fetchDailyPuzzle();
    }
    if (store.stories.length === 0 && store.scienceTopics.length === 0) {
      store.fetchContent();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    games: store.games,
    dailyPuzzle: store.dailyPuzzle,
    stories: store.stories,
    scienceTopics: store.scienceTopics,
    filter: store.filter,
    isLoading: store.isLoading,
    error: store.error,
    setFilter: store.setFilter,
    clearError: store.clearError,
  };
}

export function useFilteredContent(filter: Partial<ContentFilter>) {
  const { fetchContent } = useContentStore();
  useEffect(() => {
    fetchContent(filter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.topic, filter.ageMin, filter.ageMax]);
}
