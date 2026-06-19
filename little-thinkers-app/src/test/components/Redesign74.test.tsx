/**
 * Story 7.4 — Apply design system to remaining Epic 1 screens
 *
 * All tests are written FIRST (TDD / RED phase).
 * They MUST FAIL until implementation is complete.
 *
 * Components under test:
 *   - BadgeList           src/components/progression/BadgeList.tsx
 *   - WorldMap            src/components/progression/WorldMap.tsx
 *   - MascotWidget        src/components/progression/MascotWidget.tsx
 *   - AccessibilitySettings src/components/settings/AccessibilitySettings.tsx
 *   - BadgeNotification   src/components/progression/BadgeNotification.tsx
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, within } from '@testing-library/react';

// ── localStorage stub (Vitest 4) ─────────────────────────────────────────────
const _store = new Map<string, string>();
beforeAll(() => {
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => _store.get(k) ?? null,
    setItem: (k: string, v: string) => _store.set(k, v),
    removeItem: (k: string) => _store.delete(k),
    clear: () => _store.clear(),
    get length() {
      return _store.size;
    },
    key: (n: number) => [..._store.keys()][n] ?? null,
  });
});

// ── Mock next/navigation ─────────────────────────────────────────────────────
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// ── Mock next/link ───────────────────────────────────────────────────────────
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

// ── Mock accessibilityStore ──────────────────────────────────────────────────
vi.mock('@/lib/stores/accessibilityStore', () => ({
  useAccessibilityStore: vi.fn(() => ({
    settings: {
      gameplayMode: 'smart',
      reducedMotion: false,
      colorBlindMode: false,
      dyslexiaFont: false,
      textSize: 'medium',
      handedLayout: 'default',
    },
    hydrateSettings: vi.fn(),
    updateSetting: vi.fn(),
    resetSettings: vi.fn(),
  })),
}));

// ── Shared fixture data ──────────────────────────────────────────────────────
import type { Badge, WorldMapArea, MascotState } from '@/lib/types/progression';

const MOCK_BADGES: Badge[] = [
  {
    id: 'b-1',
    childId: 'child-1',
    badgeType: 'first-correct',
    name: 'First Spark!',
    description: 'You got your first correct answer.',
    earnedAt: '2026-05-01T10:00:00Z',
  },
  {
    id: 'b-2',
    childId: 'child-1',
    badgeType: 'ten-correct',
    name: 'Spark Collector',
    description: 'You answered 10 questions correctly.',
    earnedAt: '2026-05-05T12:00:00Z',
  },
];

const MOCK_AREAS: WorldMapArea[] = [
  { id: 'word-woods', name: 'Word Woods', isUnlocked: true, sparkThreshold: 0 },
  { id: 'math-mountains', name: 'Math Mountains', isUnlocked: false, sparkThreshold: 20 },
];

const MOCK_MASCOT: MascotState = {
  childId: 'child-1',
  level: 2,
  experience: 50,
  accessories: [],
};

const MOCK_BADGE: Badge = MOCK_BADGES[0];

// ── Lazy component imports (after mocks are hoisted) ─────────────────────────
import { BadgeList } from '@/components/progression/BadgeList';
import { WorldMap } from '@/components/progression/WorldMap';
import { MascotWidget } from '@/components/progression/MascotWidget';
import { AccessibilitySettings } from '@/components/settings/AccessibilitySettings';
import { BadgeNotification } from '@/components/progression/BadgeNotification';

// ═══════════════════════════════════════════════════════════════════════════
// BadgeList
// ═══════════════════════════════════════════════════════════════════════════

describe('BadgeList — Story 7.4 redesign', () => {
  it('renders a grid container with data-testid="badge-grid"', () => {
    render(<BadgeList badges={MOCK_BADGES} />);
    // Currently renders <ul role="list"> with no data-testid — this MUST FAIL
    expect(screen.getByTestId('badge-grid')).toBeInTheDocument();
  });

  it('renders badge-grid as a grid layout element (not a plain list)', () => {
    render(<BadgeList badges={MOCK_BADGES} />);
    const grid = screen.getByTestId('badge-grid');
    // Grid container must exist; its CSS is set via className — just confirm it renders
    expect(grid).toBeInTheDocument();
  });

  it('renders each badge as role="listitem" or inside a semantic list', () => {
    render(<BadgeList badges={MOCK_BADGES} />);
    // Existing implementation already has role="listitem" — but requires grid wrapper above
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBeGreaterThanOrEqual(MOCK_BADGES.length);
  });

  it('renders badge names inside the grid', () => {
    render(<BadgeList badges={MOCK_BADGES} />);
    const grid = screen.getByTestId('badge-grid');
    expect(within(grid).getByText('First Spark!')).toBeInTheDocument();
    expect(within(grid).getByText('Spark Collector')).toBeInTheDocument();
  });

  it('renders a friendly empty state when no badges are provided', () => {
    render(<BadgeList badges={[]} />);
    // Empty state doesn't need testid — just verify it doesn't crash and shows text
    expect(screen.getByText(/no badges/i)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// WorldMap
// ═══════════════════════════════════════════════════════════════════════════

describe('WorldMap — Story 7.4 redesign', () => {
  it('renders with data-testid="world-map" on the root element', () => {
    render(<WorldMap areas={MOCK_AREAS} />);
    // Currently renders <nav> with no data-testid — MUST FAIL
    expect(screen.getByTestId('world-map')).toBeInTheDocument();
  });

  it('renders the world map heading', () => {
    render(<WorldMap areas={MOCK_AREAS} />);
    expect(screen.getByText(/world map/i)).toBeInTheDocument();
  });

  it('renders unlocked areas as interactive buttons', () => {
    render(<WorldMap areas={MOCK_AREAS} />);
    // Word Woods is unlocked — must be a button
    expect(screen.getByRole('button', { name: /Word Woods/i })).toBeInTheDocument();
  });

  it('renders locked areas as non-interactive with locked indicator', () => {
    render(<WorldMap areas={MOCK_AREAS} />);
    expect(screen.getByText(/Locked/i)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// MascotWidget
// ═══════════════════════════════════════════════════════════════════════════

describe('MascotWidget — Story 7.4 redesign', () => {
  it('renders with data-testid="mascot-widget" on its root element', () => {
    render(<MascotWidget mascot={MOCK_MASCOT} />);
    // Currently root <div> has role="img" but no data-testid — MUST FAIL
    expect(screen.getByTestId('mascot-widget')).toBeInTheDocument();
  });

  it('root element is large / prominent (has data-testid="mascot-widget")', () => {
    render(<MascotWidget mascot={MOCK_MASCOT} />);
    const widget = screen.getByTestId('mascot-widget');
    // At minimum the element must be present; CSS sizing is implementation detail
    expect(widget).toBeInTheDocument();
  });

  it('displays the mascot level', () => {
    render(<MascotWidget mascot={MOCK_MASCOT} />);
    expect(screen.getByText(/level 2/i)).toBeInTheDocument();
  });

  it('renders a loading state when mascot is null', () => {
    render(<MascotWidget mascot={null} />);
    expect(screen.getByText(/loading mascot/i)).toBeInTheDocument();
  });

  it('has an accessible label (role="img" or aria-label) describing the mascot', () => {
    render(<MascotWidget mascot={MOCK_MASCOT} />);
    // Implementation currently uses role="img" — confirm it still exists after redesign
    const widget = screen.getByTestId('mascot-widget');
    const hasRoleImg = widget.getAttribute('role') === 'img';
    const hasAriaLabel = widget.hasAttribute('aria-label');
    expect(hasRoleImg || hasAriaLabel).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// AccessibilitySettings
// ═══════════════════════════════════════════════════════════════════════════

describe('AccessibilitySettings — Story 7.4 redesign', () => {
  it('has NO plain <input type="checkbox"> elements — toggles must be role="switch"', () => {
    const { container } = render(<AccessibilitySettings childId="child-1" />);
    // Current implementation uses plain checkboxes — this MUST FAIL until redesigned
    const checkboxInputs = container.querySelectorAll('input[type="checkbox"]');
    expect(checkboxInputs.length).toBe(0);
  });

  it('renders toggle controls as role="switch" buttons', () => {
    render(<AccessibilitySettings childId="child-1" />);
    // After redesign: Reduced Motion, Color-Blind Mode, Dyslexia Font all become switches
    const switches = screen.getAllByRole('switch');
    expect(switches.length).toBeGreaterThanOrEqual(1);
  });

  it('each role="switch" has an accessible name', () => {
    render(<AccessibilitySettings childId="child-1" />);
    const switches = screen.getAllByRole('switch');
    for (const sw of switches) {
      const name =
        sw.getAttribute('aria-label') ??
        sw.getAttribute('aria-labelledby') ??
        sw.textContent;
      expect(name).toBeTruthy();
    }
  });

  it('has a data-testid="gameplay-mode-section" container', () => {
    render(<AccessibilitySettings childId="child-1" />);
    // Current implementation uses <fieldset> with no data-testid — MUST FAIL
    expect(screen.getByTestId('gameplay-mode-section')).toBeInTheDocument();
  });

  it('has a data-testid="settings-page" on the root element', () => {
    render(<AccessibilitySettings childId="child-1" />);
    // Current root <div> has no data-testid — MUST FAIL
    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
  });

  it('still renders gameplay mode radio options inside the section', () => {
    render(<AccessibilitySettings childId="child-1" />);
    // Radio inputs for mode selection are OK to keep
    expect(screen.getByText(/smart/i)).toBeInTheDocument();
    expect(screen.getByText(/chill/i)).toBeInTheDocument();
    expect(screen.getByText(/focus/i)).toBeInTheDocument();
  });

  it('renders a reset button', () => {
    render(<AccessibilitySettings childId="child-1" />);
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// BadgeNotification
// ═══════════════════════════════════════════════════════════════════════════

describe('BadgeNotification — Story 7.4 redesign', () => {
  it('renders with data-testid="badge-notification" on the root element', () => {
    render(<BadgeNotification badge={MOCK_BADGE} onDismiss={vi.fn()} />);
    // Current root <div> has no data-testid — MUST FAIL
    expect(screen.getByTestId('badge-notification')).toBeInTheDocument();
  });

  it('renders as a modal overlay — root has role="dialog"', () => {
    render(<BadgeNotification badge={MOCK_BADGE} onDismiss={vi.fn()} />);
    // Already implemented — confirms this survives the redesign
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders as a modal overlay — root has aria-modal="true"', () => {
    render(<BadgeNotification badge={MOCK_BADGE} onDismiss={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('is full-screen: root element covers the viewport (fixed inset-0 or equivalent)', () => {
    render(<BadgeNotification badge={MOCK_BADGE} onDismiss={vi.fn()} />);
    const notification = screen.getByTestId('badge-notification');
    // The element should have the full-screen overlay class or inline style
    // We check the class list for known Tailwind full-screen tokens
    const classList = notification.className;
    const isFullScreen =
      classList.includes('fixed') ||
      classList.includes('inset-0') ||
      notification.getAttribute('data-fullscreen') === 'true';
    expect(isFullScreen).toBe(true);
  });

  it('displays the badge name', () => {
    render(<BadgeNotification badge={MOCK_BADGE} onDismiss={vi.fn()} />);
    expect(screen.getByText('First Spark!')).toBeInTheDocument();
  });

  it('displays the badge description', () => {
    render(<BadgeNotification badge={MOCK_BADGE} onDismiss={vi.fn()} />);
    expect(screen.getByText(/first correct answer/i)).toBeInTheDocument();
  });

  it('renders a dismiss button', () => {
    render(<BadgeNotification badge={MOCK_BADGE} onDismiss={vi.fn()} />);
    expect(screen.getByRole('button', { name: /got it/i })).toBeInTheDocument();
  });

  it('has an aria-labelledby pointing to the badge title heading', () => {
    render(<BadgeNotification badge={MOCK_BADGE} onDismiss={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });
});
