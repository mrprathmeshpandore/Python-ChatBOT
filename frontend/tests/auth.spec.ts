import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Check for login title
    await expect(page.locator('h1')).toContainText(/Welcome back/i);
    
    // Check for email and password inputs
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    
    // Check for submit button
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });
});
