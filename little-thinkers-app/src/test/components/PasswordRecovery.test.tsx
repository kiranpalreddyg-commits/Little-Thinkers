/**
 * Story 2.5 — RED tests: Password Recovery + Friend Visibility
 *
 * AC1: parent can request password recovery and reset their password
 * AC2: parent can toggle friend feature visibility per child
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(() => ({ get: () => null })),
}));
vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/lib/api/auth', () => ({
  apiClient: {
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
    getChildren: vi.fn(),
  },
}));

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api/auth';

import ForgotPasswordPage from '@/app/(auth)/forgot-password/page';
import ResetPasswordPage from '@/app/(auth)/reset-password/page';

describe('ForgotPasswordPage — Story 2.5 AC1', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as ReturnType<typeof useRouter>);
    vi.mocked(useAuth).mockReturnValue({
      user: null, isAuthenticated: false, isLoading: false, error: null,
    } as ReturnType<typeof useAuth>);
    vi.mocked(apiClient.forgotPassword).mockResolvedValue({ message: 'Recovery email sent' });
  });

  it('AC1: shows email input', async () => {
    await act(async () => { render(<ForgotPasswordPage />); });
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('AC1: shows submit button', async () => {
    await act(async () => { render(<ForgotPasswordPage />); });
    expect(screen.getByTestId('forgot-submit')).toBeInTheDocument();
  });

  it('AC1: submitting with valid email calls forgotPassword', async () => {
    await act(async () => { render(<ForgotPasswordPage />); });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'james@example.com' } });
    await act(async () => {
      fireEvent.click(screen.getByTestId('forgot-submit'));
    });
    expect(apiClient.forgotPassword).toHaveBeenCalledWith('james@example.com');
  });

  it('AC1: shows confirmation message after submission', async () => {
    await act(async () => { render(<ForgotPasswordPage />); });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'james@example.com' } });
    await act(async () => {
      fireEvent.click(screen.getByTestId('forgot-submit'));
    });
    expect(screen.getByTestId('recovery-confirmation')).toBeInTheDocument();
  });

  it('AC1: has a link back to login', async () => {
    await act(async () => { render(<ForgotPasswordPage />); });
    expect(screen.getByTestId('back-to-login')).toBeInTheDocument();
  });
});

describe('ResetPasswordPage — Story 2.5 AC1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as ReturnType<typeof useRouter>);
    vi.mocked(useAuth).mockReturnValue({
      user: null, isAuthenticated: false, isLoading: false, error: null,
    } as ReturnType<typeof useAuth>);
    vi.mocked(useSearchParams).mockReturnValue({
      get: (key: string) => key === 'token' ? 'mock-reset-token' : null,
    } as ReturnType<typeof useSearchParams>);
    vi.mocked(apiClient.resetPassword).mockResolvedValue({ message: 'Password reset successful' });
  });

  it('AC1: shows new password and confirm password inputs', async () => {
    await act(async () => { render(<ResetPasswordPage />); });
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm.*password/i)).toBeInTheDocument();
  });

  it('AC1: shows reset button', async () => {
    await act(async () => { render(<ResetPasswordPage />); });
    expect(screen.getByTestId('reset-submit')).toBeInTheDocument();
  });

  it('AC1: submit calls resetPassword with token and new password', async () => {
    await act(async () => { render(<ResetPasswordPage />); });
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'NewPass123!' } });
    fireEvent.change(screen.getByLabelText(/confirm.*password/i), { target: { value: 'NewPass123!' } });
    await act(async () => {
      fireEvent.click(screen.getByTestId('reset-submit'));
    });
    expect(apiClient.resetPassword).toHaveBeenCalledWith('mock-reset-token', 'NewPass123!');
  });

  it('AC1: mismatched passwords shows error and does not submit', async () => {
    await act(async () => { render(<ResetPasswordPage />); });
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'NewPass123!' } });
    fireEvent.change(screen.getByLabelText(/confirm.*password/i), { target: { value: 'Different!' } });
    await act(async () => {
      fireEvent.click(screen.getByTestId('reset-submit'));
    });
    expect(apiClient.resetPassword).not.toHaveBeenCalled();
    expect(screen.getByTestId('password-mismatch-error')).toBeInTheDocument();
  });

  it('AC1: on success redirects to login', async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as ReturnType<typeof useRouter>);
    await act(async () => { render(<ResetPasswordPage />); });
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'NewPass123!' } });
    fireEvent.change(screen.getByLabelText(/confirm.*password/i), { target: { value: 'NewPass123!' } });
    await act(async () => {
      fireEvent.click(screen.getByTestId('reset-submit'));
    });
    expect(push).toHaveBeenCalledWith('/login');
  });
});
