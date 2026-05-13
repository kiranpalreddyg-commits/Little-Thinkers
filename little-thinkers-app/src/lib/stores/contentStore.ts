import { create } from 'zustand';
import { Game, DailyPuzzle, Story, ScienceTopic, ContentFilter } from '@/lib/types/content';
import { fetchGames } from '@/lib/api/games';
import { fetchDailyPuzzle, fetchStories, fetchScienceTopics } from '@/lib/api/content';

interface ContentState {
  games: Game[];
  dailyPuzzle: DailyPuzzle | null;
  stories: Story[];
  scienceTopics: ScienceTopic[];
  filter: ContentFilter;
  isLoading: boolean;
  error: string | null;

  fetchGames: () => Promise<void>;
  fetchDailyPuzzle: () => Promise<void>;
  fetchContent: (filter?: Partial<ContentFilter>) => Promise<void>;
  setFilter: (filter: Partial<ContentFilter>) => void;
  clearError: () => void;
}

const DEFAULT_FILTER: ContentFilter = { topic: '', ageMin: 7, ageMax: 15 };

export const useContentStore = create<ContentState>((set, get) => ({
  games: [],
  dailyPuzzle: null,
  stories: [],
  scienceTopics: [],
  filter: DEFAULT_FILTER,
  isLoading: false,
  error: null,

  fetchGames: async () => {
    try {
      set({ isLoading: true, error: null });
      const games = await fetchGames();
      set({ games, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load games',
        isLoading: false,
      });
    }
  },

  fetchDailyPuzzle: async () => {
    try {
      const dailyPuzzle = await fetchDailyPuzzle();
      set({ dailyPuzzle });
    } catch {
      // Daily puzzle failure is non-critical — leave it null
    }
  },

  fetchContent: async (filterOverride?: Partial<ContentFilter>) => {
    const filter = { ...get().filter, ...filterOverride };
    if (filterOverride) set({ filter });

    try {
      set({ isLoading: true, error: null });
      const [stories, scienceTopics] = await Promise.all([
        fetchStories(filter),
        fetchScienceTopics(filter),
      ]);
      set({ stories, scienceTopics, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load content',
        isLoading: false,
      });
    }
  },

  setFilter: (filterUpdate: Partial<ContentFilter>) => {
    const newFilter = { ...get().filter, ...filterUpdate };
    set({ filter: newFilter });
    get().fetchContent(newFilter);
  },

  clearError: () => set({ error: null }),
}));
