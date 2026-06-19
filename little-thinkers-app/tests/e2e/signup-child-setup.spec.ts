import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Story 2.1 — Create parent account and provide COPPA consent
// AC1: link one or more child profiles
// AC2: provide per-child COPPA consent during setup
// AC3: withdraw or re-grant per-child COPPA consent
// ---------------------------------------------------------------------------

const UNIQUE_EMAIL = `test-${Date.now()}@example.com`;
const PASSWORD = 'SecurePass99!';

async function signUpNewParent(page: import('@playwright/test').Page) {
  await page.context().clearCookies();
  await page.goto('/signup');
  await page.getByLabel('Parent Email').fill(UNIQUE_EMAIL);
  await page.getByLabel('Password (min. 8 characters)').fill(PASSWORD);
  await page.getByLabel('Confirm Password').fill(PASSWORD);
  await page.getByLabel(/Terms of Service/i).check();
  await page.getByLabel(/COPPA/i).first().check();
  await page.getByRole('button', { name: 'Create Account' }).click();
}

async function loginExistingParent(page: import('@playwright/test').Page) {
  await page.context().clearCookies();
  await page.goto('/login');
  await page.getByLabel('Email Address').fill('james@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(/\/profile-select/);
}

// ---------------------------------------------------------------------------
// AC1 + AC2: signup leads to child-setup, child can be added with COPPA consent
// ---------------------------------------------------------------------------
test.describe('Signup → Child Setup (Story 2.1 AC1, AC2)', () => {
  test('AC1: after signup, parent is directed to the child-setup page', async ({ page }) => {
    await signUpNewParent(page);
    await page.waitForURL(/\/signup\/child-setup/);
    await expect(page).toHaveURL(/\/signup\/child-setup/);
  });

  test('AC1+AC2: parent can add a child with name, age, and COPPA consent', async ({ page }) => {
    await signUpNewParent(page);
    await page.waitForURL(/\/signup\/child-setup/);

    await page.getByLabel(/child.?s name/i).fill('Alex');
    await page.getByLabel(/age/i).fill('9');
    await page.getByRole('checkbox', { name: /coppa/i }).check();
    await page.getByRole('button', { name: /add child/i }).click();

    await expect(page.getByText(/alex/i)).toBeVisible();
  });

  test('AC1: "Continue" navigates to /profile-select after child is added', async ({ page }) => {
    await signUpNewParent(page);
    await page.waitForURL(/\/signup\/child-setup/);

    await page.getByLabel(/child.?s name/i).fill('Alex');
    await page.getByLabel(/age/i).fill('9');
    await page.getByRole('checkbox', { name: /coppa/i }).check();
    await page.getByRole('button', { name: /add child/i }).click();

    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(/\/profile-select/);
  });

  test('AC2: "Add Child" button is disabled when COPPA is not checked', async ({ page }) => {
    await signUpNewParent(page);
    await page.waitForURL(/\/signup\/child-setup/);

    await page.getByLabel(/child.?s name/i).fill('Alex');
    await page.getByLabel(/age/i).fill('9');

    await expect(page.getByRole('button', { name: /add child/i })).toBeDisabled();
  });

  test('AC1: parent can add multiple children before continuing', async ({ page }) => {
    await signUpNewParent(page);
    await page.waitForURL(/\/signup\/child-setup/);

    // Add first child
    await page.getByLabel(/child.?s name/i).fill('Alex');
    await page.getByLabel(/age/i).fill('9');
    await page.getByRole('checkbox', { name: /coppa/i }).check();
    await page.getByRole('button', { name: /add child/i }).click();

    // Add second child
    await page.getByRole('button', { name: /add another/i }).click();
    await page.getByLabel(/child.?s name/i).fill('Jordan');
    await page.getByLabel(/age/i).fill('12');
    await page.getByRole('checkbox', { name: /coppa/i }).check();
    await page.getByRole('button', { name: /add child/i }).click();

    await expect(page.getByText(/alex/i)).toBeVisible();
    await expect(page.getByText(/jordan/i)).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// AC3: Consent management (grant/withdraw) from /parent/consent
// ---------------------------------------------------------------------------
test.describe('Consent Management (Story 2.1 AC3)', () => {
  test.beforeEach(async ({ page }) => {
    await loginExistingParent(page);
  });

  test('AC3: /parent/consent shows each child with consent status', async ({ page }) => {
    await page.goto('/parent/consent');
    await expect(page.getByText(/aiden/i)).toBeVisible();
    await expect(page.getByText(/maya/i)).toBeVisible();
  });

  test('AC3: parent can withdraw consent for a child', async ({ page }) => {
    await page.goto('/parent/consent');
    await page.getByRole('button', { name: /withdraw.*aiden/i }).click();
    await expect(page.getByText(/not granted/i).first()).toBeVisible();
  });

  test('AC3: parent can grant consent for a child', async ({ page }) => {
    await page.goto('/parent/consent');
    // Maya starts with consent not granted — grant it
    await page.getByRole('button', { name: /grant.*maya/i }).click();
    // After granting, Maya's row should show "granted"
    const mayaRow = page.locator('[data-child-id="child-2"]');
    await expect(mayaRow.getByText(/granted/i)).toBeVisible();
  });
});
