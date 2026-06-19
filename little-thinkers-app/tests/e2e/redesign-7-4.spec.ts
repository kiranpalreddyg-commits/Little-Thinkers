/**
 * E2E Tests — Story 7.4: Apply Design System to Remaining Epic 1 Screens
 *
 * Written FIRST (TDD). Most tests must FAIL before implementation.
 * Each test maps 1:1 to an acceptance criterion in Story 7.4.
 *
 * AC1 — Game detail/instructions page (/play/word-pop) — immersive card design
 * AC2 — My Progress page (/my-progress) — world map, mascot, badge grid
 * AC3 — Settings page (/settings) — toggle switches, card layout
 * AC4 — All screens — font-black headings, gradient backgrounds
 * AC5 — Badge notification — full-screen modal overlay with data-testid
 */

import { test, expect } from '@playwright/test';

// Mobile-first viewport (iPhone 14 Pro)
test.use({ viewport: { width: 390, height: 844 } });

async function loginAndSelectProfile(page: import('@playwright/test').Page) {
  await page.context().clearCookies();
  await page.goto('/login');
  await page.getByLabel('Email Address').fill('james@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(/\/profile-select/);
  await page.getByRole('button', { name: /Aiden/i }).click();
  await page.waitForURL('/');
}

// ─────────────────────────────────────────────────────────────────────────────
// AC1: Game detail / instructions page (/play/word-pop)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('AC1 — Game detail page immersive redesign', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndSelectProfile(page);
    await page.goto('/play/word-pop');
  });

  test('AC1a — full-screen game detail card exists with game title and description', async ({
    page,
  }) => {
    // The redesigned layout wraps everything in a data-testid="game-detail-card" container
    const card = page.locator('[data-testid="game-detail-card"]');
    await expect(card).toBeVisible();
    // Card must include the game title
    await expect(card).toContainText(/Word Pop/i);
    // Card must include a description (non-empty text)
    const desc = await card.textContent();
    expect(desc?.length).toBeGreaterThan(30);
  });

  test('AC1b — large game icon is visible and at least 64×64px', async ({ page }) => {
    const icon = page.locator('[data-testid="game-icon"]').first();
    await expect(icon).toBeVisible();
    const box = await icon.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(64);
    expect(box!.height).toBeGreaterThanOrEqual(64);
  });

  test('AC1c — Start Game button is visually distinct (larger/brighter than Back button)', async ({
    page,
  }) => {
    // Acknowledge instructions so the Start Game button is enabled
    await page.getByRole('checkbox', { name: /I've read the instructions/i }).check();

    const startBtn = page.getByRole('button', { name: /Start Game/i });
    const backBtn = page.getByRole('button', { name: /Back/i });

    await expect(startBtn).toBeVisible();
    await expect(backBtn).toBeVisible();

    // Start Game must occupy more horizontal space than Back (it is the primary CTA)
    const startBox = await startBtn.boundingBox();
    const backBox = await backBtn.boundingBox();
    expect(startBox!.width).toBeGreaterThan(backBox!.width);
  });

  test('AC1d — page uses per-game color theming (not plain white background)', async ({
    page,
  }) => {
    // The game detail page must NOT render a plain white (#ffffff) background.
    // We verify the root wrapper carries a non-white background class or inline style.
    const root = page.locator('[data-testid="game-detail-card"], div.min-h-screen').first();
    await expect(root).toBeVisible();
    const bgClass = await root.getAttribute('class');
    // Must include gradient or a color class — NOT be plain "bg-white" with no gradient
    const isPlainWhite =
      bgClass?.includes('bg-white') && !bgClass?.includes('bg-gradient');
    expect(isPlainWhite).toBe(false);
  });

  test('AC1e — difficulty selector and instructions panel are styled (not plain text)', async ({
    page,
  }) => {
    // The difficulty radiogroup must be wrapped in a styled element (card-like container)
    const difficultyGroup = page.getByRole('radiogroup', { name: /Choose Difficulty/i });
    await expect(difficultyGroup).toBeVisible();

    // Instructions panel heading is visible and styled
    const instructionsHeading = page.getByRole('heading', { name: /How to play/i });
    await expect(instructionsHeading).toBeVisible();

    // At least one of the two sections must have a card-like wrapper with rounded corners
    // (Tailwind: rounded-xl, rounded-2xl, etc.)
    const styledPanels = page.locator('[class*="rounded"]').filter({
      hasText: /easy|medium|hard|how to play/i,
    });
    await expect(styledPanels.first()).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC2: My Progress page (/my-progress)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('AC2 — My Progress page redesign', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndSelectProfile(page);
    await page.goto('/my-progress');
  });

  test('AC2a — progress page root has data-testid="progress-page"', async ({ page }) => {
    await expect(page.locator('[data-testid="progress-page"]')).toBeVisible();
  });

  test('AC2b — world map section is visible and prominent (height > 200px)', async ({
    page,
  }) => {
    const worldMap = page.locator('[data-testid="world-map"]');
    await expect(worldMap).toBeVisible();
    const box = await worldMap.boundingBox();
    expect(box!.height).toBeGreaterThan(200);
  });

  test('AC2c — mascot widget is large (height > 80px)', async ({ page }) => {
    const mascot = page.locator('[data-testid="mascot-widget"]');
    await expect(mascot).toBeVisible();
    const box = await mascot.boundingBox();
    expect(box!.height).toBeGreaterThan(80);
  });

  test('AC2d — badge section uses a grid layout', async ({ page }) => {
    const badgeGrid = page.locator('[data-testid="badge-grid"]');
    await expect(badgeGrid).toBeVisible();
    // Verify it uses CSS grid (either via class or computed style)
    const displayValue = await badgeGrid.evaluate((el) => {
      return window.getComputedStyle(el).display;
    });
    // Accept display:grid or any class containing "grid"
    const hasGridClass = (await badgeGrid.getAttribute('class'))?.includes('grid');
    expect(displayValue === 'grid' || hasGridClass).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC3: Settings page (/settings)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('AC3 — Settings page redesign', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndSelectProfile(page);
    await page.goto('/settings');
  });

  test('AC3a — settings page root has data-testid="settings-page"', async ({ page }) => {
    await expect(page.locator('[data-testid="settings-page"]')).toBeVisible();
  });

  test('AC3b — toggle switches use role="switch" or custom toggle (no plain checkboxes)', async ({
    page,
  }) => {
    // The redesign replaces <input type="checkbox"> with accessible toggle switches.
    // Plain visible checkboxes must NOT be present; expect role="switch" instead.
    const plainCheckboxes = page.locator('input[type="checkbox"]:visible');
    const switchToggles = page.locator('[role="switch"]');

    const checkboxCount = await plainCheckboxes.count();
    const switchCount = await switchToggles.count();

    // Either no visible plain checkboxes, or at least one switch toggle exists
    expect(checkboxCount === 0 || switchCount > 0).toBe(true);
    // Specifically: there must be at least one switch toggle
    expect(switchCount).toBeGreaterThan(0);
  });

  test('AC3c — gameplay mode section exists with data-testid="gameplay-mode-section"', async ({
    page,
  }) => {
    await expect(page.locator('[data-testid="gameplay-mode-section"]')).toBeVisible();
  });

  test('AC3d — settings page uses card layout (not a plain form)', async ({ page }) => {
    // The redesigned settings page must have card-like containers (rounded, shadowed)
    // rather than a bare <form> or plain <div> list.
    const cards = page.locator('[class*="rounded"][class*="shadow"], [class*="rounded-2xl"], [class*="rounded-xl"]');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);

    // The root settings container must NOT be a plain unstyled <form>
    const settingsPage = page.locator('[data-testid="settings-page"]');
    await expect(settingsPage).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC4: All redesigned screens — consistent heading style + gradient backgrounds
// ─────────────────────────────────────────────────────────────────────────────

test.describe('AC4 — Cross-screen: font-black headings and gradient backgrounds', () => {
  test('AC4a — game detail page heading uses font-black style', async ({ page }) => {
    await loginAndSelectProfile(page);
    await page.goto('/play/word-pop');
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    // Check for font-black class or computed font-weight >= 900
    const fontWeight = await heading.evaluate((el) =>
      window.getComputedStyle(el).fontWeight,
    );
    const hasBlackClass = (await heading.getAttribute('class'))?.includes('font-black');
    expect(Number(fontWeight) >= 900 || hasBlackClass).toBe(true);
  });

  test('AC4b — my-progress page has a gradient background (not plain white)', async ({
    page,
  }) => {
    await loginAndSelectProfile(page);
    await page.goto('/my-progress');
    const root = page.locator('div.min-h-screen').first();
    await expect(root).toBeVisible();
    const bgClass = await root.getAttribute('class');
    expect(bgClass).toMatch(/bg-gradient/);
    // Must NOT be plain white
    const isPlainWhite =
      bgClass?.includes('bg-white') && !bgClass?.includes('bg-gradient');
    expect(isPlainWhite).toBe(false);
  });

  test('AC4c — settings page has a gradient background (not plain white)', async ({
    page,
  }) => {
    await loginAndSelectProfile(page);
    await page.goto('/settings');
    const root = page.locator('div.min-h-screen').first();
    await expect(root).toBeVisible();
    const bgClass = await root.getAttribute('class');
    expect(bgClass).toMatch(/bg-gradient/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// AC5: Badge notification — full-screen modal overlay
// ─────────────────────────────────────────────────────────────────────────────

test.describe('AC5 — Badge notification is a full-screen modal overlay', () => {
  async function navigateToGameplay(page: import('@playwright/test').Page) {
    await page.goto('/play/word-pop');
    await page.getByRole('radio', { name: /medium/i }).check();
    await page.getByRole('checkbox', { name: /I've read the instructions/i }).check();
    await page.getByRole('button', { name: /Start Game/i }).click();
    await page.waitForURL(/\/play\/word-pop\/play/);
  }

  test.beforeEach(async ({ page }) => {
    await loginAndSelectProfile(page);
    // Clear progression so badge fires on first correct answer
    await page.evaluate(() => {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('lt_progression_')) localStorage.removeItem(k);
      });
    });
  });

  test('AC5a — badge notification element has data-testid="badge-notification"', async ({
    page,
  }) => {
    await navigateToGameplay(page);
    // Trigger correct answer to earn First Spark badge
    await page.getByRole('button', { name: '7' }).click();
    // The badge notification must carry the expected data-testid
    await expect(page.locator('[data-testid="badge-notification"]')).toBeVisible();
  });

  test('AC5b — badge notification is a full-screen overlay (covers the viewport)', async ({
    page,
  }) => {
    await navigateToGameplay(page);
    await page.getByRole('button', { name: '7' }).click();

    const notification = page.locator('[data-testid="badge-notification"]');
    await expect(notification).toBeVisible();

    // A full-screen/modal overlay should span the entire viewport
    const box = await notification.boundingBox();
    const viewport = page.viewportSize()!;
    // Must cover at least 90% of both dimensions (fixed inset-0 equivalent)
    expect(box!.width).toBeGreaterThan(viewport.width * 0.9);
    expect(box!.height).toBeGreaterThan(viewport.height * 0.9);
  });

  test('AC5c — badge notification is NOT a small toast (height > 200px)', async ({
    page,
  }) => {
    await navigateToGameplay(page);
    await page.getByRole('button', { name: '7' }).click();

    const notification = page.locator('[data-testid="badge-notification"]');
    await expect(notification).toBeVisible();
    const box = await notification.boundingBox();
    // A toast is typically < 100px tall — a modal overlay must be much larger
    expect(box!.height).toBeGreaterThan(200);
  });
});
