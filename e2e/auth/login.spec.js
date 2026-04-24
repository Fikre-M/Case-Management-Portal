import { test, expect } from '@playwright/test';
import { TestHelpers, testData, selectors } from '../helpers/test-helpers.js';

test.describe('Authentication Flow', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearLocalStorage();
  });

  test.describe('Login Flow', () => {
    test('should display login page correctly', async ({ page }) => {
      await helpers.navigateTo('/login');
      
      // Check page title
      await expect(page).toHaveTitle(/.*Login.*/);
      
      // Check login form elements
      await expect(page.locator(selectors.loginForm)).toBeVisible();
      await expect(page.locator(selectors.emailInput)).toBeVisible();
      await expect(page.locator(selectors.passwordInput)).toBeVisible();
      await expect(page.locator(selectors.submitButton)).toBeVisible();
      
      // Check register link
      await expect(page.locator('a:has-text("Create an account")')).toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await helpers.navigateTo('/login');
      
      // Try to submit empty form
      await helpers.clickButton(selectors.submitButton);
      
      // Check for validation messages
      await expect(page.locator('text=Email is required')).toBeVisible();
      await expect(page.locator('text=Password is required')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await helpers.navigateTo('/login');
      
      // Fill with invalid credentials
      await helpers.fillField(selectors.emailInput, 'invalid@example.com');
      await helpers.fillField(selectors.passwordInput, 'wrongpassword');
      await helpers.clickButton(selectors.submitButton);
      
      // Check for error message
      await expect(page.locator('text=Invalid credentials')).toBeVisible();
      
      // Should still be on login page
      await expect(page).toHaveURL(/.*\/login/);
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      await helpers.navigateTo('/login');
      
      // Fill with valid demo credentials
      await helpers.fillField(selectors.emailInput, testData.users.demo.email);
      await helpers.fillField(selectors.passwordInput, testData.users.demo.password);
      await helpers.clickButton(selectors.submitButton);
      
      // Wait for navigation to dashboard
      await helpers.waitForNavigation();
      
      // Should be redirected to dashboard
      await expect(page).toHaveURL(/.*\/dashboard/);
      
      // Check dashboard elements
      await expect(page.locator(selectors.dashboardTitle)).toBeVisible();
      
      // Check user is authenticated in localStorage
      const userData = await helpers.getLocalStorage('ai_casemanager_current_user');
      expect(userData).toBeTruthy();
      expect(userData.email).toBe(testData.users.demo.email);
    });

    test('should handle login with demo mode', async ({ page }) => {
      await helpers.navigateTo('/demo');
      
      // Should redirect to dashboard with demo user
      await helpers.waitForNavigation();
      await expect(page).toHaveURL(/.*\/demo/);
      
      // Check demo user is set in localStorage
      const userData = await helpers.getLocalStorage('ai_casemanager_current_user');
      expect(userData).toBeTruthy();
      expect(userData.isDemo).toBe(true);
      expect(userData.email).toBe('demo@example.com');
      
      // Should see demo banner
      await expect(page.locator('text=LIVE DEMO')).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
      // First login
      await helpers.navigateTo('/login');
      await helpers.fillField(selectors.emailInput, testData.users.demo.email);
      await helpers.fillField(selectors.passwordInput, testData.users.demo.password);
      await helpers.clickButton(selectors.submitButton);
      await helpers.waitForNavigation();
      
      // Verify logged in
      await expect(page).toHaveURL(/.*\/dashboard/);
      
      // Find and click logout button (assuming it exists in navigation)
      const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")');
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        await helpers.waitForNavigation();
        
        // Should be redirected to login or landing page
        await expect(page).toHaveURL(/.*(login|landing)/);
        
        // Check localStorage is cleared
        const userData = await helpers.getLocalStorage('ai_casemanager_current_user');
        expect(userData).toBeFalsy();
      }
    });

    test('should handle session persistence', async ({ page }) => {
      // Login first
      await helpers.navigateTo('/login');
      await helpers.fillField(selectors.emailInput, testData.users.demo.email);
      await helpers.fillField(selectors.passwordInput, testData.users.demo.password);
      await helpers.clickButton(selectors.submitButton);
      await helpers.waitForNavigation();
      
      // Verify logged in
      await expect(page).toHaveURL(/.*\/dashboard/);
      
      // Reload page
      await page.reload();
      await helpers.waitForNavigation();
      
      // Should still be logged in
      await expect(page).toHaveURL(/.*\/dashboard/);
      await expect(page.locator(selectors.dashboardTitle)).toBeVisible();
    });
  });

  test.describe('Registration Flow', () => {
    test('should display registration page correctly', async ({ page }) => {
      await helpers.navigateTo('/register');
      
      // Check page title
      await expect(page).toHaveTitle(/.*Register.*/);
      
      // Check registration form elements
      await expect(page.locator(selectors.registerForm)).toBeVisible();
      await expect(page.locator(selectors.nameInput)).toBeVisible();
      await expect(page.locator(selectors.emailInput)).toBeVisible();
      await expect(page.locator(selectors.passwordInput)).toBeVisible();
      await expect(page.locator(selectors.submitButton)).toBeVisible();
      
      // Check login link
      await expect(page.locator('a:has-text("Already have an account")')).toBeVisible();
    });

    test('should register new user successfully', async ({ page }) => {
      await helpers.navigateTo('/register');
      
      // Fill registration form
      const newUser = {
        name: 'E2E Test User',
        email: 'e2e.test@example.com',
        password: 'testpassword123'
      };
      
      await helpers.fillField(selectors.nameInput, newUser.name);
      await helpers.fillField(selectors.emailInput, newUser.email);
      await helpers.fillField(selectors.passwordInput, newUser.password);
      await helpers.clickButton(selectors.submitButton);
      
      // Wait for navigation
      await helpers.waitForNavigation();
      
      // Should be redirected to dashboard
      await expect(page).toHaveURL(/.*\/dashboard/);
      
      // Check user is authenticated
      const userData = await helpers.getLocalStorage('ai_casemanager_current_user');
      expect(userData).toBeTruthy();
      expect(userData.email).toBe(newUser.email);
    });

    test('should show validation for duplicate email', async ({ page }) => {
      await helpers.navigateTo('/register');
      
      // Try to register with existing demo user email
      await helpers.fillField(selectors.nameInput, 'Test User');
      await helpers.fillField(selectors.emailInput, testData.users.demo.email);
      await helpers.fillField(selectors.passwordInput, 'password123');
      await helpers.clickButton(selectors.submitButton);
      
      // Should show error for existing user
      await expect(page.locator('text=User already exists')).toBeVisible();
      
      // Should still be on registration page
      await expect(page).toHaveURL(/.*\/register/);
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
      // Try to access protected routes without authentication
      const protectedRoutes = ['/dashboard', '/cases', '/appointments'];
      
      for (const route of protectedRoutes) {
        await helpers.navigateTo(route);
        
        // Should redirect to login
        await expect(page).toHaveURL(/.*\/login/);
      }
    });

    test('should allow authenticated users to access protected routes', async ({ page }) => {
      // Login first
      await helpers.navigateTo('/login');
      await helpers.fillField(selectors.emailInput, testData.users.demo.email);
      await helpers.fillField(selectors.passwordInput, testData.users.demo.password);
      await helpers.clickButton(selectors.submitButton);
      await helpers.waitForNavigation();
      
      // Now try to access protected routes
      const protectedRoutes = ['/dashboard', '/cases', '/appointments'];
      
      for (const route of protectedRoutes) {
        await helpers.navigateTo(route);
        await helpers.waitForNavigation();
        
        // Should be able to access the route
        await expect(page).toHaveURL(new RegExp(`.*${route}`));
      }
    });
  });
});
