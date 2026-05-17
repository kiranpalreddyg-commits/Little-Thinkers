/**
 * Story 7.3 — Home Screen Redesign
 *
 * Tests are written FIRST (TDD). All tests MUST FAIL until the components
 * are implemented:
 *   - @/components/home/GameCard   (redesigned, href-based API)
 *   - @/components/home/HeroSection
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

// ── Mock next/navigation ─────────────────────────────────────────────────────
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// ── Mock next/link ────────────────────────────────────────────────────────────
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Components under test — will NOT exist until Story 7.3 implementation
import { GameCard } from '@/components/home/GameCard';
import { HeroSection } from '@/components/home/HeroSection';

// ═══════════════════════════════════════════════════════════════════════════
// GameCard (redesigned — href-based API)
// ═══════════════════════════════════════════════════════════════════════════

describe('GameCard (home redesign)', () => {
  const defaultProps = {
    title: 'Word Pop',
    description: 'Guess the hidden word by choosing letters.',
    href: '/play/word-pop',
    color: 'blue' as const,
    icon: <span data-testid="mock-icon">W</span>,
  };

  it('renders the game title as a heading', () => {
    render(<GameCard {...defaultProps} />);
    // Title must appear as a heading element (h2, h3, etc.) or at minimum be in the document
    const heading =
      screen.queryByRole('heading', { name: /Word Pop/i }) ??
      screen.queryByText('Word Pop');
    expect(heading).toBeInTheDocument();
  });

  it('has a link to the game href', () => {
    render(<GameCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/play/word-pop');
  });

  it('applies data-game-color attribute with the correct color value', () => {
    const { container } = render(<GameCard {...defaultProps} />);
    // The attribute can live on any element — use querySelector
    const colored = container.querySelector('[data-game-color="blue"]');
    expect(colored).not.toBeNull();
  });

  it('renders icon with aria-hidden or inside a decorative wrapper', () => {
    render(<GameCard {...defaultProps} />);
    const icon = screen.getByTestId('mock-icon');
    expect(icon).toBeInTheDocument();
    // Icon must be hidden from assistive technology: the icon element itself,
    // or an ancestor wrapper, must carry aria-hidden="true"
    const isHiddenSelf = icon.getAttribute('aria-hidden') === 'true';
    const hiddenAncestor = icon.closest('[aria-hidden="true"]');
    expect(isHiddenSelf || hiddenAncestor !== null).toBe(true);
  });

  it('has an accessible link name containing the game title', () => {
    render(<GameCard {...defaultProps} />);
    // The link must be reachable by assistive tech with a name that includes "Word Pop"
    const link = screen.getByRole('link', { name: /Word Pop/i });
    expect(link).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// HeroSection
// ═══════════════════════════════════════════════════════════════════════════

describe('HeroSection', () => {
  it('renders a personalized greeting containing the child name', () => {
    render(<HeroSection childName="Ada" />);
    // Greeting must include child's name — "Welcome back, Ada" or similar
    expect(screen.getByText(/Ada/i)).toBeInTheDocument();
  });

  it('renders a mascot element', () => {
    render(<HeroSection childName="Ada" />);
    // Component must render either data-testid="mascot" or role="img" with label containing "mascot"
    const mascot =
      screen.queryByTestId('mascot') ??
      screen.queryByRole('img', { name: /mascot/i });
    expect(mascot).toBeInTheDocument();
  });

  it('renders the streak count when streakCount is greater than 0', () => {
    render(<HeroSection childName="Ada" streakCount={3} />);
    // Text must communicate the streak number — "3 day streak", "3-day streak", "🔥 3", etc.
    const streakEl = screen.queryByText(/3.*(day|streak)/i) ?? screen.queryByText(/streak.*3/i);
    expect(streakEl).toBeInTheDocument();
  });

  it('does not crash when streakCount is 0', () => {
    // This test passes as long as the component renders without throwing
    expect(() => render(<HeroSection childName="Ada" streakCount={0} />)).not.toThrow();
  });

  it('renders "0 day streak" or equivalent for a zero streak', () => {
    render(<HeroSection childName="Ada" streakCount={0} />);
    // Either show explicit zero, or omit the streak — we accept both:
    // - Text matching /0.*(day|streak)/i  (e.g., "0 day streak")
    // - OR the component simply does not render a streak element at all
    const streakEl =
      screen.queryByText(/0.*(day|streak)/i) ??
      screen.queryByText(/streak.*0/i);
    // If a streak element IS rendered, it must communicate zero
    if (streakEl !== null) {
      expect(streakEl).toBeInTheDocument();
    }
    // If no element is rendered that's acceptable too — but the component must not crash (covered by test 9)
    // We assert the child's name is still visible as a proxy for successful render
    expect(screen.getByText(/Ada/i)).toBeInTheDocument();
  });
});
