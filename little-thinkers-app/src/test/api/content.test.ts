import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock js-cookie before importing the module under test
vi.mock('js-cookie', () => ({ default: { get: vi.fn(() => 'mock-token') } }));

// Force mock API mode
vi.stubEnv('NEXT_PUBLIC_USE_MOCK_API', 'true');

describe('content API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchGames returns all 5 games', async () => {
    const { fetchGames } = await import('@/lib/api/games');
    const games = await fetchGames();
    expect(games).toHaveLength(5);
    const types = games.map((g) => g.type);
    expect(types).toContain('word-pop');
    expect(types).toContain('connection-quest');
    expect(types).toContain('memory-flip');
    expect(types).toContain('pattern-builder');
    expect(types).toContain('grid-logic');
  });

  it('fetchGames returns games with required fields', async () => {
    const { fetchGames } = await import('@/lib/api/games');
    const games = await fetchGames();
    for (const game of games) {
      expect(game).toHaveProperty('type');
      expect(game).toHaveProperty('name');
      expect(game).toHaveProperty('description');
      expect(game).toHaveProperty('themedArea');
      expect(game).toHaveProperty('cognitiveSkill');
      expect(game).toHaveProperty('difficulties');
      expect(Array.isArray(game.difficulties)).toBe(true);
    }
  });

  it('fetchDailyPuzzle returns a puzzle with required fields', async () => {
    const { fetchDailyPuzzle } = await import('@/lib/api/content');
    const puzzle = await fetchDailyPuzzle();
    expect(puzzle).toHaveProperty('id');
    expect(puzzle).toHaveProperty('type');
    expect(puzzle).toHaveProperty('difficulty');
    expect(puzzle).toHaveProperty('createdAt');
  });

  it('fetchStories returns stories without filter', async () => {
    const { fetchStories } = await import('@/lib/api/content');
    const stories = await fetchStories();
    expect(stories.length).toBeGreaterThan(0);
    for (const story of stories) {
      expect(story).toHaveProperty('id');
      expect(story).toHaveProperty('title');
      expect(story).toHaveProperty('ageRange');
      expect(Array.isArray(story.cognitiveSkills)).toBe(true);
    }
  });

  it('fetchStories filters by age range', async () => {
    const { fetchStories } = await import('@/lib/api/content');
    const stories = await fetchStories({ ageMin: 11, ageMax: 15 });
    for (const story of stories) {
      expect(story.ageRange.max).toBeGreaterThanOrEqual(11);
    }
  });

  it('fetchScienceTopics returns topics without filter', async () => {
    const { fetchScienceTopics } = await import('@/lib/api/content');
    const topics = await fetchScienceTopics();
    expect(topics.length).toBeGreaterThan(0);
    for (const topic of topics) {
      expect(topic).toHaveProperty('id');
      expect(topic).toHaveProperty('question');
      expect(topic).toHaveProperty('ageRange');
    }
  });

  it('fetchScienceTopics filters by topic', async () => {
    const { fetchScienceTopics } = await import('@/lib/api/content');
    const topics = await fetchScienceTopics({ topic: 'curiosity' });
    expect(topics.length).toBeGreaterThan(0);
    for (const topic of topics) {
      expect(topic.cognitiveSkills).toContain('curiosity');
    }
  });
});
