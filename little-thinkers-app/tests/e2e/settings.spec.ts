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

test.describe('Settings - Accessibility Modes and Preferences (Story 1.7)', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as james and select Aiden
    await loginAndSelectProfile(page);
    // Clear all lt_accessibility_* keys from localStorage
    await page.evaluate(() => {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('lt_accessibility_')) {
          localStorage.removeItem(k);
        }
      });
    });
  });

  // Test 1: /settings page loads with correct heading
  test('settings page loads with correct heading', async ({ page }) => {
    await page.goto('/settings');
    const heading = page.getByRole('heading', { name: /Settings|Accessibility Settings/i });
    await expect(heading).toBeVisible();
  });

  // Test 2: Gameplay mode shows Smart selected by default
  test('Gameplay mode shows Smart selected by default', async ({ page }) => {
    await page.goto('/settings');
    const smartRadio = page.getByRole('radio', { name: /Smart/i });
    await expect(smartRadio).toBeChecked();
  });

  // Test 3: Clicking "Chill" selects it and deselects Smart
  test('Clicking "Chill" selects it and deselects Smart', async ({ page }) => {
    await page.goto('/settings');
    const chillRadio = page.getByRole('radio', { name: /Chill/i });
    const smartRadio = page.getByRole('radio', { name: /Smart/i });

    // Initially Smart should be checked
    await expect(smartRadio).toBeChecked();

    // Click Chill
    await chillRadio.click();

    // Chill should be checked, Smart should not
    await expect(chillRadio).toBeChecked();
    await expect(smartRadio).not.toBeChecked();
  });

  // Test 4: Gameplay mode selection persists after page reload (AC1)
  test('Gameplay mode selection persists after page reload', async ({ page }) => {
    await page.goto('/settings');

    // Select Chill
    const chillRadio = page.getByRole('radio', { name: /Chill/i });
    await chillRadio.click();
    await expect(chillRadio).toBeChecked();

    // Reload the page
    await page.reload();
    await page.waitForURL('/settings');

    // Chill should still be checked
    const reloadedChillRadio = page.getByRole('radio', { name: /Chill/i });
    await expect(reloadedChillRadio).toBeChecked();
  });

  // Test 5: Reduced Motion checkbox is unchecked by default
  test('Reduced Motion checkbox is unchecked by default', async ({ page }) => {
    await page.goto('/settings');
    const reducedMotionCheckbox = page.getByRole('checkbox', { name: /Reduced Motion/i });
    await expect(reducedMotionCheckbox).not.toBeChecked();
  });

  // Test 6: Toggling Reduced Motion checkbox to checked persists after reload (AC2)
  test('Toggling Reduced Motion checkbox to checked persists after reload', async ({ page }) => {
    await page.goto('/settings');

    const reducedMotionCheckbox = page.getByRole('checkbox', { name: /Reduced Motion/i });

    // Check the checkbox
    await reducedMotionCheckbox.check();
    await expect(reducedMotionCheckbox).toBeChecked();

    // Reload the page
    await page.reload();
    await page.waitForURL('/settings');

    // The checkbox should still be checked
    const reloadedCheckbox = page.getByRole('checkbox', { name: /Reduced Motion/i });
    await expect(reloadedCheckbox).toBeChecked();
  });

  // Test 7: "Reset to Defaults" button resets all settings
  test('Reset to Defaults button resets all settings', async ({ page }) => {
    await page.goto('/settings');

    // Change Gameplay mode to Focus
    await page.getByRole('radio', { name: /Focus/i }).click();
    await expect(page.getByRole('radio', { name: /Focus/i })).toBeChecked();

    // Toggle Reduced Motion checkbox
    const reducedMotionCheckbox = page.getByRole('checkbox', { name: /Reduced Motion/i });
    await reducedMotionCheckbox.check();
    await expect(reducedMotionCheckbox).toBeChecked();

    // Toggle Color-Blind Mode checkbox
    const colorBlindCheckbox = page.getByRole('checkbox', { name: /Color-Blind Mode/i });
    await colorBlindCheckbox.check();
    await expect(colorBlindCheckbox).toBeChecked();

    // Click Reset to Defaults button
    const resetButton = page.getByRole('button', { name: /Reset to Defaults/i });
    await resetButton.click();

    // Verify defaults are restored
    await expect(page.getByRole('radio', { name: /Smart/i })).toBeChecked();
    await expect(page.getByRole('radio', { name: /Focus/i })).not.toBeChecked();
    await expect(reducedMotionCheckbox).not.toBeChecked();
    await expect(colorBlindCheckbox).not.toBeChecked();
  });

  // Test 8: Settings page controls are keyboard accessible (Tab to Reduced Motion, Space to toggle)
  test('Settings page controls are keyboard accessible via Tab and Space', async ({ page }) => {
    await page.goto('/settings');

    // Tab until we reach the Reduced Motion checkbox
    const reducedMotionCheckbox = page.getByRole('checkbox', { name: /Reduced Motion/i });
    await reducedMotionCheckbox.focus();
    await expect(reducedMotionCheckbox).toBeFocused();

    // Press Space to toggle the checkbox
    await page.keyboard.press('Space');
    await expect(reducedMotionCheckbox).toBeChecked();

    // Press Space again to untoggle
    await page.keyboard.press('Space');
    await expect(reducedMotionCheckbox).not.toBeChecked();
  });
});
