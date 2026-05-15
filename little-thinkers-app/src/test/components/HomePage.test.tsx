import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));
vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useContent', () => ({ useContent: vi.fn() }));

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/hooks/useContent';
import HomePage from '@/app/page';

const MOCK_CHILD = { id: 'child-1', name: 'Aiden', age: 8, gameplay_mode: 'smart' as const, avatar_url: null };

const MOCK_GAMES = [
  { type: 'word-pop', name: 'Word Pop', description: 'Guess the word.', themedArea: 'Word Woods', cognitiveSkill: 'vocabulary', bloomsLevel: 'apply', difficulties: ['easy'] },
  { type: 'connection-quest', name: 'Connection Quest', description: 'Find connections.', themedArea: 'Connection Canyon', cognitiveSkill: 'logic', bloomsLevel: 'analyze', difficulties: ['easy'] },
  { type: 'memory-flip', name: 'Memory Flip', description: 'Flip cards.', themedArea: 'Memory Marsh', cognitiveSkill: 'memory', bloomsLevel: 'remember', difficulties: ['easy'] },
  { type: 'pattern-builder', name: 'Pattern Builder', description: 'Build patterns.', themedArea: 'Pattern Peaks', cognitiveSkill: 'pattern-recognition', bloomsLevel: 'apply', difficulties: ['easy'] },
  { type: 'grid-logic', name: 'Grid Logic', description: 'Solve puzzles.', themedArea: 'Logic Lab', cognitiveSkill: 'logic', bloomsLevel: 'evaluate', difficulties: ['easy'] },
] as const;

const MOCK_PUZZLE = { id: 'p-1', type: 'word-pop' as const, difficulty: 'medium' as const, createdAt: '2026-05-14' };
const MOCK_STORIES = [{ id: 's-1', title: 'The Dragon', cognitiveSkills: ['creativity'], ageRange: { min: 7, max: 10 }, theme: 'adventure', readingLevel: 'grade-3' }];
const MOCK_TOPICS = [{ id: 'sci-1', question: 'Why is the sky blue?', cognitiveSkills: ['curiosity'], ageRange: { min: 7, max: 15 } }];

const AUTH_AUTHENTICATED = {
  user: { id: 'user-1', email: 'james@example.com' },
  childProfile: MOCK_CHILD,
  isAuthenticated: true,
  isLoading: false,
  error: null,
  login: vi.fn(),
  signup: vi.fn(),
  logout: vi.fn(),
  selectChildProfile: vi.fn(),
  refreshAuth: vi.fn(),
};

const CONTENT_LOADED = {
  games: MOCK_GAMES,
  dailyPuzzle: MOCK_PUZZLE,
  stories: MOCK_STORIES,
  scienceTopics: MOCK_TOPICS,
  filter: { topic: '', ageMin: 7, ageMax: 15 },
  isLoading: false,
  error: null,
  setFilter: vi.fn(),
  clearError: vi.fn(),
};

describe('HomePage', () => {
  let mockPush: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as ReturnType<typeof useRouter>);
    vi.mocked(useAuth).mockReturnValue(AUTH_AUTHENTICATED as ReturnType<typeof useAuth>);
    vi.mocked(useContent).mockReturnValue(CONTENT_LOADED as ReturnType<typeof useContent>);
  });

  it('shows personalised welcome heading with child name', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /Welcome back, Aiden/i })).toBeInTheDocument();
  });

  it('renders all 5 game cards', () => {
    render(<HomePage />);
    expect(screen.getByText('Word Pop')).toBeInTheDocument();
    expect(screen.getByText('Connection Quest')).toBeInTheDocument();
    expect(screen.getByText('Memory Flip')).toBeInTheDocument();
    expect(screen.getByText('Pattern Builder')).toBeInTheDocument();
    expect(screen.getByText('Grid Logic')).toBeInTheDocument();
  });

  it('renders Tell Me Why and Story Time as h2 section headings (AC6)', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 2, name: 'Tell Me Why?' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Story Time' })).toBeInTheDocument();
  });

  it('renders Puzzle of the Day section (AC2)', () => {
    render(<HomePage />);
    expect(screen.getByText(/Today's Puzzle/i)).toBeInTheDocument();
  });

  it('clicking a game card navigates to /play/[gameType] (AC3)', async () => {
    render(<HomePage />);
    await userEvent.click(screen.getByRole('button', { name: /Play Word Pop/i }));
    expect(mockPush).toHaveBeenCalledWith('/play/word-pop');
  });

  it('shows gameplay mode badge for child profile', () => {
    render(<HomePage />);
    expect(screen.getByText('Smart Mode')).toBeInTheDocument();
  });

  it('shows error banner when content fetch fails', () => {
    vi.mocked(useContent).mockReturnValue({
      ...CONTENT_LOADED,
      error: 'Failed to load content',
    } as ReturnType<typeof useContent>);
    render(<HomePage />);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to load content');
  });

  it('dismissing error banner calls clearError', async () => {
    const clearError = vi.fn();
    vi.mocked(useContent).mockReturnValue({
      ...CONTENT_LOADED,
      error: 'Something went wrong',
      clearError,
    } as ReturnType<typeof useContent>);
    render(<HomePage />);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss error' }));
    expect(clearError).toHaveBeenCalled();
  });

  it('redirects to /login when user is not authenticated (AC unauthenticated guard)', async () => {
    vi.mocked(useAuth).mockReturnValue({
      ...AUTH_AUTHENTICATED,
      isAuthenticated: false,
      childProfile: null,
    } as ReturnType<typeof useAuth>);
    render(<HomePage />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
  });

  it('redirects to /profile-select when authenticated but no child profile selected', async () => {
    vi.mocked(useAuth).mockReturnValue({
      ...AUTH_AUTHENTICATED,
      isAuthenticated: true,
      childProfile: null,
    } as ReturnType<typeof useAuth>);
    render(<HomePage />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/profile-select'));
  });

  it('filter controls are visible on the home page (AC4)', () => {
    render(<HomePage />);
    expect(screen.getByRole('combobox', { name: 'Topic:' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Age:' })).toBeInTheDocument();
  });

  it('changing topic filter calls setFilter with updated topic (AC4)', async () => {
    const setFilter = vi.fn();
    vi.mocked(useContent).mockReturnValue({
      ...CONTENT_LOADED,
      setFilter,
    } as ReturnType<typeof useContent>);
    render(<HomePage />);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Topic:' }), 'vocabulary');
    expect(setFilter).toHaveBeenCalledWith({ topic: 'vocabulary' });
  });
});
