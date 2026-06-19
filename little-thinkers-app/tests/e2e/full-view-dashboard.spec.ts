import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Story 2.3 — Full View Dashboard
// AC1: detailed skill tracking, world map progress, streak status
// AC2: weekly Brain Reports
// AC3: quarterly pre/post assessments
// AC4: accessibility settings and learning preferences
// ---------------------------------------------------------------------------

async function loginAndGoToFullView(page: import('@playwright/test').Page) {
  await page.context().clearCookies();
  await page.goto('/login');
  await page.getByLabel('Email Address').fill('james@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(/\/profile-select/);
  await page.goto('/parent/full-view?child=child-1');
}

test.describe('Parent Full View Dashboard (Story 2.3)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndGoToFullView(page);
  });

  test('AC1: shows "Full View" heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /full view/i })).toBeVisible();
  });

  test('AC1: skill tracking section is visible', async ({ page }) => {
    await expect(page.getByTestId('section-skills')).toBeVisible();
  });

  test('AC1: shows Word Pop skill entry', async ({ page }) => {
    await expect(page.getByText(/word pop/i).first()).toBeVisible();
  });

  test('AC1: world map section is visible with area names', async ({ page }) => {
    await expect(page.getByTestId('section-world-map')).toBeVisible();
    await expect(page.getByText(/word woods/i)).toBeVisible();
    await expect(page.getByText(/math mountains/i)).toBeVisible();
  });

  test('AC1: streak section shows current streak', async ({ page }) => {
    await expect(page.getByTestId('section-streak')).toBeVisible();
    await expect(page.getByTestId('current-streak')).toBeVisible();
  });

  test('AC2: Brain Report section is visible with narrative text', async ({ page }) => {
    await expect(page.getByTestId('section-brain-report')).toBeVisible();
    const report = page.getByTestId('brain-report-text');
    await expect(report).toBeVisible();
    const text = await report.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('AC3: quarterly assessments section is visible', async ({ page }) => {
    await expect(page.getByTestId('section-assessments')).toBeVisible();
  });

  test('AC3: pre-assessment entry is visible', async ({ page }) => {
    await expect(page.getByTestId('assessment-0')).toBeVisible();
    await expect(page.getByTestId('assessment-0')).toContainText(/pre-assessment/i);
  });

  test('AC4: accessibility settings section is visible', async ({ page }) => {
    await expect(page.getByTestId('section-accessibility')).toBeVisible();
  });

  test('AC4: learning preference (gameplay mode) is visible', async ({ page }) => {
    await expect(page.getByTestId('section-accessibility')).toContainText(/smart|chill|challenge/i);
  });

  test('navigates back to Quick View from Full View', async ({ page }) => {
    await page.getByRole('link', { name: /quick view/i }).click();
    await expect(page).toHaveURL(/\/parent\/dashboard/);
  });

  test('unauthenticated user is redirected to /login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/parent/full-view?child=child-1');
    await expect(page).toHaveURL(/\/login/);
  });
});
