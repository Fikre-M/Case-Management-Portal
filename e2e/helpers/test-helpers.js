/**
 * Test helpers and utilities for E2E tests
 */

export class TestHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for and navigate to a specific route
   */
  async navigateTo(route) {
    await this.page.goto(route);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clear localStorage
   */
  async clearLocalStorage() {
    await this.page.evaluate(() => {
      localStorage.clear();
    });
  }

  /**
   * Set localStorage item
   */
  async setLocalStorage(key, value) {
    await this.page.evaluate(
      ([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      [key, value]
    );
  }

  /**
   * Get localStorage item
   */
  async getLocalStorage(key) {
    return await this.page.evaluate(
      (key) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      },
      key
    );
  }

  /**
   * Wait for element to be visible and enabled
   */
  async waitForElement(selector, options = {}) {
    await this.page.waitForSelector(selector, { 
      state: 'visible', 
      timeout: 10000,
      ...options 
    });
    return this.page.locator(selector);
  }

  /**
   * Fill form field with validation
   */
  async fillField(selector, value) {
    const element = await this.waitForElement(selector);
    await element.fill(value);
    return element;
  }

  /**
   * Click button with validation
   */
  async clickButton(selector, options = {}) {
    const button = await this.waitForElement(selector);
    await button.click(options);
    return button;
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name) {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for toast/notification to appear
   */
  async waitForToast(message) {
    await this.page.waitForSelector(`text=${message}`, { timeout: 5000 });
  }

  /**
   * Check if element exists
   */
  async elementExists(selector) {
    const element = this.page.locator(selector);
    return await element.count() > 0;
  }

  /**
   * Get text content of element
   */
  async getText(selector) {
    const element = await this.waitForElement(selector);
    return await element.textContent();
  }
}

/**
 * Test data fixtures
 */
export const testData = {
  users: {
    demo: {
      email: 'demo@example.com',
      password: 'password',
      name: 'Demo User'
    },
    test: {
      email: 'test@example.com',
      password: 'test123',
      name: 'Test User'
    }
  },
  cases: {
    sample: {
      title: 'Test Case for E2E',
      description: 'This is a test case created during E2E testing',
      client: 'Test Client',
      priority: 'medium',
      status: 'active'
    }
  },
  appointments: {
    sample: {
      title: 'Test Appointment',
      clientName: 'Test Client',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      duration: 60,
      notes: 'Test appointment notes'
    }
  }
};

/**
 * Common selectors
 */
export const selectors = {
  // Navigation
  navDashboard: 'nav a[href="/dashboard"]',
  navCases: 'nav a[href="/cases"]',
  navAppointments: 'nav a[href="/appointments"]',
  navLogin: 'nav a[href="/login"]',
  navRegister: 'nav a[href="/register"]',
  
  // Auth forms
  loginForm: 'form[data-testid="login-form"]',
  registerForm: 'form[data-testid="register-form"]',
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  nameInput: 'input[name="name"]',
  submitButton: 'button[type="submit"]',
  
  // Case management
  caseForm: 'form[data-testid="case-form"]',
  caseTitleInput: 'input[name="title"]',
  caseDescriptionTextarea: 'textarea[name="description"]',
  caseClientInput: 'input[name="client"]',
  casePrioritySelect: 'select[name="priority"]',
  caseStatusSelect: 'select[name="status"]',
  createCaseButton: 'button:has-text("Create Case")',
  
  // Appointment management
  appointmentForm: 'form[data-testid="appointment-form"]',
  appointmentTitleInput: 'input[name="title"]',
  appointmentClientInput: 'input[name="clientName"]',
  appointmentDateInput: 'input[type="date"]',
  appointmentTimeInput: 'input[type="time"]',
  appointmentDurationInput: 'input[name="duration"]',
  createAppointmentButton: 'button:has-text("Create Appointment")',
  
  // AI Assistant
  aiAssistantButton: 'button:has-text("🤖")',
  aiAssistantPanel: '[data-testid="ai-assistant"]',
  aiChatInput: 'textarea[placeholder*="Ask AI"]',
  aiSendButton: 'button:has-text("Send")',
  aiMessage: '[data-testid="ai-message"]',
  
  // Common UI elements
  loadingSpinner: '[data-testid="loading"]',
  toast: '[data-testid="toast"]',
  modal: '[data-testid="modal"]',
  closeButton: 'button:has-text("✕")',
  
  // Dashboard
  dashboardTitle: 'h1:has-text("Dashboard")',
  statsCard: '[data-testid="stats-card"]',
  recentCasesList: '[data-testid="recent-cases"]',
  upcomingAppointmentsList: '[data-testid="upcoming-appointments"]'
};
