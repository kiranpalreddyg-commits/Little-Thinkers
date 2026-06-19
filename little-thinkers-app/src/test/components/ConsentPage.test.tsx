/**
 * Story 2.1 — RED tests: Consent Management Page
 *
 * AC3: Parent can withdraw or re-grant per-child COPPA consent
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/lib/api/auth', () => ({
  apiClient: {
    getChildren: vi.fn(),
    updateChildConsent: vi.fn(),
  },
}));

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api/auth';

import ConsentPage from '@/app/(auth)/parent/consent/page';

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
    coppa_consented: false,
    coppa_consented_at: null,
    accessibility_settings: {},
    created_at: '2026-05-02T00:00:00Z',
    updated_at: '2026-05-02T00:00:00Z',
  },
];

describe('ConsentPage — Story 2.1 AC3', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as ReturnType<typeof useRouter>);
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'parent-1', email: 'james@example.com' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useAuth>);
    vi.mocked(apiClient.getChildren).mockResolvedValue(MOCK_CHILDREN);
    vi.mocked(apiClient.updateChildConsent).mockImplementation(async (childId, consented) => ({
      ...MOCK_CHILDREN.find((c) => c.id === childId)!,
      coppa_consented: consented,
      coppa_consented_at: consented ? new Date().toISOString() : null,
    }));
  });

  it('shows each child name in the consent list (AC3)', async () => {
    await act(async () => { render(<ConsentPage />); });
    const aidensLi = document.querySelector('[data-child-id="child-1"]') as HTMLElement;
    const mayasLi = document.querySelector('[data-child-id="child-2"]') as HTMLElement;
    expect(aidensLi).toBeTruthy();
    // Use exact string to avoid matching "Withdraw for Aiden" button text
    expect(within(aidensLi).getByText('Aiden')).toBeInTheDocument();
    expect(mayasLi).toBeTruthy();
    expect(within(mayasLi).getByText('Maya')).toBeInTheDocument();
  });

  it('shows "Consent granted" status for Aiden (AC3)', async () => {
    await act(async () => { render(<ConsentPage />); });
    await screen.findByText(/withdraw.*aiden/i);
    const aidensLi = document.querySelector('[data-child-id="child-1"]') as HTMLElement;
    expect(within(aidensLi).getByText(/consent granted/i)).toBeInTheDocument();
  });

  it('shows "Consent not granted" status for Maya (AC3)', async () => {
    await act(async () => { render(<ConsentPage />); });
    await screen.findByText(/grant.*maya/i);
    const mayasLi = document.querySelector('[data-child-id="child-2"]') as HTMLElement;
    expect(within(mayasLi).getByText(/consent not granted/i)).toBeInTheDocument();
  });

  it('calls apiClient.updateChildConsent(child-1, false) when "Withdraw" is clicked for Aiden (AC3)', async () => {
    await act(async () => { render(<ConsentPage />); });
    const withdrawBtn = await screen.findByRole('button', { name: /withdraw.*aiden/i });
    await act(async () => { fireEvent.click(withdrawBtn); });
    expect(apiClient.updateChildConsent).toHaveBeenCalledWith('child-1', false);
  });

  it('calls apiClient.updateChildConsent(child-2, true) when "Grant" is clicked for Maya (AC3)', async () => {
    await act(async () => { render(<ConsentPage />); });
    const grantBtn = await screen.findByRole('button', { name: /grant.*maya/i });
    await act(async () => { fireEvent.click(grantBtn); });
    expect(apiClient.updateChildConsent).toHaveBeenCalledWith('child-2', true);
  });
});
