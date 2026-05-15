import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useParams: vi.fn(),
  useSearchParams: vi.fn(),
}));
vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useContent', () => ({ useContent: vi.fn() }));
vi.mock('@/hooks/useGameSession', () => ({ useGameSession: vi.fn() }));

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/hooks/useContent';
import { useGameSession } from '@/hooks/useGameSession';
import GameplayPage from '@/app/play/[gameType]/play/page';

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

const ACTIVE_SESSION = {
  gameType: 'word-pop' as const,
  difficulty: 'medium' as const,
  startedAt: '2026-05-14T10:00:00.000Z',
  progress: 0,
  isPaused: false,
};

const makeSessionHook = (overrides: Partial<ReturnType<typeof useGameSession>> = {}) => ({
  session: ACTIVE_SESSION,
  startSession: vi.fn(),
  pauseSession: vi.fn(),
  resumeSession: vi.fn(),
  clearSession: vi.fn(),
  loadSession: vi.fn().mockReturnValue(null),
  ...overrides,
});

describe('GameplayPage (active play screen)', () => {
  let mockPush: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as ReturnType<typeof useRouter>);
    vi.mocked(useParams).mockReturnValue({ gameType: 'word-pop' });
    vi.mocked(useSearchParams).mockReturnValue({
      get: (key: string) => (key === 'difficulty' ? 'medium' : null),
    } as ReturnType<typeof useSearchParams>);
    vi.mocked(useAuth).mockReturnValue(
      AUTH_AUTHENTICATED as ReturnType<typeof useAuth>,
    );
    vi.mocked(useContent).mockReturnValue(
      CONTENT_LOADED as unknown as ReturnType<typeof useContent>,
    );
    vi.mocked(useGameSession).mockReturnValue(
      makeSessionHook() as ReturnType<typeof useGameSession>,
    );
  });

  it('renders the game name as a heading (AC1)', () => {
    render(<GameplayPage />);
    expect(
      screen.getByRole('heading', { name: /Word Pop/i }),
    ).toBeInTheDocument();
  });

  it('renders a placeholder game area (AC1)', () => {
    render(<GameplayPage />);
    expect(screen.getByText(/Gameplay coming soon/i)).toBeInTheDocument();
  });

  it('renders a "Pause Game" button during active play (AC1)', () => {
    render(<GameplayPage />);
    expect(
      screen.getByRole('button', { name: /Pause Game/i }),
    ).toBeInTheDocument();
  });

  it('clicking "Pause Game" shows the PauseOverlay with "Game Paused" (AC2)', async () => {
    render(<GameplayPage />);
    expect(screen.queryByText(/Game Paused/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Pause Game/i }));
    expect(
      await screen.findByRole('heading', { name: /Game Paused/i }),
    ).toBeInTheDocument();
  });

  it('clicking Resume on the PauseOverlay hides the overlay (AC3)', async () => {
    render(<GameplayPage />);
    await userEvent.click(screen.getByRole('button', { name: /Pause Game/i }));
    expect(
      await screen.findByRole('heading', { name: /Game Paused/i }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /^Resume$/i }));
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: /Game Paused/i }),
      ).not.toBeInTheDocument(),
    );
  });

  it('clicking Quit on the PauseOverlay navigates to home (AC4)', async () => {
    render(<GameplayPage />);
    await userEvent.click(screen.getByRole('button', { name: /Pause Game/i }));
    await userEvent.click(
      await screen.findByRole('button', { name: /Quit to Home/i }),
    );
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('redirects unauthenticated users to /login', async () => {
    vi.mocked(useAuth).mockReturnValue({
      ...AUTH_AUTHENTICATED,
      isAuthenticated: false,
      childProfile: null,
    } as ReturnType<typeof useAuth>);
    render(<GameplayPage />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
  });
});
