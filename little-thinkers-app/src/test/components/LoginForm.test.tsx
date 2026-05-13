import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/auth/LoginForm';

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '@/hooks/useAuth';

const mockLogin = vi.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useAuth>);
    mockLogin.mockReset();
  });

  it('renders email and password inputs', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('submit button is disabled when fields are empty', () => {
    render(<LoginForm />);
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeDisabled();
  });

  it('enables submit button when both fields have content', async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/Email Address/i), 'james@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'secret');
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeEnabled();
  });

  it('calls login with trimmed email and password on submit', async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/Email Address/i), '  james@example.com  ');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    expect(mockLogin).toHaveBeenCalledWith({ email: 'james@example.com', password: 'password123' });
  });

  it('calls onSuccess callback after successful login', async () => {
    const onSuccess = vi.fn();
    mockLogin.mockResolvedValueOnce(undefined);
    render(<LoginForm onSuccess={onSuccess} />);
    await userEvent.type(screen.getByLabelText(/Email Address/i), 'james@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it('shows error message from useAuth', () => {
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Invalid email or password',
    } as ReturnType<typeof useAuth>);
    render(<LoginForm />);
    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
  });

  it('shows loading state and disables submit during submission', () => {
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
    } as ReturnType<typeof useAuth>);
    render(<LoginForm />);
    expect(screen.getByText(/Signing in/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Signing in/i })).toBeDisabled();
  });

  it('toggles password field between password and text type', async () => {
    render(<LoginForm />);
    const passwordInput = screen.getByLabelText(/Password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    const toggleBtn = screen.getAllByRole('button').find(b => b.getAttribute('type') === 'button');
    await userEvent.click(toggleBtn!);
    expect(passwordInput).toHaveAttribute('type', 'text');
    await userEvent.click(toggleBtn!);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('shows link to signup page', () => {
    render(<LoginForm />);
    expect(screen.getByRole('link', { name: /Create one/i })).toHaveAttribute('href', '/signup');
  });
});
