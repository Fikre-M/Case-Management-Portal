import { test, expect } from '@playwright/test';
import { TestHelpers, testData, selectors } from '../helpers/test-helpers.js';

test.describe('Case Management Flow', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearLocalStorage();
    
    // Login as demo user for all tests
    await helpers.navigateTo('/demo');
    await helpers.waitForNavigation();
  });

  test.describe('Case Creation', () => {
    test('should display cases page correctly', async ({ page }) => {
      await helpers.navigateTo('/cases');
      
      // Check page title
      await expect(page).toHaveTitle(/.*Cases.*/);
      
      // Check for cases list and create button
      await expect(page.locator('h1:has-text("Cases")')).toBeVisible();
      await expect(page.locator('button:has-text("Create Case")')).toBeVisible();
    });

    test('should open case creation modal', async ({ page }) => {
      await helpers.navigateTo('/cases');
      
      // Click create case button
      await helpers.clickButton('button:has-text("Create Case")');
      
      // Check modal appears
      await expect(page.locator(selectors.caseForm)).toBeVisible();
      await expect(page.locator('h2:has-text("Create New Case")')).toBeVisible();
    });

    test('should create case with valid data', async ({ page }) => {
      await helpers.navigateTo('/cases');
      
      // Open create case modal
      await helpers.clickButton('button:has-text("Create Case")');
      
      // Fill case form
      await helpers.fillField(selectors.caseTitleInput, testData.cases.sample.title);
      await helpers.fillField(selectors.caseDescriptionTextarea, testData.cases.sample.description);
      await helpers.fillField(selectors.caseClientInput, testData.cases.sample.client);
      
      // Select priority and status
      await page.locator(selectors.casePrioritySelect).selectOption(testData.cases.sample.priority);
      await page.locator(selectors.caseStatusSelect).selectOption(testData.cases.sample.status);
      
      // Submit form
      await helpers.clickButton(selectors.createCaseButton);
      
      // Wait for modal to close and case to appear
      await expect(page.locator(selectors.caseForm)).not.toBeVisible();
      await helpers.waitForNavigation();
      
      // Check for success message
      await expect(page.locator('text=Case created successfully')).toBeVisible();
      
      // Verify case appears in list
      await expect(page.locator(`text=${testData.cases.sample.title}`)).toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await helpers.navigateTo('/cases');
      
      // Open create case modal
      await helpers.clickButton('button:has-text("Create Case")');
      
      // Try to submit empty form
      await helpers.clickButton(selectors.createCaseButton);
      
      // Check for validation messages
      await expect(page.locator('text=Title is required')).toBeVisible();
      await expect(page.locator('text=Description is required')).toBeVisible();
      await expect(page.locator('text=Client is required')).toBeVisible();
    });

    test('should close modal when cancelled', async ({ page }) => {
      await helpers.navigateTo('/cases');
      
      // Open create case modal
      await helpers.clickButton('button:has-text("Create Case")');
      
      // Click cancel button
      await helpers.clickButton('button:has-text("Cancel")');
      
      // Modal should close
      await expect(page.locator(selectors.caseForm)).not.toBeVisible();
    });
  });

  test.describe('Case Viewing and Editing', () => {
    test('should display case details', async ({ page }) => {
      // First create a test case
      await helpers.navigateTo('/cases');
      await helpers.clickButton('button:has-text("Create Case")');
      await helpers.fillField(selectors.caseTitleInput, testData.cases.sample.title);
      await helpers.fillField(selectors.caseDescriptionTextarea, testData.cases.sample.description);
      await helpers.fillField(selectors.caseClientInput, testData.cases.sample.client);
      await page.locator(selectors.casePrioritySelect).selectOption(testData.cases.sample.priority);
      await page.locator(selectors.caseStatusSelect).selectOption(testData.cases.sample.status);
      await helpers.clickButton(selectors.createCaseButton);
      await helpers.waitForNavigation();
      
      // Click on the created case
      await page.locator(`text=${testData.cases.sample.title}`).click();
      await helpers.waitForNavigation();
      
      // Check case details page
      await expect(page.locator('h1:has-text("Case Details")')).toBeVisible();
      await expect(page.locator(`text=${testData.cases.sample.title}`)).toBeVisible();
      await expect(page.locator(`text=${testData.cases.sample.description}`)).toBeVisible();
      await expect(page.locator(`text=${testData.cases.sample.client}`)).toBeVisible();
    });

    test('should edit existing case', async ({ page }) => {
      // First create a test case
      await helpers.navigateTo('/cases');
      await helpers.clickButton('button:has-text("Create Case")');
      await helpers.fillField(selectors.caseTitleInput, testData.cases.sample.title);
      await helpers.fillField(selectors.caseDescriptionTextarea, testData.cases.sample.description);
      await helpers.fillField(selectors.caseClientInput, testData.cases.sample.client);
      await page.locator(selectors.casePrioritySelect).selectOption(testData.cases.sample.priority);
      await page.locator(selectors.caseStatusSelect).selectOption(testData.cases.sample.status);
      await helpers.clickButton(selectors.createCaseButton);
      await helpers.waitForNavigation();
      
      // Click on the created case to view details
      await page.locator(`text=${testData.cases.sample.title}`).click();
      await helpers.waitForNavigation();
      
      // Click edit button
      await helpers.clickButton('button:has-text("Edit")');
      
      // Edit the case title
      const newTitle = 'Updated Test Case';
      await helpers.fillField(selectors.caseTitleInput, newTitle);
      
      // Save changes
      await helpers.clickButton('button:has-text("Save Changes")');
      await helpers.waitForNavigation();
      
      // Check for success message
      await expect(page.locator('text=Case updated successfully')).toBeVisible();
      
      // Verify the updated title
      await expect(page.locator(`text=${newTitle}`)).toBeVisible();
    });

    test('should delete case', async ({ page }) => {
      // First create a test case
      await helpers.navigateTo('/cases');
      await helpers.clickButton('button:has-text("Create Case")');
      await helpers.fillField(selectors.caseTitleInput, testData.cases.sample.title);
      await helpers.fillField(selectors.caseDescriptionTextarea, testData.cases.sample.description);
      await helpers.fillField(selectors.caseClientInput, testData.cases.sample.client);
      await page.locator(selectors.casePrioritySelect).selectOption(testData.cases.sample.priority);
      await page.locator(selectors.caseStatusSelect).selectOption(testData.cases.sample.status);
      await helpers.clickButton(selectors.createCaseButton);
      await helpers.waitForNavigation();
      
      // Click on the created case to view details
      await page.locator(`text=${testData.cases.sample.title}`).click();
      await helpers.waitForNavigation();
      
      // Click delete button
      await helpers.clickButton('button:has-text("Delete")');
      
      // Confirm deletion in modal
      await helpers.clickButton('button:has-text("Confirm")');
      await helpers.waitForNavigation();
      
      // Check for success message
      await expect(page.locator('text=Case deleted successfully')).toBeVisible();
      
      // Verify case is no longer in list
      await expect(page.locator(`text=${testData.cases.sample.title}`)).not.toBeVisible();
    });
  });

  test.describe('Case Filtering and Search', () => {
    test.beforeEach(async ({ page }) => {
      // Create multiple test cases for filtering
      const cases = [
        { title: 'High Priority Case', description: 'Urgent matter', client: 'Client A', priority: 'high', status: 'active' },
        { title: 'Low Priority Case', description: 'Routine matter', client: 'Client B', priority: 'low', status: 'pending' },
        { title: 'Medium Priority Case', description: 'Standard matter', client: 'Client C', priority: 'medium', status: 'closed' }
      ];
      
      for (const caseData of cases) {
        await helpers.navigateTo('/cases');
        await helpers.clickButton('button:has-text("Create Case")');
        await helpers.fillField(selectors.caseTitleInput, caseData.title);
        await helpers.fillField(selectors.caseDescriptionTextarea, caseData.description);
        await helpers.fillField(selectors.caseClientInput, caseData.client);
        await page.locator(selectors.casePrioritySelect).selectOption(caseData.priority);
        await page.locator(selectors.caseStatusSelect).selectOption(caseData.status);
        await helpers.clickButton(selectors.createCaseButton);
        await helpers.waitForNavigation();
      }
    });

    test('should filter cases by status', async ({ page }) => {
      await helpers.navigateTo('/cases');
      
      // Filter by active status
      await page.locator('select[name="statusFilter"]').selectOption('active');
      await helpers.waitForNavigation();
      
      // Should only show active cases
      await expect(page.locator('text=High Priority Case')).toBeVisible();
      await expect(page.locator('text=Low Priority Case')).not.toBeVisible();
      await expect(page.locator('text=Medium Priority Case')).not.toBeVisible();
    });

    test('should filter cases by priority', async ({ page }) => {
      await helpers.navigateTo('/cases');
      
      // Filter by high priority
      await page.locator('select[name="priorityFilter"]').selectOption('high');
      await helpers.waitForNavigation();
      
      // Should only show high priority cases
      await expect(page.locator('text=High Priority Case')).toBeVisible();
      await expect(page.locator('text=Low Priority Case')).not.toBeVisible();
      await expect(page.locator('text=Medium Priority Case')).not.toBeVisible();
    });

    test('should search cases by title', async ({ page }) => {
      await helpers.navigateTo('/cases');
      
      // Search for specific case
      await helpers.fillField('input[placeholder*="Search"]', 'High Priority');
      await helpers.waitForNavigation();
      
      // Should only show matching cases
      await expect(page.locator('text=High Priority Case')).toBeVisible();
      await expect(page.locator('text=Low Priority Case')).not.toBeVisible();
      await expect(page.locator('text=Medium Priority Case')).not.toBeVisible();
    });

    test('should search cases by client name', async ({ page }) => {
      await helpers.navigateTo('/cases');
      
      // Search by client name
      await helpers.fillField('input[placeholder*="Search"]', 'Client A');
      await helpers.waitForNavigation();
      
      // Should only show cases for Client A
      await expect(page.locator('text=High Priority Case')).toBeVisible();
      await expect(page.locator('text=Low Priority Case')).not.toBeVisible();
      await expect(page.locator('text=Medium Priority Case')).not.toBeVisible();
    });
  });

  test.describe('Case Statistics', () => {
    test('should display case statistics', async ({ page }) => {
      await helpers.navigateTo('/cases');
      
      // Check for statistics cards
      await expect(page.locator('[data-testid="total-cases"]')).toBeVisible();
      await expect(page.locator('[data-testid="active-cases"]')).toBeVisible();
      await expect(page.locator('[data-testid="pending-cases"]')).toBeVisible();
      await expect(page.locator('[data-testid="closed-cases"]')).toBeVisible();
    });

    test('should update statistics when case is created', async ({ page }) => {
      await helpers.navigateTo('/cases');
      
      // Get initial statistics
      const initialTotal = await page.locator('[data-testid="total-cases"]').textContent();
      
      // Create a new case
      await helpers.clickButton('button:has-text("Create Case")');
      await helpers.fillField(selectors.caseTitleInput, testData.cases.sample.title);
      await helpers.fillField(selectors.caseDescriptionTextarea, testData.cases.sample.description);
      await helpers.fillField(selectors.caseClientInput, testData.cases.sample.client);
      await page.locator(selectors.casePrioritySelect).selectOption(testData.cases.sample.priority);
      await page.locator(selectors.caseStatusSelect).selectOption(testData.cases.sample.status);
      await helpers.clickButton(selectors.createCaseButton);
      await helpers.waitForNavigation();
      
      // Check if statistics updated
      const newTotal = await page.locator('[data-testid="total-cases"]').textContent();
      expect(parseInt(newTotal)).toBe(parseInt(initialTotal) + 1);
    });
  });
});
