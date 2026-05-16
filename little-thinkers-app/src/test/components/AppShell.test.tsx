/**
 * Story 7.2 — Bottom Tab Navigation and App Shell
 *
 * Tests are written FIRST (TDD). All tests MUST FAIL until the components
 * are implemented:
 *   - @/components/navigation/TabBar
 *   - @/components/navigation/AppHeader
 *   - @/components/navigation/AppShell
 *   - @/components/home/DailyChallengeCard
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';

// ── Vitest 4 localStorage stub ──────────────────────────────────────────────
const _store = new Map<string, string>();
beforeAll(() => {
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => _store.get(k) ?? null,
    setItem: (k: string, v: string) => _store.set(k, v),
    removeItem: (k: string) => _store.delete(k),
    clear: () => _store.clear(),
    get length() { return _store.size; },
    key: (n: number) => [..._store.keys()][n] ?? null,
  });
});

// ── Mock next/navigation (Next.js App Router requires this in jsdom) ─────────
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// ── Mock next/link (used directly by nav components) ────────────────────────
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Components under test (will not exist until implementation)
import { TabBar } from '@/components/navigation/TabBar';
import { AppHeader } from '@/components/navigation/AppHeader';
import { AppShell } from '@/components/navigation/AppShell';
import { DailyChallengeCard } from '@/components/home/DailyChallengeCard';

// ═══════════════════════════════════════════════════════════════════════════
// TabBar
// ═══════════════════════════════════════════════════════════════════════════

describe('TabBar', () => {
  it('renders all 5 tab labels', () => {
    render(<TabBar />);
    expect(screen.getByText(/^Home$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Play$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Learn$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Progress$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Profile$/i)).toBeInTheDocument();
  });

  it('has an accessible navigation role with a label', () => {
    render(<TabBar />);
    // Must be reachable via role="navigation" or role="tablist"
    const nav =
      screen.queryByRole('navigation', { name: /bottom tab/i }) ??
      screen.queryByRole('tablist', { name: /bottom tab/i });
    expect(nav).toBeInTheDocument();
  });

  it('"Progress" tab links to /my-progress', () => {
    render(<TabBar />);
    const progressLink = screen.getByRole('link', { name: /Progress/i });
    expect(progressLink).toHaveAttribute('href', '/my-progress');
  });

  it('"Profile" tab links to /settings or /profile', () => {
    render(<TabBar />);
    const profileLink = screen.getByRole('link', { name: /Profile/i });
    const href = profileLink.getAttribute('href') ?? '';
    expect(['/settings', '/profile']).toContain(href);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// AppHeader
// ═══════════════════════════════════════════════════════════════════════════

describe('AppHeader', () => {
  it('renders "Little Thinkers" brand text', () => {
    render(<AppHeader />);
    expect(screen.getByText(/Little Thinkers/i)).toBeInTheDocument();
  });

  it('renders the spark count when sparkCount prop is passed', () => {
    render(<AppHeader sparkCount={42} />);
    expect(screen.getByText(/42/)).toBeInTheDocument();
  });

  it('renders 0 sparks gracefully when no sparkCount prop is provided', () => {
    render(<AppHeader />);
    // Should not crash; spark count element should exist and show 0 (or be absent — both acceptable)
    // We test it does NOT throw by asserting the header brand is still present
    expect(screen.getByText(/Little Thinkers/i)).toBeInTheDocument();
    // And the spark counter element should render 0 (if present at all, it must not be NaN/undefined)
    const counter = screen.queryByTestId('spark-count');
    if (counter !== null) {
      const text = counter.textContent ?? '';
      expect(text).toMatch(/^0$|^0 /);
    }
  });

  it('renders an avatar or profile element', () => {
    render(<AppHeader />);
    // Expect an avatar image, button, or element with role="img" / data-testid="avatar"
    const avatar =
      screen.queryByTestId('avatar') ??
      screen.queryByRole('img', { name: /avatar|profile/i }) ??
      screen.queryByRole('button', { name: /avatar|profile|account/i });
    expect(avatar).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// AppShell
// ═══════════════════════════════════════════════════════════════════════════

describe('AppShell', () => {
  it('renders children wrapped with AppHeader and TabBar', () => {
    render(
      <AppShell>
        <div data-testid="page-content">Hello World</div>
      </AppShell>
    );
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
    expect(screen.getByText(/Little Thinkers/i)).toBeInTheDocument();
    expect(screen.getByText(/^Home$/i)).toBeInTheDocument();
  });

  it('hides TabBar when hideTabBar prop is true', () => {
    render(
      <AppShell hideTabBar>
        <div>Content</div>
      </AppShell>
    );
    expect(screen.queryByText(/^Home$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Play$/i)).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// DailyChallengeCard
// ═══════════════════════════════════════════════════════════════════════════

describe('DailyChallengeCard', () => {
  const defaultProps = {
    gameType: 'word-pop' as const,
    title: 'Word Pop',
  };

  it('renders "Daily Challenge" label', () => {
    render(<DailyChallengeCard {...defaultProps} />);
    expect(screen.getByText(/Daily Challenge/i)).toBeInTheDocument();
  });

  it('has a link that navigates to a game route', () => {
    render(<DailyChallengeCard {...defaultProps} />);
    // Either a <a href="/play/word-pop"> or any link matching /play/
    const link = screen.getByRole('link');
    const href = link.getAttribute('href') ?? '';
    expect(href).toMatch(/\/play\//);
  });
});
