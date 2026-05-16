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

async function navigateToGameplay(
  page: import('@playwright/test').Page,
  difficulty: string = 'medium',
) {
  await page.goto('/play/word-pop');
  await page.getByRole('radio', { name: new RegExp(difficulty, 'i') }).check();
  await page.getByRole('checkbox', { name: /I've read the instructions/i }).check();
  await page.getByRole('button', { name: /Start Game/i }).click();
  await page.waitForURL(/\/play\/word-pop\/play/);
}

test.describe('Rewards - Thought Sparks and Brain Jar (Story 1.5)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test so sparks don't accumulate across tests
    await loginAndSelectProfile(page);
    await page.evaluate(() => {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('lt_rewards_') || k === 'little-thinkers-mock-db') {
          localStorage.removeItem(k);
        }
      });
    });
  });

  // AC5: Brain Jar is visible on the gameplay page on load
  test('Brain Jar widget is visible when gameplay page loads', async ({ page }) => {
    await navigateToGameplay(page);
    await expect(page.getByText('Brain Jar')).toBeVisible();
    await expect(page.getByRole('progressbar')).toBeVisible();
  });

  // AC5: Brain Jar starts at 0 sparks
  test('Brain Jar shows 0 Sparks on first visit', async ({ page }) => {
    await navigateToGameplay(page);
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    await expect(page.getByText(/0 Sparks/i)).toBeVisible();
  });

  // AC1: Correct answer shows positive feedback
  test('correct answer shows positive feedback message', async ({ page }) => {
    await navigateToGameplay(page);
    // The correct answer button is "7" (3 + 4 = 7)
    await page.getByRole('button', { name: '7' }).click();
    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByText(/Great thinking/i)).toBeVisible();
  });

  // AC3: Correct answer increases Brain Jar fill
  test('correct answer increases Brain Jar fill level', async ({ page }) => {
    await navigateToGameplay(page);
    await page.getByRole('button', { name: '7' }).click();
    // +1 spark at medium difficulty → 1/20 capacity = 5% fill (aria-valuenow is fill percent 0–100)
    await expect(page.getByText(/1 Sparks/i)).toBeVisible();
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '5');
  });

  // AC2: Incorrect answer shows gentle feedback, no spark deducted
  test('incorrect answer shows gentle feedback without penalising', async ({ page }) => {
    await navigateToGameplay(page);
    await page.getByRole('button', { name: '6' }).click();
    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByText(/Nice try/i)).toBeVisible();
    // Spark count stays at 0
    await expect(page.getByText(/0 Sparks/i)).toBeVisible();
  });

  // AC1: Feedback auto-dismisses (verify it disappears)
  test('feedback dismisses automatically after 2 seconds', async ({ page }) => {
    await navigateToGameplay(page);
    await page.getByRole('button', { name: '7' }).click();
    await expect(page.getByRole('status')).toBeVisible();
    await page.waitForTimeout(2500);
    await expect(page.getByRole('status')).not.toBeVisible();
  });

  // AC7: Brain Jar persists across page reload
  test('Brain Jar total persists after page reload', async ({ page }) => {
    await navigateToGameplay(page);
    await page.getByRole('button', { name: '7' }).click();
    await expect(page.getByText(/1 Sparks/i)).toBeVisible();
    // Reload the page
    await page.reload();
    await page.waitForURL(/\/play\/word-pop\/play/);
    // Spark count should still show 1
    await expect(page.getByText(/1 Sparks/i)).toBeVisible();
  });

  // AC8: Keyboard navigation — answer buttons are reachable and Brain Jar doesn't disrupt focus
  test('answer buttons are reachable and activatable by keyboard', async ({ page }) => {
    await navigateToGameplay(page);
    // Tab to the first answer button and press Enter
    const firstButton = page.getByRole('button', { name: '6' });
    await firstButton.focus();
    await expect(firstButton).toBeFocused();
    // Tab to the correct answer button
    await page.keyboard.press('Tab');
    const secondButton = page.getByRole('button', { name: '7' });
    await expect(secondButton).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByText(/Great thinking/i)).toBeVisible();
  });
});
