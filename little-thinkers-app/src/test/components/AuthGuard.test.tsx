import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthGuard } from '@/components/auth/AuthGuard';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const mockPush = vi.fn();

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as ReturnType<typeof useRouter>);
    mockPush.mockReset();
  });

  it('shows loading spinner while auth is initialising', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, childProfile: null, isLoading: true } as ReturnType<typeof useAuth>);
    const { container } = render(<AuthGuard><div>Protected</div></AuthGuard>);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.queryByText('Protected')).not.toBeInTheDocument();
  });

  it('redirects to /login when user is not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, childProfile: null, isLoading: false } as ReturnType<typeof useAuth>);
    render(<AuthGuard><div>Protected</div></AuthGuard>);
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('Protected')).not.toBeInTheDocument();
  });

  it('redirects to /profile-select when requireChildProfile=true and no childProfile', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true, childProfile: null, isLoading: false } as ReturnType<typeof useAuth>);
    render(<AuthGuard requireChildProfile><div>Protected</div></AuthGuard>);
    expect(mockPush).toHaveBeenCalledWith('/profile-select');
    expect(screen.queryByText('Protected')).not.toBeInTheDocument();
  });

  it('renders children when authenticated (no childProfile required)', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true, childProfile: null, isLoading: false } as ReturnType<typeof useAuth>);
    render(<AuthGuard><div>Protected</div></AuthGuard>);
    expect(screen.getByText('Protected')).toBeInTheDocument();
  });

  it('renders children when authenticated with a selected child profile', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      childProfile: { id: 'child-1', name: 'Aiden' },
      isLoading: false,
    } as ReturnType<typeof useAuth>);
    render(<AuthGuard requireChildProfile><div>Protected</div></AuthGuard>);
    expect(screen.getByText('Protected')).toBeInTheDocument();
  });

  it('does not redirect when auth is still loading', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, childProfile: null, isLoading: true } as ReturnType<typeof useAuth>);
    render(<AuthGuard><div>Protected</div></AuthGuard>);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
