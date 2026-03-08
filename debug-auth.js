// Debug script to check localStorage contents
// Run this in browser console to see stored users

console.log('=== Auth Debug Info ===');

// Check stored users
const users = localStorage.getItem('ai_casemanager_users');
console.log('Stored users:', users ? JSON.parse(users) : 'None');

// Check current user
const currentUser = localStorage.getItem('ai_casemanager_current_user');
console.log('Current user:', currentUser ? JSON.parse(currentUser) : 'None');

// Check auth token (from authService)
const authToken = localStorage.getItem('authToken');
console.log('Auth token:', authToken ? 'Present' : 'None');

console.log('=== End Debug ===');
