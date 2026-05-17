import { test, expect } from '@playwright/test';

// Shared setup: log in as james and select Aiden
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

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndSelectProfile(page);
  });

  test('shows personalised welcome message with child name', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Aiden/i })).toBeVisible();
  });

  test('shows all 5 game cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Word Pop' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Connection Quest' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Memory Flip' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pattern Builder' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Grid Logic' })).toBeVisible();
  });

  test('shows Puzzle of the Day section with Play Now button', async ({ page }) => {
    await expect(page.getByText(/Today's Puzzle/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Start today's puzzle/i })).toBeVisible();
  });

  test('shows educational content sections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Tell Me Why/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Story Time/i })).toBeVisible();
  });

  test('content filter controls are visible', async ({ page }) => {
    await expect(page.getByRole('combobox', { name: 'Topic:' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Age:' })).toBeVisible();
  });

  test('clicking a game card navigates to the play page', async ({ page }) => {
    await page.getByRole('link', { name: /Play Word Pop/i }).click();
    await expect(page).toHaveURL(/\/play\/word-pop/);
  });

  test('Puzzle of the Day Play Now navigates to the game', async ({ page }) => {
    await page.getByRole('button', { name: /Start today's puzzle/i }).click();
    await expect(page).toHaveURL(/\/play\//);
  });

  test('sign out returns user to login page', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('unauthenticated access to / redirects to login', async ({ page }) => {
    // Clear session
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('applying a topic filter shows the clear filters button (AC4 visual indicator)', async ({ page }) => {
    const topicSelect = page.getByRole('combobox', { name: 'Topic:' });
    await expect(topicSelect).toBeVisible();
    await topicSelect.selectOption('vocabulary');
    await expect(page.getByRole('button', { name: /Clear all filters/i })).toBeVisible();
  });

  test('clearing the topic filter hides the clear button', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Topic:' }).selectOption('vocabulary');
    await page.getByRole('button', { name: /Clear all filters/i }).click();
    await expect(page.getByRole('button', { name: /Clear all filters/i })).not.toBeVisible();
  });
});
