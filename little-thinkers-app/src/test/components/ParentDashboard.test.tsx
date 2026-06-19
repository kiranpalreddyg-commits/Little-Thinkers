/**
 * Story 2.2 — RED tests: Quick View Dashboard
 *
 * AC1: Parent sees a concise weekly progress summary
 * AC2: Summary includes high-level engagement and achievement metrics
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/lib/api/auth', () => ({
  apiClient: {
    getChildren: vi.fn(),
  },
}));
vi.mock('@/lib/utils/parentDashboard', () => ({
  readChildSummary: vi.fn(),
  formatWeekLabel: vi.fn(() => 'Week of May 11 – 17'),
}));

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api/auth';
import { readChildSummary } from '@/lib/utils/parentDashboard';

import ParentDashboardPage from '@/app/(shell)/parent/dashboard/page';

const MOCK_CHILDREN = [
  {
    id: 'child-1',
    parent_id: 'parent-1',
    name: 'Aiden',
    age: 8,
    gameplay_mode: 'smart',
    coppa_consented: true,
    coppa_consented_at: '2026-05-01T00:00:00Z',
    accessibility_settings: {},
    created_at: '2026-05-01T00:00:00Z',
    updated_at: '2026-05-01T00:00:00Z',
  },
  {
    id: 'child-2',
    parent_id: 'parent-1',
    name: 'Maya',
    age: 14,
    gameplay_mode: 'challenge',
    coppa_consented: true,
    coppa_consented_at: '2026-05-02T00:00:00Z',
    accessibility_settings: {},
    created_at: '2026-05-02T00:00:00Z',
    updated_at: '2026-05-02T00:00:00Z',
  },
];

const AIDEN_SUMMARY = {
  childId: 'child-1',
  currentStreak: 3,
  longestStreak: 5,
  totalSparks: 42,
  badgesThisWeek: 2,
  totalBadges: 4,
  worldAreasUnlocked: 2,
  mascotLevel: 2,
};

const MAYA_SUMMARY = {
  childId: 'child-2',
  currentStreak: 1,
  longestStreak: 7,
  totalSparks: 18,
  badgesThisWeek: 0,
  totalBadges: 1,
  worldAreasUnlocked: 1,
  mascotLevel: 1,
};

describe('ParentDashboardPage — Story 2.2 Quick View', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as ReturnType<typeof useRouter>);
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'parent-1', email: 'james@example.com' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useAuth>);
    vi.mocked(apiClient.getChildren).mockResolvedValue(MOCK_CHILDREN);
    vi.mocked(readChildSummary).mockImplementation((childId) =>
      childId === 'child-1' ? AIDEN_SUMMARY : MAYA_SUMMARY,
    );
  });

  // ── AC1: weekly summary heading ───────────────────────────────────────────
  it('AC1: shows "Quick View" heading', async () => {
    await act(async () => { render(<ParentDashboardPage />); });
    expect(await screen.findByRole('heading', { name: /quick view/i })).toBeInTheDocument();
  });

  it('AC1: shows the current week label', async () => {
    await act(async () => { render(<ParentDashboardPage />); });
    expect(await screen.findByText(/week of/i)).toBeInTheDocument();
  });

  it('AC1: shows a summary card for each child (Aiden and Maya)', async () => {
    await act(async () => { render(<ParentDashboardPage />); });
    expect(await screen.findByText(/aiden/i)).toBeInTheDocument();
    expect(await screen.findByText(/maya/i)).toBeInTheDocument();
  });

  // ── AC2: engagement metrics ───────────────────────────────────────────────
  it('AC2: shows current streak (engagement metric)', async () => {
    await act(async () => { render(<ParentDashboardPage />); });
    await screen.findByText(/aiden/i);
    // Aiden has 3-day streak
    expect(screen.getByTestId('streak-child-1')).toHaveTextContent('3');
  });

  it('AC2: shows total sparks (engagement metric)', async () => {
    await act(async () => { render(<ParentDashboardPage />); });
    await screen.findByText(/aiden/i);
    expect(screen.getByTestId('sparks-child-1')).toHaveTextContent('42');
  });

  // ── AC2: achievement metrics ──────────────────────────────────────────────
  it('AC2: shows badges earned this week (achievement metric)', async () => {
    await act(async () => { render(<ParentDashboardPage />); });
    await screen.findByText(/aiden/i);
    expect(screen.getByTestId('badges-child-1')).toHaveTextContent('2');
  });

  it('AC2: shows world areas unlocked (achievement metric)', async () => {
    await act(async () => { render(<ParentDashboardPage />); });
    await screen.findByText(/aiden/i);
    expect(screen.getByTestId('areas-child-1')).toHaveTextContent('2');
  });

  it('AC2: shows mascot level (achievement metric)', async () => {
    await act(async () => { render(<ParentDashboardPage />); });
    await screen.findByText(/aiden/i);
    expect(screen.getByTestId('mascot-child-1')).toHaveTextContent('2');
  });

  // ── Zero-state (Maya has 0 badges this week) ─────────────────────────────
  it('AC2: shows 0 badges this week for Maya', async () => {
    await act(async () => { render(<ParentDashboardPage />); });
    await screen.findByText(/maya/i);
    expect(screen.getByTestId('badges-child-2')).toHaveTextContent('0');
  });
});
