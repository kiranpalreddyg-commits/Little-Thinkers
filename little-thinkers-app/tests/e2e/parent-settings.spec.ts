import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Story 2.4 — Parent Settings: export, certificates, report config, deletion, child settings
// ---------------------------------------------------------------------------

async function loginAndGoToSettings(page: import('@playwright/test').Page) {
  await page.context().clearCookies();
  await page.goto('/login');
  await page.getByLabel('Email Address').fill('james@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(/\/profile-select/);
  await page.goto('/parent/settings');
}

test.describe('Parent Settings (Story 2.4)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndGoToSettings(page);
  });

  // AC1: Export report
  test('AC1: reports section is visible', async ({ page }) => {
    await expect(page.getByTestId('section-reports')).toBeVisible();
  });

  test('AC1: export button is present for each child', async ({ page }) => {
    await expect(page.getByTestId('export-button-child-1')).toBeVisible();
  });

  test('AC1: clicking export triggers a file download', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByTestId('export-button-child-1').click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/aiden|child-1/i);
  });

  // AC2: Certificate
  test('AC2: certificates section is visible with print button', async ({ page }) => {
    await expect(page.getByTestId('section-certificates')).toBeVisible();
    await expect(page.getByTestId('print-certificate-child-1')).toBeVisible();
  });

  // AC3: Report settings
  test('AC3: report cadence selector is present', async ({ page }) => {
    await expect(page.getByTestId('report-cadence-select')).toBeVisible();
  });

  test('AC3: report detail level selector is present', async ({ page }) => {
    await expect(page.getByTestId('report-detail-select')).toBeVisible();
  });

  test('AC3: changing cadence to monthly saves the selection', async ({ page }) => {
    await page.getByTestId('report-cadence-select').selectOption('monthly');
    // Reload and verify persistence
    await page.reload();
    await expect(page.getByTestId('report-cadence-select')).toHaveValue('monthly');
  });

  // AC4: Account deletion
  test('AC4: account deletion section is visible', async ({ page }) => {
    await expect(page.getByTestId('section-account')).toBeVisible();
  });

  test('AC4: deletion request button is present', async ({ page }) => {
    await expect(page.getByTestId('deletion-request-button')).toBeVisible();
  });

  test('AC4: requesting deletion shows pending status with SLA info', async ({ page }) => {
    await page.getByTestId('deletion-request-button').click();
    await expect(page.getByTestId('deletion-status')).toContainText(/pending|30/i);
  });

  // AC5: Child profile settings
  test('AC5: child settings section shows child name in editable input', async ({ page }) => {
    await expect(page.getByTestId('section-child-settings')).toBeVisible();
    await expect(page.getByTestId('child-name-input-child-1')).toHaveValue('Aiden');
  });

  test('AC5: parent can update child name and see confirmation', async ({ page }) => {
    const nameInput = page.getByTestId('child-name-input-child-1');
    await nameInput.fill('Aiden J.');
    await page.getByTestId('child-settings-save-child-1').click();
    await expect(page.getByTestId('child-settings-saved-child-1')).toBeVisible();
  });

  // Auth guard
  test('unauthenticated user is redirected to /login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/parent/settings');
    await expect(page).toHaveURL(/\/login/);
  });
});
