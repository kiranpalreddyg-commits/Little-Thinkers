/**
 * Story 2.1 — RED tests: Child Setup Page and Consent Management
 *
 * AC1: Parent can link one or more child profiles after signup
 * AC2: Parent provides per-child COPPA consent during child profile creation
 * AC3: Parent can withdraw per-child COPPA consent from consent page
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/lib/api/auth', () => ({
  apiClient: {
    addChild: vi.fn(),
    getChildren: vi.fn(),
    updateChildConsent: vi.fn(),
  },
}));

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api/auth';

// ── ChildSetupPage ────────────────────────────────────────────────────────────
import ChildSetupPage from '@/app/(auth)/signup/child-setup/page';

const MOCK_AUTH_AUTHENTICATED = {
  user: { id: 'parent-1', email: 'james@example.com' },
  isAuthenticated: true,
  isLoading: false,
  error: null,
  login: vi.fn(),
  signup: vi.fn(),
  logout: vi.fn(),
};

describe('ChildSetupPage — Story 2.1 AC1 + AC2', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as ReturnType<typeof useRouter>);
    vi.mocked(useAuth).mockReturnValue(MOCK_AUTH_AUTHENTICATED as ReturnType<typeof useAuth>);
    vi.mocked(apiClient.addChild).mockResolvedValue({
      id: 'child-new',
      parent_id: 'parent-1',
      name: 'Sam',
      age: 10,
      avatar_url: null,
      accessibility_settings: {},
      gameplay_mode: 'smart',
      coppa_consented: true,
      coppa_consented_at: '2026-05-17T00:00:00Z',
      created_at: '2026-05-17T00:00:00Z',
      updated_at: '2026-05-17T00:00:00Z',
    });
  });

  it('renders the child profile form with name and age fields (AC1)', () => {
    render(<ChildSetupPage />);
    expect(screen.getByLabelText(/child.?s name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
  });

  it('renders a COPPA consent checkbox for the child (AC2)', () => {
    render(<ChildSetupPage />);
    expect(screen.getByRole('checkbox', { name: /coppa/i })).toBeInTheDocument();
  });

  it('submit button is disabled when COPPA consent is not checked (AC2)', () => {
    render(<ChildSetupPage />);
    const submitBtn = screen.getByRole('button', { name: /add child/i });
    expect(submitBtn).toBeDisabled();
  });

  it('submit button is enabled when all required fields are filled and COPPA checked (AC2)', async () => {
    render(<ChildSetupPage />);
    fireEvent.change(screen.getByLabelText(/child.?s name/i), { target: { value: 'Sam' } });
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /coppa/i }));
    expect(screen.getByRole('button', { name: /add child/i })).not.toBeDisabled();
  });

  it('calls apiClient.addChild with coppa_consented=true on submit (AC2)', async () => {
    render(<ChildSetupPage />);
    fireEvent.change(screen.getByLabelText(/child.?s name/i), { target: { value: 'Sam' } });
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /coppa/i }));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /add child/i }));
    });

    expect(apiClient.addChild).toHaveBeenCalledWith('Sam', 10, expect.any(String), true);
  });

  it('shows added child name in the enrolled list after successful add (AC1)', async () => {
    render(<ChildSetupPage />);
    fireEvent.change(screen.getByLabelText(/child.?s name/i), { target: { value: 'Sam' } });
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /coppa/i }));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /add child/i }));
    });

    expect(screen.getByText(/sam/i)).toBeInTheDocument();
  });

  it('renders "Add another child" button after first child is added (AC1)', async () => {
    render(<ChildSetupPage />);
    fireEvent.change(screen.getByLabelText(/child.?s name/i), { target: { value: 'Sam' } });
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /coppa/i }));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /add child/i }));
    });

    expect(screen.getByRole('button', { name: /add another/i })).toBeInTheDocument();
  });

  it('navigates to /profile-select when "Continue" is clicked after at least one child added (AC1)', async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as ReturnType<typeof useRouter>);
    render(<ChildSetupPage />);

    fireEvent.change(screen.getByLabelText(/child.?s name/i), { target: { value: 'Sam' } });
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /coppa/i }));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /add child/i }));
    });

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(push).toHaveBeenCalledWith('/profile-select');
  });
});
