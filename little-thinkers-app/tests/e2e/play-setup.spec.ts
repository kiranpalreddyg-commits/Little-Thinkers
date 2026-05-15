import { test, expect } from '@playwright/test';

// Shared setup: log in as james and select Aiden, then navigate to the play setup screen.
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

test.describe('Play setup page (game details)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndSelectProfile(page);
    await page.goto('/play/word-pop');
  });

  test('shows the game name as the page heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: /Word Pop/i }),
    ).toBeVisible();
  });

  test('shows all available difficulty options', async ({ page }) => {
    await expect(
      page.getByRole('radiogroup', { name: /Choose Difficulty/i }),
    ).toBeVisible();
    await expect(page.getByRole('radio', { name: /Easy/i })).toBeVisible();
    await expect(page.getByRole('radio', { name: /Medium/i })).toBeVisible();
    await expect(page.getByRole('radio', { name: /Hard/i })).toBeVisible();
  });

  test('shows the instructions panel', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 2, name: /How to play/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('checkbox', { name: /I've read the instructions/i }),
    ).toBeVisible();
  });

  test('Start Game button is disabled before instructions are acknowledged', async ({
    page,
  }) => {
    await expect(
      page.getByRole('button', { name: /Start Game/i }),
    ).toBeDisabled();
  });

  test('acknowledging instructions enables the Start Game button', async ({
    page,
  }) => {
    await page
      .getByRole('checkbox', { name: /I've read the instructions/i })
      .check();
    await expect(
      page.getByRole('button', { name: /Start Game/i }),
    ).toBeEnabled();
  });

  test('selecting a different difficulty updates the checked radio', async ({
    page,
  }) => {
    const hard = page.getByRole('radio', { name: /Hard/i });
    await hard.check();
    await expect(hard).toBeChecked();
  });

  test('clicking Start Game navigates away from the setup screen', async ({
    page,
  }) => {
    await page
      .getByRole('checkbox', { name: /I've read the instructions/i })
      .check();
    await page.getByRole('button', { name: /Start Game/i }).click();
    // Navigates somewhere other than the setup page itself; difficulty is preserved
    // in the URL (either as a query param on a "coming soon" page or on the game route).
    await expect(page).not.toHaveURL(/\/play\/word-pop$/);
    await expect(page).toHaveURL(/difficulty=/);
  });

  test('clicking Back returns to the home screen', async ({ page }) => {
    await page.getByRole('button', { name: /Back/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('unauthenticated access to /play/word-pop redirects to login', async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto('/play/word-pop');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});
