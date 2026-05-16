import { test, expect } from '@playwright/test';

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

async function navigateToActiveGameplay(page: import('@playwright/test').Page) {
  await page.goto('/play/word-pop');
  await page.getByRole('radio', { name: /medium/i }).check();
  await page.getByRole('checkbox', { name: /I've read the instructions/i }).check();
  await page.getByRole('button', { name: /Start Game/i }).click();
  await page.waitForURL(/\/play\/word-pop\/play/);
}

test.describe('App Shell - Bottom Tab Navigation and Header (Story 7.2)', () => {
  // TabBar is mobile-only (md:hidden) — force mobile viewport for all tests in this suite
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await loginAndSelectProfile(page);
  });

  // AC1: Bottom tab bar is visible on the home page after login
  test('bottom tab bar is visible on home page after login', async ({ page }) => {
    await expect(page.getByRole('navigation', { name: /bottom tab/i })).toBeVisible();
  });

  // AC2: All 5 tab labels are present in the bottom tab bar
  test('bottom tab bar contains all 5 tab labels', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: /bottom tab/i });
    await expect(nav.getByRole('link', { name: /^Home$/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /^Play$/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /^Learn$/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /^Progress$/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /^Profile$/i })).toBeVisible();
  });

  // AC3: Active tab has aria-current="page" on the home tab when on home route
  test('active Home tab has aria-current="page" indicator', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: /bottom tab/i });
    const homeTab = nav.getByRole('link', { name: /^Home$/i });
    await expect(homeTab).toHaveAttribute('aria-current', 'page');
  });

  // AC4: Bottom tab bar is NOT visible during active gameplay
  test('bottom tab bar is NOT visible on active gameplay page', async ({ page }) => {
    await navigateToActiveGameplay(page);
    await expect(
      page.getByRole('navigation', { name: /bottom tab/i }),
    ).not.toBeVisible();
  });

  // AC5: Clicking Progress tab navigates to /my-progress
  test('clicking Progress tab navigates to /my-progress', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: /bottom tab/i });
    await nav.getByRole('link', { name: /^Progress$/i }).click();
    await page.waitForURL('/my-progress');
    await expect(page).toHaveURL('/my-progress');
  });

  // AC6: Header shows "Little Thinkers" brand
  test('persistent header shows "Little Thinkers" brand name', async ({ page }) => {
    await expect(
      page.getByRole('banner').getByText(/Little Thinkers/i),
    ).toBeVisible();
  });

  // AC7: Header shows a Spark counter
  test('persistent header shows a Spark counter element', async ({ page }) => {
    // Spark counter should contain a number followed by "Sparks" or a spark icon label
    await expect(
      page.getByRole('banner').getByText(/\d+\s*Sparks?/i),
    ).toBeVisible();
  });

  // AC8: Header shows avatar/profile indicator
  test('persistent header shows an avatar or profile indicator', async ({ page }) => {
    const header = page.getByRole('banner');
    // Avatar may be an img with alt text, a button, or a link with profile-related label
    const avatarLocator = header.locator(
      '[aria-label*="profile" i], [aria-label*="avatar" i], img[alt*="avatar" i], img[alt*="profile" i]',
    );
    await expect(avatarLocator.first()).toBeVisible();
  });

  // AC9: Daily Challenge card is present on the home game grid
  test('Daily Challenge card is present on the home page game grid', async ({ page }) => {
    await expect(page.getByText(/Daily Challenge/i)).toBeVisible();
  });

  // AC10: Daily Challenge card CTA is clickable and navigates to a game flow
  test('clicking Daily Challenge card navigates to a game play flow', async ({ page }) => {
    await page.getByRole('link', { name: /Play Daily Challenge now/i }).click();
    // Should navigate to a game-related route (either a game details page or gameplay)
    await expect(page).toHaveURL(/\/play\//);
  });

  // AC11: Bottom tab bar IS visible on /my-progress (non-gameplay authenticated route)
  test('bottom tab bar is visible on the my-progress page', async ({ page }) => {
    await page.goto('/my-progress');
    await expect(
      page.getByRole('navigation', { name: /bottom tab/i }),
    ).toBeVisible();
  });

  // AC12: Active tab indicator updates when navigating to Progress
  test('Progress tab has aria-current="page" when on /my-progress', async ({ page }) => {
    await page.goto('/my-progress');
    const nav = page.getByRole('navigation', { name: /bottom tab/i });
    const progressTab = nav.getByRole('link', { name: /^Progress$/i });
    await expect(progressTab).toHaveAttribute('aria-current', 'page');
  });
});
