import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileSelector } from '@/components/auth/ProfileSelector';
import { ChildProfile } from '@/lib/types/auth';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
  useChildProfiles: vi.fn(),
}));

import { useAuth, useChildProfiles } from '@/hooks/useAuth';

const MOCK_PROFILES: ChildProfile[] = [
  {
    id: 'child-1',
    parent_id: 'parent-1',
    name: 'Aiden',
    age: 8,
    gameplay_mode: 'smart',
    avatar_url: undefined,
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
    avatar_url: undefined,
    accessibility_settings: {},
    created_at: '2026-05-02T00:00:00Z',
    updated_at: '2026-05-02T00:00:00Z',
  },
];

describe('ProfileSelector', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({ selectChildProfile: vi.fn() } as ReturnType<typeof useAuth>);
    vi.mocked(useChildProfiles).mockReturnValue({
      profiles: MOCK_PROFILES,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('shows loading spinner while fetching profiles', () => {
    vi.mocked(useChildProfiles).mockReturnValue({
      profiles: [],
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });
    render(<ProfileSelector />);
    expect(screen.getByText(/Loading profiles/i)).toBeInTheDocument();
  });

  it('shows error state with retry button when fetch fails', () => {
    vi.mocked(useChildProfiles).mockReturnValue({
      profiles: [],
      isLoading: false,
      error: 'Failed to fetch profiles',
      refetch: vi.fn(),
    });
    render(<ProfileSelector />);
    expect(screen.getByText(/Unable to Load Profiles/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
  });

  it('calls refetch when Try Again is clicked', async () => {
    const refetch = vi.fn();
    vi.mocked(useChildProfiles).mockReturnValue({
      profiles: [],
      isLoading: false,
      error: 'Network error',
      refetch,
    });
    render(<ProfileSelector />);
    await userEvent.click(screen.getByRole('button', { name: /Try Again/i }));
    expect(refetch).toHaveBeenCalled();
  });

  it('shows empty state when no profiles exist', () => {
    vi.mocked(useChildProfiles).mockReturnValue({
      profiles: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<ProfileSelector />);
    expect(screen.getByText(/No Child Profiles Found/i)).toBeInTheDocument();
  });

  it('renders profile cards with name, age, and gameplay mode', () => {
    render(<ProfileSelector />);
    expect(screen.getByText('Aiden')).toBeInTheDocument();
    expect(screen.getByText('8 years old')).toBeInTheDocument();
    expect(screen.getByText('Smart Mode')).toBeInTheDocument();
    expect(screen.getByText('Maya')).toBeInTheDocument();
    expect(screen.getByText('14 years old')).toBeInTheDocument();
    expect(screen.getByText('Challenge Mode')).toBeInTheDocument();
  });

  it('calls onProfileSelected when a profile card is clicked', async () => {
    const onProfileSelected = vi.fn();
    render(<ProfileSelector onProfileSelected={onProfileSelected} />);
    await userEvent.click(screen.getAllByRole('button').find(b => b.textContent?.includes('Aiden'))!);
    expect(onProfileSelected).toHaveBeenCalledWith(MOCK_PROFILES[0]);
  });

  it('shows Continue button after selecting a profile', async () => {
    render(<ProfileSelector />);
    await userEvent.click(screen.getAllByRole('button').find(b => b.textContent?.includes('Aiden'))!);
    expect(screen.getByRole('button', { name: /Continue as Aiden/i })).toBeInTheDocument();
  });

  it('shows profile heading when profiles are loaded', () => {
    render(<ProfileSelector />);
    expect(screen.getByText(/Choose Your Profile/i)).toBeInTheDocument();
  });
});
