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

// Helper: navigate from home to gameplay page
async function navigateToGameplay(
  page: import('@playwright/test').Page,
  difficulty: string = 'medium',
) {
  await page.goto('/play/word-pop');
  // Select difficulty
  const difficultyRadio = page.getByRole('radio', { name: new RegExp(difficulty, 'i') });
  await difficultyRadio.check();
  // Acknowledge instructions
  await page.getByRole('checkbox', { name: /I've read the instructions/i }).check();
  // Click Start Game
  await page.getByRole('button', { name: /Start Game/i }).click();
  // Wait for gameplay page to load
  await page.waitForURL(/\/play\/word-pop\/play/);
}

test.describe('Gameplay - Pause, Resume, and Session Recovery (Story 1.4)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndSelectProfile(page);
  });

  // AC1: Gameplay page is accessible after login
  test('navigates to gameplay page from play setup', async ({ page }) => {
    await page.goto('/play/word-pop');
    await expect(
      page.getByRole('heading', { level: 1, name: /Word Pop/i }),
    ).toBeVisible();

    // Acknowledge instructions
    await page.getByRole('checkbox', { name: /I've read the instructions/i }).check();
    await expect(page.getByRole('button', { name: /Start Game/i })).toBeEnabled();

    // Click Start Game
    await page.getByRole('button', { name: /Start Game/i }).click();

    // Should navigate to gameplay page
    await page.waitForURL(/\/play\/word-pop\/play/);
    await expect(page).toHaveURL(/\/play\/word-pop\/play/);
  });

  // AC1: Gameplay page is accessible (URL structure check)
  test('gameplay page has correct URL structure with difficulty parameter', async ({
    page,
  }) => {
    await navigateToGameplay(page, 'medium');
    await expect(page).toHaveURL(/\/play\/word-pop\/play\?difficulty=medium/);
  });

  // AC2: A "Pause Game" button is visible during active gameplay
  test('shows Pause Game button during gameplay', async ({ page }) => {
    await navigateToGameplay(page);
    await expect(page.getByRole('button', { name: /Pause Game/i })).toBeVisible();
  });

  // AC3: Clicking Pause shows an overlay with "Game Paused", Resume, and Quit buttons
  test('clicking Pause shows pause overlay with Game Paused heading', async ({
    page,
  }) => {
    await navigateToGameplay(page);
    await page.getByRole('button', { name: /Pause Game/i }).click();

    // Check that the "Game Paused" heading is visible
    await expect(
      page.getByRole('heading', { name: /Game Paused/i }),
    ).toBeVisible();
  });

  test('pause overlay displays Resume and Quit buttons', async ({ page }) => {
    await navigateToGameplay(page);
    await page.getByRole('button', { name: /Pause Game/i }).click();

    // Verify overlay buttons
    await expect(page.getByRole('button', { name: /Resume/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Quit/i })).toBeVisible();
  });

  // AC4: Resume button dismisses the overlay
  test('Resume button dismisses the pause overlay', async ({ page }) => {
    await navigateToGameplay(page);
    await page.getByRole('button', { name: /Pause Game/i }).click();

    // Verify pause overlay is visible
    await expect(
      page.getByRole('heading', { name: /Game Paused/i }),
    ).toBeVisible();

    // Click Resume
    await page.getByRole('button', { name: /Resume/i }).click();

    // Verify pause overlay is no longer visible
    await expect(
      page.getByRole('heading', { name: /Game Paused/i }),
    ).not.toBeVisible();
  });

  // AC5: Quit button navigates back to home
  test('Quit button navigates to home', async ({ page }) => {
    await navigateToGameplay(page);
    await page.getByRole('button', { name: /Pause Game/i }).click();

    // Click Quit
    await page.getByRole('button', { name: /Quit/i }).click();

    // Should navigate to home
    await expect(page).toHaveURL('/');
  });

  // AC6: When returning to /play/word-pop with a saved session, a Resume prompt appears
  test('returning to play setup with saved session shows resume prompt', async ({
    page,
  }) => {
    // Start a game to create a saved session
    await navigateToGameplay(page);

    // Navigate back to the setup page
    await page.goto('/play/word-pop');

    // Should see the resume prompt instead of the setup screen
    await expect(
      page.getByRole('heading', { name: /Resume Game\?/i }),
    ).toBeVisible();
  });

  // AC7: Clicking "Resume Game" on the prompt goes to the gameplay screen
  test('Resume Game button in prompt navigates to gameplay', async ({ page }) => {
    // Start a game to create a saved session
    await navigateToGameplay(page);

    // Navigate back to setup
    await page.goto('/play/word-pop');

    // Click Resume Game
    await page.getByRole('button', { name: /Resume Game/i }).click();

    // Should navigate back to the gameplay page
    await page.waitForURL(/\/play\/word-pop\/play/);
    await expect(page).toHaveURL(/\/play\/word-pop\/play/);
  });

  // AC8: Clicking "New Game" on the prompt clears the session and shows setup screen
  test('New Game button clears session and shows setup screen', async ({ page }) => {
    // Start a game to create a saved session
    await navigateToGameplay(page);

    // Navigate back to setup
    await page.goto('/play/word-pop');

    // Verify resume prompt is shown
    await expect(
      page.getByRole('heading', { name: /Resume Game\?/i }),
    ).toBeVisible();

    // Click New Game
    await page.getByRole('button', { name: /New Game/i }).click();

    // Should show the setup screen (difficulty selector and instructions)
    await expect(
      page.getByRole('heading', { level: 1, name: /Word Pop/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('radiogroup', { name: /Choose Difficulty/i }),
    ).toBeVisible();

    // Resume prompt should no longer be visible
    await expect(
      page.getByRole('heading', { name: /Resume Game\?/i }),
    ).not.toBeVisible();
  });

  // AC9: All interactive elements are keyboard accessible
  test('pause overlay is keyboard accessible', async ({ page }) => {
    await navigateToGameplay(page);
    await page.getByRole('button', { name: /Pause Game/i }).click();

    // Verify pause overlay is visible
    await expect(
      page.getByRole('heading', { name: /Game Paused/i }),
    ).toBeVisible();

    // Tab to the Resume button (may need multiple tabs depending on focus order)
    await page.keyboard.press('Tab');
    // Get the currently focused element
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent);

    // Click the Resume button with Enter (keyboard activation)
    await page.keyboard.press('Enter');

    // Verify pause overlay is dismissed
    await expect(
      page.getByRole('heading', { name: /Game Paused/i }),
    ).not.toBeVisible();
  });

  // AC9: Resume prompt is keyboard accessible
  test('resume prompt is keyboard accessible', async ({ page }) => {
    // Start a game
    await navigateToGameplay(page);

    // Navigate back to setup
    await page.goto('/play/word-pop');

    // Verify resume prompt is shown
    await expect(
      page.getByRole('heading', { name: /Resume Game\?/i }),
    ).toBeVisible();

    // Tab to and activate Resume Game button with keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Should navigate to gameplay page
    await page.waitForURL(/\/play\/word-pop\/play/);
    await expect(page).toHaveURL(/\/play\/word-pop\/play/);
  });

  // AC1: Gameplay page is accessible (requires authentication)
  test('unauthenticated access to gameplay page redirects to login', async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto('/play/word-pop/play?difficulty=medium');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  // AC5: Quit button from pause overlay returns user to home (full flow)
  test('quitting from pause overlay fully clears session', async ({ page }) => {
    // Start a game
    await navigateToGameplay(page);

    // Pause and quit
    await page.getByRole('button', { name: /Pause Game/i }).click();
    await page.getByRole('button', { name: /Quit/i }).click();

    // Should be at home
    await expect(page).toHaveURL('/');

    // Navigate back to word-pop setup
    await page.goto('/play/word-pop');

    // Should show setup screen, not resume prompt
    await expect(
      page.getByRole('heading', { level: 1, name: /Word Pop/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Resume Game\?/i }),
    ).not.toBeVisible();
  });
});
