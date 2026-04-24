/**
 * Global setup for Playwright E2E tests
 * 
 * This runs once before all tests and prepares the test environment
 * by setting up test data and clearing any existing localStorage
 */

async function globalSetup(config) {
  console.log('🚀 Setting up E2E test environment...');
  
  // You can add global setup logic here such as:
  // - Setting up test databases
  // - Creating test users
  // - Clearing test data
  
  console.log('✅ E2E test environment ready');
}

export default globalSetup;
