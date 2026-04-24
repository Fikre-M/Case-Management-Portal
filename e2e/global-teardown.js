/**
 * Global teardown for Playwright E2E tests
 * 
 * This runs once after all tests and cleans up the test environment
 */

async function globalTeardown(config) {
  console.log('🧹 Cleaning up E2E test environment...');
  
  // You can add cleanup logic here such as:
  // - Dropping test databases
  // - Removing test users
  // - Clearing test data
  
  console.log('✅ E2E test environment cleaned up');
}

export default globalTeardown;
