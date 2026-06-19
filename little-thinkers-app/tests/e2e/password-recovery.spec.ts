import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Story 2.5 — Password Recovery + Friend Visibility
// ---------------------------------------------------------------------------

test.describe('Forgot Password (Story 2.5 AC1)', () => {
  test('AC1: forgot password page renders email input', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByTestId('forgot-submit')).toBeVisible();
  });

  test('AC1: submitting email shows confirmation', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.getByLabel(/email/i).fill('james@example.com');
    await page.getByTestId('forgot-submit').click();
    await expect(page.getByTestId('recovery-confirmation')).toBeVisible();
  });

  test('AC1: back-to-login link is present', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByTestId('back-to-login')).toBeVisible();
  });

  test('AC1: back-to-login navigates to /login', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.getByTestId('back-to-login').click();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Reset Password (Story 2.5 AC1)', () => {
  test('AC1: reset password page renders new and confirm inputs', async ({ page }) => {
    await page.goto('/reset-password?token=mock-token');
    await expect(page.getByLabel(/new password/i)).toBeVisible();
    await expect(page.getByLabel(/confirm.*password/i)).toBeVisible();
    await expect(page.getByTestId('reset-submit')).toBeVisible();
  });

  test('AC1: mismatched passwords shows error', async ({ page }) => {
    await page.goto('/reset-password?token=mock-token');
    await page.getByLabel(/new password/i).fill('Password1!');
    await page.getByLabel(/confirm.*password/i).fill('Different!');
    await page.getByTestId('reset-submit').click();
    await expect(page.getByTestId('password-mismatch-error')).toBeVisible();
  });

  test('AC1: matching passwords submits and redirects to /login', async ({ page }) => {
    await page.goto('/reset-password?token=mock-token');
    await page.getByLabel(/new password/i).fill('NewPass123!');
    await page.getByLabel(/confirm.*password/i).fill('NewPass123!');
    await page.getByTestId('reset-submit').click();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Friend Visibility (Story 2.5 AC2)', () => {
  async function loginAndGoToSettings(page: import('@playwright/test').Page) {
    await page.context().clearCookies();
    await page.goto('/login');
    await page.getByLabel('Email Address').fill('james@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/profile-select/);
    await page.goto('/parent/settings');
  }

  test('AC2: friend visibility section is visible', async ({ page }) => {
    await loginAndGoToSettings(page);
    await expect(page.getByTestId('section-friend-visibility')).toBeVisible();
  });

  test('AC2: friend visibility toggle exists per child', async ({ page }) => {
    await loginAndGoToSettings(page);
    await expect(page.getByTestId('friend-visibility-toggle-child-1')).toBeVisible();
  });

  test('AC2: toggling friend visibility updates immediately', async ({ page }) => {
    await loginAndGoToSettings(page);
    const toggle = page.getByTestId('friend-visibility-toggle-child-1');
    const before = await toggle.isChecked();
    await toggle.click();
    expect(await toggle.isChecked()).toBe(!before);
  });
});
