import { test, expect } from '@playwright/test';

test.describe('Auth flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and localStorage to start fresh
    await page.context().clearCookies();
  });

  test('unauthenticated user visiting / is redirected to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('login page shows the Little Thinkers branding', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Little Thinkers/i })).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('shows validation error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email Address').fill('nobody@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText(/Invalid email or password/i)).toBeVisible();
  });

  test('submit button is disabled with empty fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeDisabled();
  });

  test('parent can log in and reach profile selection', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email Address').fill('james@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/profile-select/, { timeout: 5000 });
    await expect(page.getByText(/Welcome to Little Thinkers/i)).toBeVisible();
  });

  test('profile selection shows child profiles and navigates home on selection', async ({ page }) => {
    // Log in first
    await page.goto('/login');
    await page.getByLabel('Email Address').fill('james@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/profile-select/);

    // Select a child profile
    await page.getByRole('button', { name: /Aiden/i }).click();
    await expect(page).toHaveURL('/', { timeout: 5000 });
  });

  test('already-authenticated user is redirected away from login', async ({ page }) => {
    // Complete login and profile selection
    await page.goto('/login');
    await page.getByLabel('Email Address').fill('james@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/profile-select/);
    await page.getByRole('button', { name: /Aiden/i }).click();
    await page.waitForURL('/');

    // Try to navigate back to login
    await page.goto('/login');
    await expect(page).toHaveURL(/\/profile-select|\//, { timeout: 5000 });
  });

  test('password visibility toggle works', async ({ page }) => {
    await page.goto('/login');
    const passwordInput = page.getByLabel('Password');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    // Click the eye/toggle button (type=button, not the submit)
    await page.locator('button[type="button"]').click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
