/**
 * Story 8.2 — Hint Button & Adaptive Difficulty UI (AC2, AC3, AC4, AC5, AC1)
 *
 * RED tests: hint-button, hint-text, and difficulty-display testids do NOT
 * exist yet in the gameplay page.  All tests MUST FAIL until the page is
 * extended to implement Story 8.2.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';

// ── Module mocks (must be hoisted before imports) ────────────────────────────
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useParams: vi.fn(),
  useSearchParams: vi.fn(),
}));
vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useContent', () => ({ useContent: vi.fn() }));
vi.mock('@/hooks/useGameSession', () => ({ useGameSession: vi.fn() }));
vi.mock('@/hooks/useRewards', () => ({ useRewards: vi.fn() }));
vi.mock('@/hooks/useProgression', () => ({ useProgression: vi.fn() }));
vi.mock('@/lib/stores/authStore', () => ({ useAuthStore: vi.fn() }));
vi.mock('@/components/navigation/AppShellContext', () => ({
  useAppShell: vi.fn(() => ({ setHideTabBar: vi.fn() })),
}));

// ── Imports ──────────────────────────────────────────────────────────────────
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/hooks/useContent';
import { useGameSession } from '@/hooks/useGameSession';
import { useRewards } from '@/hooks/useRewards';
import { useProgression } from '@/hooks/useProgression';
import { useAuthStore } from '@/lib/stores/authStore';
import GameplayPage from '@/app/(shell)/play/[gameType]/play/page';

// ── Shared fixtures ──────────────────────────────────────────────────────────
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

const makeSessionHook = () => ({
  session: ACTIVE_SESSION,
  startSession: vi.fn(),
  pauseSession: vi.fn(),
  resumeSession: vi.fn(),
  clearSession: vi.fn(),
  loadSession: vi.fn().mockReturnValue(null),
});

const makeRewardsHook = () => ({
  brainJar: { childId: 'child-1', totalSparks: 0, jarLevel: 1, fillPercentage: 0 },
  feedback: null,
  isAnimating: false,
  hydrateRewards: vi.fn(),
  loadRewards: vi.fn(),
  earnSpark: vi.fn(),
  completionBonus: vi.fn(),
  setFeedback: vi.fn(),
  clearFeedback: vi.fn(),
  setAnimating: vi.fn(),
});

const makeProgressionHook = () => ({
  badges: [],
  worldAreas: [],
  mascot: null,
  streak: null,
  newBadgeNotification: null,
  // New AI actions — not yet implemented, return undefined until store is extended
  gameDifficulty: { 'word-pop': 2 } as Record<string, number>,
  hintsUsed: { 'word-pop': 0 } as Record<string, number>,
  hydrateProgression: vi.fn(),
  updateFromSparks: vi.fn(),
  checkAndAwardBadges: vi.fn().mockReturnValue([]),
  recordActivity: vi.fn(),
  dismissNotification: vi.fn(),
  recordAnswer: vi.fn(),
  recordHintUsed: vi.fn(),
  getDifficulty: vi.fn().mockReturnValue(2),
});

// ── Test suite ───────────────────────────────────────────────────────────────
describe('GameplayPage — Story 8.2 AI features', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    // Mock global fetch to return a hint
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ hint: 'Think about what you already know!' }),
      }),
    );

    // next/navigation
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as ReturnType<typeof useRouter>);
    vi.mocked(useParams).mockReturnValue({ gameType: 'word-pop' });
    vi.mocked(useSearchParams).mockReturnValue({
      get: (key: string) => (key === 'difficulty' ? 'medium' : null),
    } as ReturnType<typeof useSearchParams>);

    // hooks
    vi.mocked(useAuth).mockReturnValue(AUTH_AUTHENTICATED as ReturnType<typeof useAuth>);
    vi.mocked(useContent).mockReturnValue(CONTENT_LOADED as unknown as ReturnType<typeof useContent>);
    vi.mocked(useGameSession).mockReturnValue(makeSessionHook() as ReturnType<typeof useGameSession>);
    vi.mocked(useRewards).mockReturnValue(makeRewardsHook() as unknown as ReturnType<typeof useRewards>);
    vi.mocked(useProgression).mockReturnValue(makeProgressionHook() as unknown as ReturnType<typeof useProgression>);
    vi.mocked(useAuthStore).mockReturnValue({ childProfile: MOCK_CHILD } as unknown as ReturnType<typeof useAuthStore>);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ── AC2: hint button hidden initially ──────────────────────────────────────
  it('hint-button is NOT visible when the page first renders (AC2)', () => {
    render(<GameplayPage />);
    const hintButton = screen.queryByTestId('hint-button');
    // It should either be absent from the DOM or hidden via aria-hidden
    if (hintButton !== null) {
      expect(hintButton).toHaveAttribute('aria-hidden', 'true');
    } else {
      expect(hintButton).toBeNull();
    }
  });

  // ── AC2: hint button appears after 10 s of no answer ──────────────────────
  it('hint-button becomes visible after 10 seconds of no answer (AC2)', async () => {
    render(<GameplayPage />);

    await act(async () => {
      vi.advanceTimersByTime(10_000);
    });

    // After act() flushes React state, use synchronous getByTestId (no polling needed)
    const hintButton = screen.getByTestId('hint-button');
    expect(hintButton).not.toHaveAttribute('aria-hidden', 'true');
    expect(hintButton).toBeVisible();
  });

  // ── AC3: clicking hint-button calls /api/ai/hint ───────────────────────────
  it('clicking hint-button POSTs to /api/ai/hint (AC3)', async () => {
    render(<GameplayPage />);

    await act(async () => { vi.advanceTimersByTime(10_000); });
    const hintButton = screen.getByTestId('hint-button');

    await act(async () => { fireEvent.click(hintButton); });

    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      '/api/ai/hint',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  // ── AC3: clicking hint-button shows hint-text ─────────────────────────────
  it('hint-text appears in the document after clicking hint-button (AC3)', async () => {
    render(<GameplayPage />);

    await act(async () => { vi.advanceTimersByTime(10_000); });
    const hintButton = screen.getByTestId('hint-button');

    // fireEvent is synchronous — wrap in act so React flushes fetch → setState
    await act(async () => { fireEvent.click(hintButton); });

    expect(screen.getByTestId('hint-text')).toBeInTheDocument();
  });

  // ── AC5: max 2 hints per question ─────────────────────────────────────────
  it('hint-button is no longer accessible after being clicked twice (AC5)', async () => {
    render(<GameplayPage />);

    await act(async () => { vi.advanceTimersByTime(10_000); });
    const hintButton = screen.getByTestId('hint-button');

    // First hint click — hintCount goes from 0 → 1 (button stays visible, 1 < 2)
    await act(async () => { fireEvent.click(hintButton); });
    expect(screen.getByTestId('hint-text')).toBeInTheDocument();

    // Second hint click — hintCount goes from 1 → 2 (setHintVisible(false))
    await act(async () => { fireEvent.click(hintButton); });

    // After second click: button must be gone or disabled
    const btn = screen.queryByTestId('hint-button');
    if (btn !== null) {
      const isDisabled = btn.hasAttribute('disabled') || btn.getAttribute('aria-disabled') === 'true';
      const isHidden = btn.getAttribute('aria-hidden') === 'true' || !btn.offsetParent;
      expect(isDisabled || isHidden).toBe(true);
    }
    // If btn is null, the element was removed — also acceptable
  });

  // ── AC1: difficulty-display is rendered ───────────────────────────────────
  it('difficulty-display is visible and shows current difficulty level (AC1)', () => {
    render(<GameplayPage />);
    const display = screen.getByTestId('difficulty-display');
    expect(display).toBeInTheDocument();
    // The display should contain the numeric level or a human-readable label
    expect(display.textContent).toBeTruthy();
  });

  // ── AC2: hint timer resets after an answer ────────────────────────────────
  it('hint-button disappears after the player answers (timer resets) (AC2)', async () => {
    render(<GameplayPage />);

    // Advance timer to make hint button appear
    await act(async () => { vi.advanceTimersByTime(10_000); });
    expect(screen.getByTestId('hint-button')).toBeVisible();

    // Click an answer button (getDifficulty mocked → Level 2 question → correct is '7')
    const answerButton = screen.getByRole('button', { name: '7' });
    // fireEvent avoids userEvent's timer waiting; wrap in act to flush resetQuestion()
    await act(async () => { fireEvent.click(answerButton); });

    // resetQuestion() → setHintVisible(false) → button removed from DOM
    const hintButton = screen.queryByTestId('hint-button');
    if (hintButton !== null) {
      expect(hintButton).toHaveAttribute('aria-hidden', 'true');
    } else {
      expect(hintButton).toBeNull();
    }
  });
});
