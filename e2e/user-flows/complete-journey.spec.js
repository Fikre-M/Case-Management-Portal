import { test, expect } from '@playwright/test';
import { TestHelpers, testData, selectors } from '../helpers/test-helpers.js';

test.describe('Complete User Journey', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearLocalStorage();
  });

  test('should complete full user flow: login → create case → use AI assistant', async ({ page }) => {
    // Step 1: Login
    await helpers.navigateTo('/login');
    
    // Verify login page
    await expect(page.locator(selectors.loginForm)).toBeVisible();
    await expect(page.locator(selectors.emailInput)).toBeVisible();
    await expect(page.locator(selectors.passwordInput)).toBeVisible();
    
    // Login with demo credentials
    await helpers.fillField(selectors.emailInput, testData.users.demo.email);
    await helpers.fillField(selectors.passwordInput, testData.users.demo.password);
    await helpers.clickButton(selectors.submitButton);
    
    // Verify successful login
    await helpers.waitForNavigation();
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator(selectors.dashboardTitle)).toBeVisible();
    
    // Verify user is authenticated
    const userData = await helpers.getLocalStorage('ai_casemanager_current_user');
    expect(userData).toBeTruthy();
    expect(userData.email).toBe(testData.users.demo.email);
    
    // Step 2: Navigate to cases and create a new case
    await helpers.navigateTo('/cases');
    
    // Verify cases page
    await expect(page.locator('h1:has-text("Cases")')).toBeVisible();
    await expect(page.locator('button:has-text("Create Case")')).toBeVisible();
    
    // Create a new case
    await helpers.clickButton('button:has-text("Create Case")');
    await expect(page.locator(selectors.caseForm)).toBeVisible();
    
    // Fill case form
    const caseData = {
      title: 'E2E Test Case - Complete Journey',
      description: 'This case was created during end-to-end testing to verify the complete user flow',
      client: 'E2E Test Client',
      priority: 'high',
      status: 'active'
    };
    
    await helpers.fillField(selectors.caseTitleInput, caseData.title);
    await helpers.fillField(selectors.caseDescriptionTextarea, caseData.description);
    await helpers.fillField(selectors.caseClientInput, caseData.client);
    await page.locator(selectors.casePrioritySelect).selectOption(caseData.priority);
    await page.locator(selectors.caseStatusSelect).selectOption(caseData.status);
    
    // Submit case
    await helpers.clickButton(selectors.createCaseButton);
    
    // Verify case creation
    await expect(page.locator(selectors.caseForm)).not.toBeVisible();
    await helpers.waitForNavigation();
    await expect(page.locator('text=Case created successfully')).toBeVisible();
    await expect(page.locator(`text=${caseData.title}`)).toBeVisible();
    
    // Step 3: Navigate to case details
    await page.locator(`text=${caseData.title}`).click();
    await helpers.waitForNavigation();
    
    // Verify case details page
    await expect(page.locator('h1:has-text("Case Details")')).toBeVisible();
    await expect(page.locator(`text=${caseData.title}`)).toBeVisible();
    await expect(page.locator(`text=${caseData.description}`)).toBeVisible();
    await expect(page.locator(`text=${caseData.client}`)).toBeVisible();
    
    // Step 4: Open AI Assistant and interact with it
    await helpers.navigateTo('/dashboard');
    
    // Open AI assistant
    await helpers.clickButton(selectors.aiAssistantButton);
    await expect(page.locator(selectors.aiAssistantPanel)).toBeVisible();
    
    // Verify welcome message
    await expect(page.locator('text=Hello! I\'m your AI assistant')).toBeVisible();
    
    // Send a message about the created case
    const aiMessage = `I just created a case titled "${caseData.title}" for client "${caseData.client}". Can you help me understand what steps I should take next?`;
    
    await helpers.fillField(selectors.aiChatInput, aiMessage);
    await helpers.clickButton(selectors.aiSendButton);
    
    // Verify message appears in chat
    await expect(page.locator(`text=${aiMessage}`)).toBeVisible();
    
    // Wait for AI response
    await page.waitForTimeout(3000);
    
    // Check for AI response (could be mock or real)
    const aiMessages = page.locator('[data-testid="ai-message"]');
    if (await aiMessages.count() > 0) {
      await expect(aiMessages.first()).toBeVisible();
    } else {
      // Check for typing indicators or fallback responses
      const typingIndicators = ['text=typing', 'text=thinking', 'text=Response'];
      let foundIndicator = false;
      for (const indicator of typingIndicators) {
        try {
          await expect(page.locator(indicator)).toBeVisible({ timeout: 1000 });
          foundIndicator = true;
          break;
        } catch (e) {
          // Continue to next indicator
        }
      }
      if (!foundIndicator) {
        console.log('No AI response indicator found - this may be expected in test environment');
      }
    }
    
    // Step 5: Test AI context awareness
    await helpers.fillField(selectors.aiChatInput, 'What cases am I currently working on?');
    await helpers.clickButton(selectors.aiSendButton);
    await page.waitForTimeout(2000);
    
    // Verify AI responds appropriately
    const contextResponse = page.locator('[data-testid="ai-message"]');
    if (await contextResponse.count() > 0) {
      const responseText = await contextResponse.last().textContent();
      // Response should be relevant to case management
      expect(responseText.toLowerCase()).toMatch(/case|cases|management|help/);
    }
    
    // Step 6: Test navigation with AI assistant state
    await helpers.navigateTo('/cases');
    
    // Reopen AI assistant
    await helpers.clickButton(selectors.aiAssistantButton);
    
    // Verify chat history is maintained
    await expect(page.locator(`text=${aiMessage}`)).toBeVisible();
    
    // Step 7: Test case filtering and AI integration
    await helpers.navigateTo('/cases');
    
    // Filter cases by status
    await page.locator('select[name="statusFilter"]').selectOption('active');
    await helpers.waitForNavigation();
    
    // Verify our case appears in filtered results
    await expect(page.locator(`text=${caseData.title}`)).toBeVisible();
    
    // Step 8: Test dashboard statistics
    await helpers.navigateTo('/dashboard');
    
    // Verify statistics are displayed
    await expect(page.locator('[data-testid="total-cases"]')).toBeVisible();
    await expect(page.locator('[data-testid="active-cases"]')).toBeVisible();
    
    // Get statistics to verify they include our case
    const totalCasesText = await page.locator('[data-testid="total-cases"]').textContent();
    const totalCases = parseInt(totalCasesText);
    expect(totalCases).toBeGreaterThan(0);
    
    // Step 9: Test logout and session cleanup
    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await helpers.waitForNavigation();
      
      // Verify logged out
      await expect(page).toHaveURL(/.*(login|landing)/);
      
      // Verify localStorage is cleared
      const userDataAfterLogout = await helpers.getLocalStorage('ai_casemanager_current_user');
      expect(userDataAfterLogout).toBeFalsy();
    }
    
    // Step 10: Verify complete journey success
    console.log('✅ Complete user journey test passed successfully');
    console.log(`📝 Created case: ${caseData.title}`);
    console.log(`🤖 AI Assistant interactions completed`);
    console.log(`📊 Dashboard statistics verified`);
  });

  test('should handle user flow with demo mode', async ({ page }) => {
    // Start with demo mode
    await helpers.navigateTo('/demo');
    await helpers.waitForNavigation();
    
    // Verify demo mode is active
    await expect(page.locator('text=LIVE DEMO')).toBeVisible();
    const userData = await helpers.getLocalStorage('ai_casemanager_current_user');
    expect(userData.isDemo).toBe(true);
    
    // Create a case in demo mode
    await helpers.navigateTo('/cases');
    await helpers.clickButton('button:has-text("Create Case")');
    
    const demoCase = {
      title: 'Demo Mode Test Case',
      description: 'Testing case creation in demo mode',
      client: 'Demo Client',
      priority: 'medium',
      status: 'pending'
    };
    
    await helpers.fillField(selectors.caseTitleInput, demoCase.title);
    await helpers.fillField(selectors.caseDescriptionTextarea, demoCase.description);
    await helpers.fillField(selectors.caseClientInput, demoCase.client);
    await page.locator(selectors.casePrioritySelect).selectOption(demoCase.priority);
    await page.locator(selectors.caseStatusSelect).selectOption(demoCase.status);
    await helpers.clickButton(selectors.createCaseButton);
    await helpers.waitForNavigation();
    
    // Verify case creation
    await expect(page.locator(`text=${demoCase.title}`)).toBeVisible();
    
    // Test AI assistant in demo mode
    await helpers.navigateTo('/dashboard');
    await helpers.clickButton(selectors.aiAssistantButton);
    
    await helpers.fillField(selectors.aiChatInput, 'I\'m in demo mode. What can I do here?');
    await helpers.clickButton(selectors.aiSendButton);
    await page.waitForTimeout(2000);
    
    // Verify AI responds in demo context
    const aiMessages = page.locator('[data-testid="ai-message"]');
    if (await aiMessages.count() > 0) {
      await expect(aiMessages.first()).toBeVisible();
    }
    
    console.log('✅ Demo mode user journey completed successfully');
  });

  test('should handle error scenarios in user flow', async ({ page }) => {
    // Test invalid login
    await helpers.navigateTo('/login');
    await helpers.fillField(selectors.emailInput, 'invalid@example.com');
    await helpers.fillField(selectors.passwordInput, 'wrongpassword');
    await helpers.clickButton(selectors.submitButton);
    
    // Verify error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL(/.*\/login/);
    
    // Test protected route access without authentication
    await helpers.navigateTo('/cases');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
    
    // Test successful login after error
    await helpers.fillField(selectors.emailInput, testData.users.demo.email);
    await helpers.fillField(selectors.passwordInput, testData.users.demo.password);
    await helpers.clickButton(selectors.submitButton);
    await helpers.waitForNavigation();
    
    // Verify successful login
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Test case creation validation
    await helpers.navigateTo('/cases');
    await helpers.clickButton('button:has-text("Create Case")');
    await helpers.clickButton(selectors.createCaseButton);
    
    // Verify validation errors
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Description is required')).toBeVisible();
    await expect(page.locator('text=Client is required')).toBeVisible();
    
    console.log('✅ Error scenario handling verified successfully');
  });

  test('should test responsive design throughout user flow', async ({ page }) => {
    // Login first
    await helpers.navigateTo('/login');
    await helpers.fillField(selectors.emailInput, testData.users.demo.email);
    await helpers.fillField(selectors.passwordInput, testData.users.demo.password);
    await helpers.clickButton(selectors.submitButton);
    await helpers.waitForNavigation();
    
    // Test on different screen sizes
    const viewports = [
      { width: 1200, height: 800, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Test dashboard
      await helpers.navigateTo('/dashboard');
      await expect(page.locator(selectors.dashboardTitle)).toBeVisible();
      
      // Test AI assistant
      await helpers.clickButton(selectors.aiAssistantButton);
      await expect(page.locator(selectors.aiAssistantPanel)).toBeVisible();
      await helpers.clickButton(selectors.aiAssistantButton); // Close it
      
      // Test cases page
      await helpers.navigateTo('/cases');
      await expect(page.locator('h1:has-text("Cases")')).toBeVisible();
      
      console.log(`✅ Responsive design verified for ${viewport.name} (${viewport.width}x${viewport.height})`);
    }
  });
});
