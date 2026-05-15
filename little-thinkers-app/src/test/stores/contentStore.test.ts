import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/api/games', () => ({ fetchGames: vi.fn() }));
vi.mock('@/lib/api/content', () => ({
  fetchDailyPuzzle: vi.fn(),
  fetchStories: vi.fn(),
  fetchScienceTopics: vi.fn(),
}));

import { fetchGames } from '@/lib/api/games';
import { fetchDailyPuzzle, fetchStories, fetchScienceTopics } from '@/lib/api/content';
import { useContentStore } from '@/lib/stores/contentStore';

const MOCK_GAMES = [
  { type: 'word-pop', name: 'Word Pop', description: 'Guess the word.', themedArea: 'Word Woods', cognitiveSkill: 'vocabulary', bloomsLevel: 'apply', difficulties: ['easy'] },
];
const MOCK_PUZZLE = { id: 'p-1', type: 'word-pop', difficulty: 'medium', createdAt: '2026-05-14' };
const MOCK_STORIES = [{ id: 's-1', title: 'The Dragon', cognitiveSkills: ['creativity'], ageRange: { min: 7, max: 10 }, theme: 'adventure', readingLevel: 'grade-3' }];
const MOCK_TOPICS = [{ id: 'sci-1', question: 'Why is the sky blue?', cognitiveSkills: ['curiosity'], ageRange: { min: 7, max: 15 } }];

const INITIAL_STATE = {
  games: [],
  dailyPuzzle: null,
  stories: [],
  scienceTopics: [],
  filter: { topic: '', ageMin: 7, ageMax: 15 },
  isLoading: false,
  error: null,
};

describe('contentStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useContentStore.setState(INITIAL_STATE);
  });

  describe('fetchGames', () => {
    it('populates games on success', async () => {
      vi.mocked(fetchGames).mockResolvedValueOnce(MOCK_GAMES);
      await useContentStore.getState().fetchGames();
      const { games, isLoading, error } = useContentStore.getState();
      expect(games).toEqual(MOCK_GAMES);
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });

    it('sets error and leaves games empty on failure', async () => {
      vi.mocked(fetchGames).mockRejectedValueOnce(new Error('Network error'));
      await useContentStore.getState().fetchGames();
      const { games, error, isLoading } = useContentStore.getState();
      expect(error).toBe('Network error');
      expect(games).toHaveLength(0);
      expect(isLoading).toBe(false);
    });
  });

  describe('fetchDailyPuzzle', () => {
    it('populates dailyPuzzle on success', async () => {
      vi.mocked(fetchDailyPuzzle).mockResolvedValueOnce(MOCK_PUZZLE);
      await useContentStore.getState().fetchDailyPuzzle();
      expect(useContentStore.getState().dailyPuzzle).toEqual(MOCK_PUZZLE);
    });

    it('silently ignores failure and leaves dailyPuzzle null', async () => {
      vi.mocked(fetchDailyPuzzle).mockRejectedValueOnce(new Error('Not found'));
      await useContentStore.getState().fetchDailyPuzzle();
      const { dailyPuzzle, error } = useContentStore.getState();
      expect(dailyPuzzle).toBeNull();
      expect(error).toBeNull();
    });
  });

  describe('fetchContent', () => {
    it('populates stories and scienceTopics on success', async () => {
      vi.mocked(fetchStories).mockResolvedValueOnce(MOCK_STORIES);
      vi.mocked(fetchScienceTopics).mockResolvedValueOnce(MOCK_TOPICS);
      await useContentStore.getState().fetchContent();
      const { stories, scienceTopics, isLoading } = useContentStore.getState();
      expect(stories).toEqual(MOCK_STORIES);
      expect(scienceTopics).toEqual(MOCK_TOPICS);
      expect(isLoading).toBe(false);
    });

    it('sets error on failure', async () => {
      vi.mocked(fetchStories).mockRejectedValueOnce(new Error('Server error'));
      vi.mocked(fetchScienceTopics).mockResolvedValueOnce([]);
      await useContentStore.getState().fetchContent();
      expect(useContentStore.getState().error).toBeTruthy();
    });
  });

  describe('setFilter', () => {
    it('updates the filter and triggers fetchContent with new filter', async () => {
      vi.mocked(fetchStories).mockResolvedValueOnce([]);
      vi.mocked(fetchScienceTopics).mockResolvedValueOnce([]);
      useContentStore.getState().setFilter({ topic: 'logic' });
      expect(useContentStore.getState().filter.topic).toBe('logic');
      expect(fetchStories).toHaveBeenCalledWith(expect.objectContaining({ topic: 'logic' }));
    });

    it('merges partial filter update with existing filter', () => {
      vi.mocked(fetchStories).mockResolvedValueOnce([]);
      vi.mocked(fetchScienceTopics).mockResolvedValueOnce([]);
      useContentStore.setState({ filter: { topic: 'logic', ageMin: 7, ageMax: 15 } });
      useContentStore.getState().setFilter({ ageMin: 11 });
      const { filter } = useContentStore.getState();
      expect(filter.topic).toBe('logic');
      expect(filter.ageMin).toBe(11);
    });
  });

  describe('clearError', () => {
    it('resets error to null', () => {
      useContentStore.setState({ error: 'Something went wrong' });
      useContentStore.getState().clearError();
      expect(useContentStore.getState().error).toBeNull();
    });
  });
});
