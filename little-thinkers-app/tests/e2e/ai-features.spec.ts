import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Auth helpers — mirrors the pattern used in gameplay.spec.ts and
// progression.spec.ts: clear cookies, sign in via the UI, then select Aiden.
// ---------------------------------------------------------------------------
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

// Navigate through the play-setup flow so we arrive at the gameplay URL.
// Uses 'easy' difficulty so the story's URL matches /play/word-pop/play?difficulty=easy.
async function navigateToGameplay(
  page: import('@playwright/test').Page,
  difficulty: string = 'easy',
) {
  await page.goto('/play/word-pop');
  await page.getByRole('radio', { name: new RegExp(difficulty, 'i') }).check();
  await page.getByRole('checkbox', { name: /I've read the instructions/i }).check();
  await page.getByRole('button', { name: /Start Game/i }).click();
  await page.waitForURL(/\/play\/word-pop\/play/);
}

// ---------------------------------------------------------------------------
// Route mocks — installed per-test where needed so spy/stub calls work without
// a real AI back-end.  The hint route returns a static hint string; the
// difficulty route echoes an "up" or "down" action.
// ---------------------------------------------------------------------------
async function mockAiRoutes(page: import('@playwright/test').Page) {
  await page.route('**/api/ai/hint', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ hint: 'Think about what you already know!' }),
    }),
  );
  await page.route('**/api/ai/difficulty', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        action: 'up',
        reason: 'Three consecutive correct answers.',
      }),
    }),
  );
}

// ---------------------------------------------------------------------------
// Story 8.2 — AI Features: Adaptive Difficulty and Hints
// ---------------------------------------------------------------------------
test.describe('AI Features — Adaptive Difficulty and Hints (Story 8.2)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndSelectProfile(page);
    await mockAiRoutes(page);
  });

  // -------------------------------------------------------------------------
  // AC1 — difficulty-display element exists and shows "Level" text
  // -------------------------------------------------------------------------
  test('AC1: difficulty-display is visible and shows "Level" text', async ({ page }) => {
    await navigateToGameplay(page);

    const difficultyDisplay = page.getByTestId('difficulty-display');
    await expect(difficultyDisplay).toBeVisible();
    await expect(difficultyDisplay).toContainText(/Level/i);
  });

  // -------------------------------------------------------------------------
  // AC2 — Three consecutive correct answers raise the difficulty level
  // -------------------------------------------------------------------------
  test('AC2: difficulty increases to Level 3 after 3 consecutive correct answers', async ({
    page,
  }) => {
    await navigateToGameplay(page);

    // The correct answer is "7" (3 + 4 = 7) — identical to the existing suite
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: '7' }).click();
      // Brief wait so each answer registers before the next click
      await page.waitForTimeout(300);
    }

    // Default level is 2; three correct in a row should push it to 3
    await expect(page.getByTestId('difficulty-display')).toContainText('Level 3');
  });

  // -------------------------------------------------------------------------
  // AC3 — Three consecutive incorrect answers lower the difficulty level
  // -------------------------------------------------------------------------
  test('AC3: difficulty decreases to Level 1 after 3 consecutive incorrect answers', async ({
    page,
  }) => {
    // Mock the difficulty route to return "down" for this specific test
    await page.unroute('**/api/ai/difficulty');
    await page.route('**/api/ai/difficulty', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          action: 'down',
          reason: 'Three consecutive incorrect answers.',
        }),
      }),
    );

    await navigateToGameplay(page);

    // Incorrect answers are any button that is NOT "7" — "6" is always wrong
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: '6' }).click();
      await page.waitForTimeout(300);
    }

    // Default level is 2; three wrong in a row should drop it to 1
    await expect(page.getByTestId('difficulty-display')).toContainText('Level 1');
  });

  // -------------------------------------------------------------------------
  // AC4 — Hint button is NOT visible immediately on page load
  // -------------------------------------------------------------------------
  test('AC4: hint button is not visible immediately after gameplay page loads', async ({
    page,
  }) => {
    await navigateToGameplay(page);

    // The element should either be absent from the DOM or explicitly hidden —
    // either way Playwright's not.toBeVisible() covers both cases.
    await expect(page.getByTestId('hint-button')).not.toBeVisible();
  });

  // -------------------------------------------------------------------------
  // AC5 — Hint button appears after 10 seconds of inactivity
  // -------------------------------------------------------------------------
  test('AC5: hint button becomes visible after 10 seconds of no answer', async ({
    page,
  }) => {
    // Install a synthetic clock BEFORE navigation so the timer the component
    // starts (setTimeout / setInterval) is under our control.
    await page.clock.install();

    await navigateToGameplay(page);

    // Confirm it is hidden before the threshold
    await expect(page.getByTestId('hint-button')).not.toBeVisible();

    // Advance browser time by 10 seconds — triggers the hint appearance
    await page.clock.fastForward(10_000);

    await expect(page.getByTestId('hint-button')).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // AC6 — Clicking the hint button reveals non-empty hint text
  // -------------------------------------------------------------------------
  test('AC6: clicking hint button shows non-empty hint text', async ({ page }) => {
    await page.clock.install();
    await navigateToGameplay(page);
    await page.clock.fastForward(10_000);

    await expect(page.getByTestId('hint-button')).toBeVisible();
    await page.getByTestId('hint-button').click();

    const hintText = page.getByTestId('hint-text');
    await expect(hintText).toBeVisible();

    // Hint text must be non-empty (the API mock returns a known string)
    const text = await hintText.textContent();
    expect(text).toBeTruthy();
    expect(text!.trim().length).toBeGreaterThan(0);
  });

  // -------------------------------------------------------------------------
  // AC7 — Maximum 2 hints per question; hint button disappears after the 2nd
  // -------------------------------------------------------------------------
  test('AC7: hint button is no longer available after 2 hints have been used', async ({
    page,
  }) => {
    await page.clock.install();
    await navigateToGameplay(page);
    await page.clock.fastForward(10_000);

    // First hint
    await page.getByTestId('hint-button').click();
    await expect(page.getByTestId('hint-text')).toBeVisible();

    // Advance clock again so the button re-appears for the second hint (the
    // implementation may re-hide it after each click and require another tick)
    await page.clock.fastForward(10_000);

    // Second hint
    await expect(page.getByTestId('hint-button')).toBeVisible();
    await page.getByTestId('hint-button').click();

    // After the second hint the button must be gone or disabled
    const hintButton = page.getByTestId('hint-button');
    const isStillVisible = await hintButton.isVisible().catch(() => false);
    if (isStillVisible) {
      // Acceptable alternative: button is disabled rather than removed
      await expect(hintButton).toBeDisabled();
    }
    // else: element is not visible / not in DOM — AC satisfied
  });

  // -------------------------------------------------------------------------
  // AC8 — Timer resets after an answer so hint does not re-appear too soon
  // -------------------------------------------------------------------------
  test('AC8: hint button stays hidden when timer resets after an answer', async ({
    page,
  }) => {
    await page.clock.install();
    await navigateToGameplay(page);

    // Advance 8 s — hint not yet shown (threshold is 10 s)
    await page.clock.fastForward(8_000);
    await expect(page.getByTestId('hint-button')).not.toBeVisible();

    // Player answers — this should reset the inactivity timer
    await page.getByRole('button', { name: '7' }).click();
    await page.waitForTimeout(200);

    // Advance another 8 s — total wall-clock would be 16 s, but timer reset
    // after the answer so we are only 8 s into the new window → still hidden
    await page.clock.fastForward(8_000);

    await expect(page.getByTestId('hint-button')).not.toBeVisible();
  });

  // -------------------------------------------------------------------------
  // AC6 (fallback) — When the AI API is unavailable, a static hint is shown
  // -------------------------------------------------------------------------
  test('AC6-fallback: static hint is shown when AI API returns an error', async ({
    page,
  }) => {
    // Override the hint route to simulate a network/server failure
    await page.unroute('**/api/ai/hint');
    await page.route('**/api/ai/hint', (route) =>
      route.fulfill({ status: 500, body: 'Internal Server Error' }),
    );

    await page.clock.install();
    await navigateToGameplay(page);
    await page.clock.fastForward(10_000);

    await page.getByTestId('hint-button').click();

    // The implementation must fall back to a static hint — any non-empty text
    const hintText = page.getByTestId('hint-text');
    await expect(hintText).toBeVisible();
    const text = await hintText.textContent();
    expect(text).toBeTruthy();
    expect(text!.trim().length).toBeGreaterThan(0);
  });
});
