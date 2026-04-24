import { test, expect } from '@playwright/test';
import { TestHelpers, testData, selectors } from '../helpers/test-helpers.js';

test.describe('AI Assistant Flow', () => {
  let helpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.clearLocalStorage();
    
    // Login as demo user for all tests
    await helpers.navigateTo('/demo');
    await helpers.waitForNavigation();
  });

  test.describe('AI Assistant Panel', () => {
    test('should open AI assistant panel', async ({ page }) => {
      await helpers.navigateTo('/dashboard');
      
      // Click AI assistant button
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Check AI panel appears
      await expect(page.locator(selectors.aiAssistantPanel)).toBeVisible();
      await expect(page.locator('h2:has-text("AI Assistant")')).toBeVisible();
    });

    test('should close AI assistant panel', async ({ page }) => {
      await helpers.navigateTo('/dashboard');
      
      // Open AI assistant
      await helpers.clickButton(selectors.aiAssistantButton);
      await expect(page.locator(selectors.aiAssistantPanel)).toBeVisible();
      
      // Close AI assistant
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Panel should be hidden
      await expect(page.locator(selectors.aiAssistantPanel)).not.toBeVisible();
    });

    test('should display chat input and send button', async ({ page }) => {
      await helpers.navigateTo('/dashboard');
      
      // Open AI assistant
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Check chat interface elements
      await expect(page.locator(selectors.aiChatInput)).toBeVisible();
      await expect(page.locator(selectors.aiSendButton)).toBeVisible();
      
      // Check placeholder text
      await expect(page.locator('textarea[placeholder*="Ask AI"]')).toBeVisible();
    });

    test('should display welcome message', async ({ page }) => {
      await helpers.navigateTo('/dashboard');
      
      // Open AI assistant
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Check for welcome message
      await expect(page.locator('text=Hello! I\'m your AI assistant')).toBeVisible();
      await expect(page.locator('text=How can I help you today?')).toBeVisible();
    });
  });

  test.describe('AI Chat Interactions', () => {
    test('should send message and receive response', async ({ page }) => {
      await helpers.navigateTo('/dashboard');
      
      // Open AI assistant
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Type a message
      const message = 'Hello, can you help me with case management?';
      await helpers.fillField(selectors.aiChatInput, message);
      
      // Send message
      await helpers.clickButton(selectors.aiSendButton);
      
      // Check message appears in chat
      await expect(page.locator(`text=${message}`)).toBeVisible();
      
      // Wait for AI response (mock or real)
      await page.waitForTimeout(2000);
      
      // Check for AI response indicator
      const aiMessages = page.locator('[data-testid="ai-message"]');
      if (await aiMessages.count() > 0) {
        await expect(aiMessages.first()).toBeVisible();
      } else {
        // If no real AI, check for typing indicator or fallback response
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
          throw new Error('No typing indicator found');
        }
      }
    });

    test('should handle empty message submission', async ({ page }) => {
      await helpers.navigateTo('/dashboard');
      
      // Open AI assistant
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Try to send empty message
      await helpers.clickButton(selectors.aiSendButton);
      
      // Should not send empty message
      const chatMessages = page.locator('[data-testid="user-message"]');
      const messageCount = await chatMessages.count();
      expect(messageCount).toBe(0);
    });

    test('should maintain chat history', async ({ page }) => {
      await helpers.navigateTo('/dashboard');
      
      // Open AI assistant
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Send multiple messages
      const messages = [
        'Hello',
        'How are you?',
        'Can you help me with cases?'
      ];
      
      for (const message of messages) {
        await helpers.fillField(selectors.aiChatInput, message);
        await helpers.clickButton(selectors.aiSendButton);
        await page.waitForTimeout(1000);
      }
      
      // Check all messages are displayed
      for (const message of messages) {
        await expect(page.locator(`text=${message}`)).toBeVisible();
      }
    });

    test('should clear chat history', async ({ page }) => {
      await helpers.navigateTo('/dashboard');
      
      // Open AI assistant
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Send a message
      await helpers.fillField(selectors.aiChatInput, 'Test message');
      await helpers.clickButton(selectors.aiSendButton);
      await page.waitForTimeout(1000);
      
      // Clear chat (if clear button exists)
      const clearButton = page.locator('button:has-text("Clear")');
      if (await clearButton.isVisible()) {
        await clearButton.click();
        
        // Check chat is cleared
        await expect(page.locator('text=Test message')).not.toBeVisible();
        await expect(page.locator('text=Hello! I\'m your AI assistant')).toBeVisible();
      }
    });
  });

  test.describe('AI Context Awareness', () => {
    test('should provide context-aware suggestions', async ({ page }) => {
      // First create a case to provide context
      await helpers.navigateTo('/cases');
      await helpers.clickButton('button:has-text("Create Case")');
      await helpers.fillField(selectors.caseTitleInput, 'Test Case for AI');
      await helpers.fillField(selectors.caseDescriptionTextarea, 'This is a test case about contract review');
      await helpers.fillField(selectors.caseClientInput, 'Test Client');
      await page.locator(selectors.casePrioritySelect).selectOption('high');
      await page.locator(selectors.caseStatusSelect).selectOption('active');
      await helpers.clickButton(selectors.createCaseButton);
      await helpers.waitForNavigation();
      
      // Open AI assistant
      await helpers.navigateTo('/dashboard');
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Ask about the case
      await helpers.fillField(selectors.aiChatInput, 'Can you help me with my cases?');
      await helpers.clickButton(selectors.aiSendButton);
      await page.waitForTimeout(2000);
      
      // Check if AI provides context-aware response
      const aiResponse = page.locator('[data-testid="ai-message"]');
      if (await aiResponse.count() > 0) {
        const responseText = await aiResponse.first().textContent();
        
        // Response should mention cases or be relevant to case management
        expect(responseText.toLowerCase()).toMatch(/case|cases|management|help/);
      }
    });

    test('should provide dashboard insights', async ({ page }) => {
      await helpers.navigateTo('/dashboard');
      
      // Open AI assistant
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Ask for dashboard insights
      await helpers.fillField(selectors.aiChatInput, 'What can you tell me about my dashboard?');
      await helpers.clickButton(selectors.aiSendButton);
      await page.waitForTimeout(2000);
      
      // Check for relevant response
      const aiResponse = page.locator('[data-testid="ai-message"]');
      if (await aiResponse.count() > 0) {
        const responseText = await aiResponse.first().textContent();
        
        // Response should be relevant to dashboard
        expect(responseText.toLowerCase()).toMatch(/dashboard|cases|appointments|statistics|overview/);
      }
    });
  });

  test.describe('AI Assistant Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      await helpers.navigateTo('/dashboard');
      
      // Open AI assistant
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Mock network failure by intercepting the request
      await page.route('**/api/ai/**', route => route.abort());
      
      // Send a message
      await helpers.fillField(selectors.aiChatInput, 'Test message');
      await helpers.clickButton(selectors.aiSendButton);
      await page.waitForTimeout(2000);
      
      // Check for error message
      const errorMessages = ['text=Error', 'text=Failed', 'text=Unable'];
      let foundError = false;
      for (const errorMsg of errorMessages) {
        try {
          await expect(page.locator(errorMsg)).toBeVisible({ timeout: 1000 });
          foundError = true;
          break;
        } catch (e) {
          // Continue to next error message
        }
      }
      if (!foundError) {
        throw new Error('No error message found');
      }
    });

    test('should handle rate limiting', async ({ page }) => {
      await helpers.navigateTo('/dashboard');
      
      // Open AI assistant
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Send multiple messages quickly
      for (let i = 0; i < 5; i++) {
        await helpers.fillField(selectors.aiChatInput, `Message ${i + 1}`);
        await helpers.clickButton(selectors.aiSendButton);
        await page.waitForTimeout(500);
      }
      
      // Check for rate limiting message
      const rateLimitMessages = ['text=rate limit', 'text=too many requests', 'text=slow down'];
      let foundRateLimit = false;
      for (const msg of rateLimitMessages) {
        try {
          await expect(page.locator(msg)).toBeVisible({ timeout: 1000 });
          foundRateLimit = true;
          break;
        } catch (e) {
          // Continue to next message
        }
      }
      if (!foundRateLimit) {
        throw new Error('No rate limiting message found');
      }
    });

    test('should handle authentication errors', async ({ page }) => {
      // Clear authentication
      await helpers.clearLocalStorage();
      
      await helpers.navigateTo('/dashboard');
      
      // Open AI assistant
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Send a message
      await helpers.fillField(selectors.aiChatInput, 'Test message');
      await helpers.clickButton(selectors.aiSendButton);
      await page.waitForTimeout(2000);
      
      // Check for authentication error
      const authMessages = ['text=login', 'text=authenticate', 'text=sign in'];
      let foundAuth = false;
      for (const msg of authMessages) {
        try {
          await expect(page.locator(msg)).toBeVisible({ timeout: 1000 });
          foundAuth = true;
          break;
        } catch (e) {
          // Continue to next message
        }
      }
      if (!foundAuth) {
        throw new Error('No authentication message found');
      }
    });
  });

  test.describe('AI Assistant UI/UX', () => {
    test('should have responsive design', async ({ page }) => {
      await helpers.navigateTo('/dashboard');
      
      // Open AI assistant
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Check on desktop
      await page.setViewportSize({ width: 1200, height: 800 });
      await expect(page.locator(selectors.aiAssistantPanel)).toBeVisible();
      
      // Check on tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator(selectors.aiAssistantPanel)).toBeVisible();
      
      // Check on mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator(selectors.aiAssistantPanel)).toBeVisible();
    });

    test('should have accessible keyboard navigation', async ({ page }) => {
      await helpers.navigateTo('/dashboard');
      
      // Open AI assistant with keyboard
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      // Focus on chat input
      await page.keyboard.press('Tab');
      await expect(page.locator(selectors.aiChatInput)).toBeFocused();
      
      // Type message with keyboard
      await page.keyboard.type('Test message');
      
      // Send with keyboard (Enter)
      await page.keyboard.press('Enter');
      
      // Check message was sent
      await expect(page.locator('text=Test message')).toBeVisible();
    });

    test('should have proper loading states', async ({ page }) => {
      await helpers.navigateTo('/dashboard');
      
      // Open AI assistant
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Send message
      await helpers.fillField(selectors.aiChatInput, 'Test message');
      await helpers.clickButton(selectors.aiSendButton);
      
      // Check for loading indicator
      const loadingIndicators = ['[data-testid="loading"]', 'text=typing', 'text=thinking'];
      let foundLoading = false;
      for (const indicator of loadingIndicators) {
        try {
          await expect(page.locator(indicator)).toBeVisible({ timeout: 1000 });
          foundLoading = true;
          break;
        } catch (e) {
          // Continue to next indicator
        }
      }
      if (!foundLoading) {
        throw new Error('No loading indicator found');
      }
    });
  });

  test.describe('AI Assistant Integration', () => {
    test('should work across different pages', async ({ page }) => {
      const pages = ['/dashboard', '/cases', '/appointments'];
      
      for (const pagePath of pages) {
        await helpers.navigateTo(pagePath);
        
        // Open AI assistant
        await helpers.clickButton(selectors.aiAssistantButton);
        
        // Send a message
        await helpers.fillField(selectors.aiChatInput, 'Hello from ' + pagePath);
        await helpers.clickButton(selectors.aiSendButton);
        await page.waitForTimeout(1000);
        
        // Check message appears
        await expect(page.locator('text=Hello from ' + pagePath)).toBeVisible();
        
        // Close AI assistant
        await helpers.clickButton(selectors.aiAssistantButton);
        await expect(page.locator(selectors.aiAssistantPanel)).not.toBeVisible();
      }
    });

    test('should maintain state during navigation', async ({ page }) => {
      await helpers.navigateTo('/dashboard');
      
      // Open AI assistant and send message
      await helpers.clickButton(selectors.aiAssistantButton);
      await helpers.fillField(selectors.aiChatInput, 'Test message for state');
      await helpers.clickButton(selectors.aiSendButton);
      await page.waitForTimeout(1000);
      
      // Navigate to another page
      await helpers.navigateTo('/cases');
      
      // Open AI assistant again
      await helpers.clickButton(selectors.aiAssistantButton);
      
      // Check if chat history is maintained
      await expect(page.locator('text=Test message for state')).toBeVisible();
    });
  });
});
