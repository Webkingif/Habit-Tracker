import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    // Set a session manually
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'test@example.com' }));
    });
    
    await page.goto('/');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('newuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByText('newuser@example.com')).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({ page }) => {
    // Create two users with habits
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-users', JSON.stringify([
        { id: 'u1', email: 'u1@ex.com', password: 'p1', createdAt: '' },
        { id: 'u2', email: 'u2@ex.com', password: 'p2', createdAt: '' }
      ]));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        { id: 'h1', userId: 'u1', name: 'Habit 1', description: '', frequency: 'daily', createdAt: '', completions: [] },
        { id: 'h2', userId: 'u2', name: 'Habit 2', description: '', frequency: 'daily', createdAt: '', completions: [] }
      ]));
    });

    await page.goto('/login');
    await page.getByTestId('auth-login-email').fill('u1@ex.com');
    await page.getByTestId('auth-login-password').fill('p1');
    await page.getByTestId('auth-login-submit').click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('habit-card-habit-1')).toBeVisible();
    await expect(page.getByTestId('habit-card-habit-2')).not.toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'u1@ex.com' }));
    });
    
    await page.goto('/dashboard');
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Morning Run');
    await page.getByTestId('habit-description-input').fill('Run 5km');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-morning-run')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'u1@ex.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        { id: 'h1', userId: 'u1', name: 'Water', description: '', frequency: 'daily', createdAt: '', completions: [] }
      ]));
    });

    await page.goto('/dashboard');
    await expect(page.getByTestId('habit-streak-water')).toHaveText(/Streak: 0/);
    
    await page.getByTestId('habit-complete-water').click();
    await expect(page.getByTestId('habit-streak-water')).toHaveText(/Streak: 1/);
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'u1@ex.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        { id: 'h1', userId: 'u1', name: 'Persist', description: '', frequency: 'daily', createdAt: '', completions: [] }
      ]));
    });

    await page.goto('/dashboard');
    await expect(page.getByTestId('habit-card-persist')).toBeVisible();
    
    await page.reload();
    await expect(page.getByTestId('habit-card-persist')).toBeVisible();
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'u1@ex.com' }));
    });

    await page.goto('/dashboard');
    await page.getByTestId('auth-logout-button').click();
    
    await expect(page).toHaveURL(/\/login/);
    await expect(page.evaluate(() => localStorage.getItem('habit-tracker-session'))).resolves.toBeNull();
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ context, page }) => {
    await page.goto('/');
    // Wait for the service worker to potentially register
    await page.waitForTimeout(2000); 

    // Go offline
    await context.setOffline(true);
    
    await page.reload();
    
    // The splash screen should still render (part of app shell)
    // Actually, the splash screen is on '/', and ASSETS_TO_CACHE includes '/'
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    
    // Restore online for subsequent tests if any
    await context.setOffline(false);
  });
});
