/**
 * Story 2.5 — Friend Visibility Tests
 *
 * AC2: parent can toggle friend feature visibility per child (updates immediately)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));
vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/lib/api/auth', () => ({
  apiClient: {
    getChildren: vi.fn(),
    updateChild: vi.fn(),
  },
}));

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api/auth';

import ParentSettingsPage from '@/app/(shell)/parent/settings/page';

const MOCK_CHILDREN = [
  {
    id: 'child-1',
    parent_id: 'parent-1',
    name: 'Aiden',
    age: 8,
    gameplay_mode: 'smart' as const,
    coppa_consented: true,
    coppa_consented_at: '2026-05-01T00:00:00Z',
    accessibility_settings: {},
    created_at: '2026-05-01T00:00:00Z',
    updated_at: '2026-05-01T00:00:00Z',
  },
];

describe('Friend Visibility — Story 2.5 AC2', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as ReturnType<typeof useRouter>);
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'parent-1', email: 'james@example.com' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useAuth>);
    vi.mocked(apiClient.getChildren).mockResolvedValue(MOCK_CHILDREN);
    vi.mocked(apiClient.updateChild).mockResolvedValue(MOCK_CHILDREN[0]);
  });

  it('AC2: friend visibility section is visible in settings', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('section-child-settings');
    expect(screen.getByTestId('section-friend-visibility')).toBeInTheDocument();
  });

  it('AC2: shows a friend visibility toggle per child', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('section-friend-visibility');
    expect(screen.getByTestId('friend-visibility-toggle-child-1')).toBeInTheDocument();
  });

  it('AC2: toggling friend visibility updates immediately', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('section-friend-visibility');
    const toggle = screen.getByTestId('friend-visibility-toggle-child-1') as HTMLInputElement;
    const initialChecked = toggle.checked;
    await act(async () => {
      fireEvent.click(toggle);
    });
    expect((screen.getByTestId('friend-visibility-toggle-child-1') as HTMLInputElement).checked).toBe(!initialChecked);
  });

  it('AC2: toggling twice returns to original state', async () => {
    await act(async () => { render(<ParentSettingsPage />); });
    await screen.findByTestId('section-friend-visibility');
    const toggle = screen.getByTestId('friend-visibility-toggle-child-1') as HTMLInputElement;
    const initialChecked = toggle.checked;
    await act(async () => { fireEvent.click(toggle); });
    await act(async () => { fireEvent.click(toggle); });
    expect((screen.getByTestId('friend-visibility-toggle-child-1') as HTMLInputElement).checked).toBe(initialChecked);
  });
});
