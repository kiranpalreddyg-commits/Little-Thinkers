import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Story 2.2 — Quick View Dashboard
// AC1: concise weekly progress summary
// AC2: high-level engagement and achievement metrics
// ---------------------------------------------------------------------------

async function loginAndGoToDashboard(page: import('@playwright/test').Page) {
  await page.context().clearCookies();
  await page.goto('/login');
  await page.getByLabel('Email Address').fill('james@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(/\/profile-select/);
  await page.goto('/parent/dashboard');
}

test.describe('Parent Quick View Dashboard (Story 2.2)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndGoToDashboard(page);
  });

  test('AC1: page shows "Quick View" heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /quick view/i })).toBeVisible();
  });

  test('AC1: page shows the current week label', async ({ page }) => {
    await expect(page.getByText(/week of/i)).toBeVisible();
  });

  test('AC1: page shows a summary section for each enrolled child', async ({ page }) => {
    await expect(page.getByText(/aiden/i).first()).toBeVisible();
    await expect(page.getByText(/maya/i).first()).toBeVisible();
  });

  test('AC2: each child card shows streak metric (engagement)', async ({ page }) => {
    const aidensCard = page.locator('[data-child-id="child-1"]');
    await expect(aidensCard).toBeVisible();
    await expect(aidensCard.getByTestId('streak-child-1')).toBeVisible();
  });

  test('AC2: each child card shows sparks metric (engagement)', async ({ page }) => {
    const aidensCard = page.locator('[data-child-id="child-1"]');
    await expect(aidensCard.getByTestId('sparks-child-1')).toBeVisible();
  });

  test('AC2: each child card shows badges-this-week metric (achievement)', async ({ page }) => {
    const aidensCard = page.locator('[data-child-id="child-1"]');
    await expect(aidensCard.getByTestId('badges-child-1')).toBeVisible();
  });

  test('AC2: each child card shows world areas unlocked (achievement)', async ({ page }) => {
    const aidensCard = page.locator('[data-child-id="child-1"]');
    await expect(aidensCard.getByTestId('areas-child-1')).toBeVisible();
  });

  test('unauthenticated user is redirected to /login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/parent/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
