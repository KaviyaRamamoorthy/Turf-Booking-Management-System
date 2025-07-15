// Simple test script to verify API integration
// Run this in the browser console after starting both frontend and backend

console.log('Testing API Integration...');

// Test 1: Check if localStorage utility is available
console.log('Test 1: localStorage utility');
if (typeof window !== 'undefined') {
  // Import the utility (this would need to be done in the actual app)
  console.log('localStorage utility should be available in the app');
} else {
  console.log('Not in browser environment');
}

// Test 2: Check API configuration
console.log('Test 2: API Configuration');
const API_BASE_URL = 'http://localhost:8080/api';
console.log('API Base URL:', API_BASE_URL);

// Test 3: Test backend connectivity
console.log('Test 3: Backend Connectivity');
fetch(`${API_BASE_URL}/categories`)
  .then(response => {
    console.log('Backend is reachable:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Categories response:', data);
  })
  .catch(error => {
    console.error('Backend connectivity test failed:', error);
  });

// Test 4: Test login endpoint (without credentials)
console.log('Test 4: Login Endpoint');
fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'testpassword'
  })
})
.then(response => {
  console.log('Login endpoint response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Login endpoint response:', data);
})
.catch(error => {
  console.error('Login endpoint test failed:', error);
});

console.log('API Integration tests completed. Check console for results.'); 