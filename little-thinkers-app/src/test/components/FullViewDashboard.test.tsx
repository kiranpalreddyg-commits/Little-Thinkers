/**
 * Story 2.3 — RED tests: Full View Dashboard
 *
 * AC1: detailed skill tracking, world map progress, streak status, assessment results
 * AC2: weekly Brain Reports available
 * AC3: quarterly pre/post assessments visible
 * AC4: child's active accessibility settings and learning preferences shown
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));
vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/lib/api/auth', () => ({ apiClient: { getChildren: vi.fn() } }));
vi.mock('@/lib/utils/parentDashboard', () => ({
  readChildDetailedView: vi.fn(),
  formatWeekLabel: vi.fn(() => 'Week of May 11 – 17'),
}));

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api/auth';
import { readChildDetailedView } from '@/lib/utils/parentDashboard';

import FullViewPage from '@/app/(shell)/parent/full-view/page';

const MOCK_CHILDREN = [
  {
    id: 'child-1',
    parent_id: 'parent-1',
    name: 'Aiden',
    age: 8,
    gameplay_mode: 'smart',
    coppa_consented: true,
    coppa_consented_at: '2026-05-01T00:00:00Z',
    accessibility_settings: {
      reducedMotion: false,
      colorBlindMode: true,
      dyslexiaFriendlyFont: false,
      textSize: 'large',
      oneHandedLayout: false,
    },
    avatar_url: null,
    created_at: '2026-05-01T00:00:00Z',
    updated_at: '2026-05-01T00:00:00Z',
  },
];

const AIDEN_DETAIL = {
  childId: 'child-1',
  skills: [
    { gameType: 'word-pop', displayName: 'Word Pop', difficultyLevel: 3, hintsUsed: 2 },
    { gameType: 'connection-quest', displayName: 'Connection Quest', difficultyLevel: 2, hintsUsed: 0 },
    { gameType: 'memory-flip', displayName: 'Memory Flip', difficultyLevel: 2, hintsUsed: 1 },
    { gameType: 'pattern-builder', displayName: 'Pattern Builder', difficultyLevel: 2, hintsUsed: 0 },
    { gameType: 'grid-logic', displayName: 'Grid Logic', difficultyLevel: 1, hintsUsed: 3 },
  ],
  worldAreas: [
    { id: 'word-woods', name: 'Word Woods', isUnlocked: true, sparkThreshold: 0 },
    { id: 'math-mountains', name: 'Math Mountains', isUnlocked: true, sparkThreshold: 20 },
    { id: 'science-sea', name: 'Science Sea', isUnlocked: false, sparkThreshold: 50 },
    { id: 'art-archipelago', name: 'Art Archipelago', isUnlocked: false, sparkThreshold: 100 },
    { id: 'history-highlands', name: 'History Highlands', isUnlocked: false, sparkThreshold: 200 },
  ],
  currentStreak: 3,
  longestStreak: 7,
  lastActivityDate: '2026-05-16',
  badges: [
    { id: 'b1', childId: 'child-1', badgeType: 'first-correct', name: 'First Spark!', description: '…', earnedAt: '2026-05-10T10:00:00Z' },
    { id: 'b2', childId: 'child-1', badgeType: 'game-complete', name: 'Game Master', description: '…', earnedAt: '2026-05-14T10:00:00Z' },
  ],
  totalSparks: 42,
  mascotLevel: 2,
  quarterlyAssessments: [
    { label: 'Pre-Assessment (Q1)', date: '2026-05-01', score: 72, status: 'completed' },
    { label: 'Post-Assessment (Q1)', date: null, score: null, status: 'pending' },
  ],
  brainReport: 'This week, Aiden maintained a 3-day streak. They have earned 42 Sparks in total and collected 2 badges.',
};

describe('FullViewPage — Story 2.3', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as ReturnType<typeof useRouter>);
    vi.mocked(useSearchParams).mockReturnValue({
      get: (k: string) => (k === 'child' ? 'child-1' : null),
    } as ReturnType<typeof useSearchParams>);
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'parent-1', email: 'james@example.com' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useAuth>);
    vi.mocked(apiClient.getChildren).mockResolvedValue(MOCK_CHILDREN);
    vi.mocked(readChildDetailedView).mockReturnValue(AIDEN_DETAIL);
  });

  // ── AC1: heading ──────────────────────────────────────────────────────────
  it('AC1: shows "Full View" heading', async () => {
    await act(async () => { render(<FullViewPage />); });
    expect(await screen.findByRole('heading', { name: /full view/i })).toBeInTheDocument();
  });

  // ── AC1: detailed skill tracking ──────────────────────────────────────────
  it('AC1: shows skill tracking section heading', async () => {
    await act(async () => { render(<FullViewPage />); });
    await screen.findByRole('heading', { name: /full view/i });
    expect(screen.getByTestId('section-skills')).toBeInTheDocument();
  });

  it('AC1: shows each game name and its difficulty level', async () => {
    await act(async () => { render(<FullViewPage />); });
    await screen.findByRole('heading', { name: /full view/i });
    expect(screen.getByText(/word pop/i)).toBeInTheDocument();
    // Word Pop is level 3
    expect(screen.getByTestId('skill-level-word-pop')).toHaveTextContent('3');
  });

  // ── AC1: world map progress ───────────────────────────────────────────────
  it('AC1: shows world map section', async () => {
    await act(async () => { render(<FullViewPage />); });
    await screen.findByRole('heading', { name: /full view/i });
    expect(screen.getByTestId('section-world-map')).toBeInTheDocument();
  });

  it('AC1: shows unlocked and locked world areas', async () => {
    await act(async () => { render(<FullViewPage />); });
    await screen.findByRole('heading', { name: /full view/i });
    expect(screen.getByText(/word woods/i)).toBeInTheDocument();
    expect(screen.getByText(/science sea/i)).toBeInTheDocument();
  });

  // ── AC1: streak status ───────────────────────────────────────────────────
  it('AC1: shows streak section with current and longest streak', async () => {
    await act(async () => { render(<FullViewPage />); });
    await screen.findByRole('heading', { name: /full view/i });
    expect(screen.getByTestId('section-streak')).toBeInTheDocument();
    expect(screen.getByTestId('current-streak')).toHaveTextContent('3');
    expect(screen.getByTestId('longest-streak')).toHaveTextContent('7');
  });

  // ── AC2: weekly Brain Report ──────────────────────────────────────────────
  it('AC2: shows Brain Report section', async () => {
    await act(async () => { render(<FullViewPage />); });
    await screen.findByRole('heading', { name: /full view/i });
    expect(screen.getByTestId('section-brain-report')).toBeInTheDocument();
  });

  it('AC2: Brain Report contains child-specific narrative text', async () => {
    await act(async () => { render(<FullViewPage />); });
    await screen.findByRole('heading', { name: /full view/i });
    expect(screen.getByTestId('brain-report-text')).toHaveTextContent(/aiden/i);
  });

  // ── AC3: quarterly assessments ────────────────────────────────────────────
  it('AC3: shows assessments section', async () => {
    await act(async () => { render(<FullViewPage />); });
    await screen.findByRole('heading', { name: /full view/i });
    expect(screen.getByTestId('section-assessments')).toBeInTheDocument();
  });

  it('AC3: shows pre-assessment as completed with score', async () => {
    await act(async () => { render(<FullViewPage />); });
    await screen.findByRole('heading', { name: /full view/i });
    expect(screen.getByTestId('assessment-0')).toHaveTextContent(/pre-assessment/i);
    expect(screen.getByTestId('assessment-0')).toHaveTextContent(/72/);
  });

  it('AC3: shows post-assessment as pending', async () => {
    await act(async () => { render(<FullViewPage />); });
    await screen.findByRole('heading', { name: /full view/i });
    expect(screen.getByTestId('assessment-1')).toHaveTextContent(/pending/i);
  });

  // ── AC4: accessibility settings & learning preferences ───────────────────
  it('AC4: shows accessibility settings section', async () => {
    await act(async () => { render(<FullViewPage />); });
    await screen.findByRole('heading', { name: /full view/i });
    expect(screen.getByTestId('section-accessibility')).toBeInTheDocument();
  });

  it('AC4: shows colorBlindMode setting correctly (enabled for Aiden)', async () => {
    await act(async () => { render(<FullViewPage />); });
    await screen.findByRole('heading', { name: /full view/i });
    expect(screen.getByTestId('setting-colorBlindMode')).toHaveTextContent(/on|enabled/i);
  });

  it('AC4: shows gameplay_mode (learning preference)', async () => {
    await act(async () => { render(<FullViewPage />); });
    await screen.findByRole('heading', { name: /full view/i });
    expect(screen.getByTestId('section-accessibility')).toHaveTextContent(/smart/i);
  });
});
