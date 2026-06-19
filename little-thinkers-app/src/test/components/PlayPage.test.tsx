import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useParams: vi.fn(),
}));
vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useContent', () => ({ useContent: vi.fn() }));

import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/hooks/useContent';
import PlayPage from '@/app/(shell)/play/[gameType]/page';

const MOCK_CHILD = {
  id: 'child-1',
  name: 'Aiden',
  age: 8,
  gameplay_mode: 'smart' as const,
  avatar_url: null,
};

const MOCK_GAMES = [
  {
    type: 'word-pop',
    name: 'Word Pop',
    description: 'Guess the hidden word by popping letters.',
    themedArea: 'Word Woods',
    cognitiveSkill: 'vocabulary',
    bloomsLevel: 'apply',
    difficulties: ['easy', 'medium', 'hard'],
  },
  {
    type: 'memory-flip',
    name: 'Memory Flip',
    description: 'Flip cards to find pairs.',
    themedArea: 'Memory Marsh',
    cognitiveSkill: 'memory',
    bloomsLevel: 'remember',
    difficulties: ['easy', 'medium'],
  },
] as const;

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
  dailyPuzzle: null,
  stories: [],
  scienceTopics: [],
  filter: { topic: '', ageMin: 7, ageMax: 15 },
  isLoading: false,
  error: null,
  setFilter: vi.fn(),
  clearError: vi.fn(),
};

describe('PlayPage (game setup screen)', () => {
  let mockPush: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as ReturnType<typeof useRouter>);
    vi.mocked(useParams).mockReturnValue({ gameType: 'word-pop' });
    vi.mocked(useAuth).mockReturnValue(
      AUTH_AUTHENTICATED as ReturnType<typeof useAuth>,
    );
    vi.mocked(useContent).mockReturnValue(
      CONTENT_LOADED as unknown as ReturnType<typeof useContent>,
    );
  });

  it('shows the game name as the page heading (AC1)', () => {
    render(<PlayPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: /Word Pop/i }),
    ).toBeInTheDocument();
  });

  it('shows the game description (AC1)', () => {
    render(<PlayPage />);
    expect(
      screen.getByText(/Guess the hidden word by popping letters/i),
    ).toBeInTheDocument();
  });

  it('renders the difficulty selector with the game\'s available difficulties (AC1)', () => {
    render(<PlayPage />);
    expect(
      screen.getByRole('radiogroup', { name: /Choose Difficulty/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Easy/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Medium/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Hard/i })).toBeInTheDocument();
  });

  it('renders the instructions panel with how-to-play heading (AC3)', () => {
    render(<PlayPage />);
    expect(
      screen.getByRole('heading', { level: 2, name: /How to play/i }),
    ).toBeInTheDocument();
  });

  it('renders an unchecked acknowledgement checkbox by default (AC4)', () => {
    render(<PlayPage />);
    expect(
      screen.getByRole('checkbox', { name: /I've read the instructions/i }),
    ).not.toBeChecked();
  });

  it('disables the Start Game button when instructions are not acknowledged (AC4)', () => {
    render(<PlayPage />);
    expect(screen.getByRole('button', { name: /Start Game/i })).toBeDisabled();
  });

  it('enables the Start Game button after the acknowledgement checkbox is checked (AC5)', async () => {
    render(<PlayPage />);
    await userEvent.click(
      screen.getByRole('checkbox', { name: /I've read the instructions/i }),
    );
    expect(
      screen.getByRole('button', { name: /Start Game/i }),
    ).toBeEnabled();
  });

  it('selecting a different difficulty updates the checked radio (AC2)', async () => {
    render(<PlayPage />);
    await userEvent.click(screen.getByRole('radio', { name: /Hard/i }));
    expect(screen.getByRole('radio', { name: /Hard/i })).toBeChecked();
  });

  it('clicking Start Game navigates to the game route with the selected difficulty (AC6)', async () => {
    render(<PlayPage />);
    await userEvent.click(screen.getByRole('radio', { name: /Medium/i }));
    await userEvent.click(
      screen.getByRole('checkbox', { name: /I've read the instructions/i }),
    );
    await userEvent.click(screen.getByRole('button', { name: /Start Game/i }));
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringMatching(/\/play\/word-pop\/.+\?difficulty=medium$|\?difficulty=medium/),
    );
  });

  it('clicking Back navigates to the home screen (AC7)', async () => {
    render(<PlayPage />);
    await userEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('redirects unauthenticated users to /login (AC8)', async () => {
    vi.mocked(useAuth).mockReturnValue({
      ...AUTH_AUTHENTICATED,
      isAuthenticated: false,
      childProfile: null,
    } as ReturnType<typeof useAuth>);
    render(<PlayPage />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
  });
});
