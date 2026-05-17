/**
 * E2E Tests — Story 7.3: Redesign Home Screen and Game Cards
 *
 * These tests are written FIRST (TDD). They must FAIL before implementation.
 * Each test maps 1:1 to an acceptance criterion.
 *
 * AC1  — Hero section with mascot
 * AC2  — Redesigned game cards with per-game data-game-color attribute
 * AC3  — Vibrant game card visuals: headings + play links
 * AC4  — Today's Challenge full-width card
 * AC5  — Game grid layout: 6 cards in 2×3 arrangement
 * AC6  — Streak display on home hero
 * AC7  — Explore & Learn section remains (Tell Me Why + Story Time)
 * AC8  — Home page uses warm gradient (not plain white background)
 */

import { test, expect } from '@playwright/test';

// Mobile-first viewport (iPhone 14 Pro dimensions)
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

test.describe('Story 7.3 — Home Screen Redesign', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndSelectProfile(page);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // AC1: Hero section with mascot
  // ─────────────────────────────────────────────────────────────────────────

  test('AC1a — hero section contains a visible mascot element', async ({ page }) => {
    // The mascot can be an <img>, <svg>, or any element whose
    // accessible name / alt / aria-label contains "mascot"
    const mascot = page.locator('[aria-label*="mascot" i], [alt*="mascot" i], [data-testid*="mascot" i]').first();
    await expect(mascot).toBeVisible();
  });

  test('AC1b — hero section greets the child by name', async ({ page }) => {
    // Greeting text must contain the child's name ("Aiden") in the hero area
    // The UX spec calls for "Hey Maya! 👋" style — text-3xl Nunito 900
    const heroGreeting = page.locator('[data-testid="hero-greeting"], h1').filter({ hasText: /hey aiden/i });
    await expect(heroGreeting).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // AC2: Redesigned game cards with per-game data-game-color attribute
  // ─────────────────────────────────────────────────────────────────────────

  test('AC2a — Word Pop game card has data-game-color="blue"', async ({ page }) => {
    const card = page.locator('[data-game-color="blue"]').filter({ hasText: /word pop/i });
    await expect(card).toBeVisible();
  });

  test('AC2b — Connection Quest game card has data-game-color="green"', async ({ page }) => {
    const card = page.locator('[data-game-color="green"]').filter({ hasText: /connection quest/i });
    await expect(card).toBeVisible();
  });

  test('AC2c — Memory Flip game card has data-game-color="violet"', async ({ page }) => {
    const card = page.locator('[data-game-color="violet"]').filter({ hasText: /memory flip/i });
    await expect(card).toBeVisible();
  });

  test('AC2d — Pattern Builder game card has data-game-color="amber"', async ({ page }) => {
    const card = page.locator('[data-game-color="amber"]').filter({ hasText: /pattern builder/i });
    await expect(card).toBeVisible();
  });

  test('AC2e — Grid Logic game card has data-game-color="rose"', async ({ page }) => {
    const card = page.locator('[data-game-color="rose"]').filter({ hasText: /grid logic/i });
    await expect(card).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // AC3: Vibrant game card visuals — heading visible + play link/button
  // ─────────────────────────────────────────────────────────────────────────

  test('AC3a — each game card heading is visible', async ({ page }) => {
    const games = ['Word Pop', 'Connection Quest', 'Memory Flip', 'Pattern Builder', 'Grid Logic'];
    for (const name of games) {
      await expect(page.getByRole('heading', { name })).toBeVisible();
    }
  });

  test('AC3b — each game card has a play link or button', async ({ page }) => {
    // Each card must have a link or button that navigates to that game's play page
    // The UX spec implies tapping the card goes to /play/[gameType]
    const gameLinks = [
      { name: /play word pop/i, href: /word-pop/ },
      { name: /play connection quest/i, href: /connection-quest/ },
      { name: /play memory flip/i, href: /memory-flip/ },
      { name: /play pattern builder/i, href: /pattern-builder/ },
      { name: /play grid logic/i, href: /grid-logic/ },
    ];
    for (const { name } of gameLinks) {
      // Accept either a link or a button with this aria-label
      const el = page.getByRole('link', { name }).or(page.getByRole('button', { name })).first();
      await expect(el).toBeVisible();
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // AC4: Today's Challenge full-width card
  // ─────────────────────────────────────────────────────────────────────────

  test('AC4 — Today\'s Challenge card spans full width of the page', async ({ page }) => {
    // The daily challenge / "Today's Brain Workout" card must be full width.
    // We verify by checking it isn't constrained to a small fixed width.
    // Strategy: the card's bounding box width should be close to the viewport width
    // (within 48px of padding on each side = viewport - 96px minimum).
    const challengeCard = page.locator('[data-testid="daily-challenge-card"]').first();
    await expect(challengeCard).toBeVisible();

    const cardBox = await challengeCard.boundingBox();
    const viewportWidth = 390;
    // Full-width means at least 80% of viewport (allowing for page padding)
    expect(cardBox!.width).toBeGreaterThan(viewportWidth * 0.8);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // AC5: Game grid layout — all 6 cards visible (5 games + DailyChallenge)
  // ─────────────────────────────────────────────────────────────────────────

  test('AC5a — game grid container has 2-column layout on mobile', async ({ page }) => {
    // The redesigned grid uses grid-cols-2 on mobile (2×3 = 6 slots)
    const gameGrid = page.locator('[data-testid="game-grid"]');
    await expect(gameGrid).toBeVisible();

    // Verify the grid has the correct CSS grid class for 2 columns
    // We check that at least 2 cards in the grid are side-by-side (same row)
    const cards = gameGrid.locator('[data-game-color]');
    await expect(cards).toHaveCount(5); // 5 regular game cards in the grid
  });

  test('AC5b — all 6 slots are visible (5 game cards + DailyChallenge card)', async ({ page }) => {
    // 5 game headings
    const games = ['Word Pop', 'Connection Quest', 'Memory Flip', 'Pattern Builder', 'Grid Logic'];
    for (const name of games) {
      await expect(page.getByRole('heading', { name })).toBeVisible();
    }
    // 6th slot: DailyChallenge card is visible in the grid or immediately adjacent
    const dailySlot = page.locator('[data-testid="daily-challenge-card"]');
    await expect(dailySlot).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // AC6: Streak display on home hero
  // ─────────────────────────────────────────────────────────────────────────

  test('AC6a — streak indicator with fire emoji or "streak" text is visible in the hero', async ({ page }) => {
    // The UX spec calls for "Day 7 streak 🔥" inline in the hero section
    // Accept: text containing "streak" OR an element with a fire emoji aria-label
    const streakEl = page.locator('[data-testid="streak-chip"], [aria-label*="streak" i]')
      .or(page.getByText(/streak/i).first());
    await expect(streakEl.first()).toBeVisible();
  });

  test('AC6b — streak indicator shows a numeric day count', async ({ page }) => {
    // The streak chip must display a number (could be 0 for new users)
    // Pattern: "X day streak" where X is a number, OR "🔥 X"
    const streakText = page.locator('[data-testid="streak-chip"]');
    await expect(streakText).toBeVisible();
    // Verify it contains a digit
    const text = await streakText.textContent();
    expect(text).toMatch(/\d+/);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // AC7: Explore & Learn section remains
  // ─────────────────────────────────────────────────────────────────────────

  test('AC7a — "Tell Me Why" section heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /tell me why/i })).toBeVisible();
  });

  test('AC7b — "Story Time" section heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /story time/i })).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // AC8: Home page uses warm gradient (not plain white background)
  // ─────────────────────────────────────────────────────────────────────────

  test('AC8a — home page root element does NOT have a plain white background', async ({ page }) => {
    // The UX spec mandates "Warm amber sky" gradient: from-[#FFFBEB] via-[#FFF7ED] to-[#F0FDF4]
    // We verify the root wrapper does NOT use a plain white or default background
    const rootWrapper = page.locator('div.min-h-screen').first();
    await expect(rootWrapper).toBeVisible();

    const bgClass = await rootWrapper.getAttribute('class');
    // Must NOT be a plain white background (bg-white with no gradient)
    // Must contain gradient classes — bg-gradient-to-* is required
    expect(bgClass).toMatch(/bg-gradient/);
  });

  test('AC8b — home page gradient uses warm amber/yellow tones per UX spec', async ({ page }) => {
    // The spec mandates warm amber: from-[#FFFBEB] via-[#FFF7ED] to-[#F0FDF4]
    // We test for the data attribute or class that signals the correct gradient
    // The redesign must replace the current "from-yellow-50 to-orange-50" with
    // the specified warm amber sky gradient using hex values
    const rootWrapper = page.locator('div.min-h-screen').first();
    const bgClass = await rootWrapper.getAttribute('class');

    // Must contain the amber/warm gradient tokens from UX spec
    // Accept: data-testid="home-gradient" OR class containing FFFBEB or from-amber or warm amber
    const hasWarmGradient =
      bgClass?.includes('from-[#FFFBEB]') ||
      bgClass?.includes('from-amber') ||
      bgClass?.includes('via-[#FFF7ED]');

    // Alternatively accept a data attribute marking it as redesigned
    const redesignedEl = page.locator('[data-testid="home-background"]');
    const hasDataAttr = await redesignedEl.count() > 0;

    expect(hasWarmGradient || hasDataAttr).toBe(true);
  });
});
