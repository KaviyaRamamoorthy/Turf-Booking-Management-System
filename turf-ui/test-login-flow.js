// Test script to verify login flow and token storage
// Run this in the browser console after the app is loaded

console.log('=== Testing Login Flow ===');

// Test 1: Check if localStorage utilities work
console.log('1. Testing localStorage utilities...');
console.log('Current token:', localStorage.getItem('access_token'));
console.log('Current user data:', localStorage.getItem('userData'));

// Test 2: Simulate login API call
console.log('2. Testing login API call...');

const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'password123'
      })
    });

    if (response.ok) {
      const responseData = await response.json(); // Login returns JSON object
      console.log('Login response:', responseData);
      
      if (responseData.success && responseData.data) {
        const token = responseData.data;
        console.log('Login successful, token received:', token.substring(0, 20) + '...');
        
        // Store token
        localStorage.setItem('access_token', token);
      console.log('Token stored in localStorage');
      
      // Test API call with token
      console.log('3. Testing API call with token...');
      const userResponse = await fetch('http://localhost:8080/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('User data retrieved:', userData);
        
        // Store user data
        localStorage.setItem('userData', JSON.stringify({
          id: userData.id,
          email: userData.email,
          name: userData.fullName || userData.email.split('@')[0],
          role: userData.role?.toLowerCase() || 'customer',
        }));
        console.log('User data stored in localStorage');
      } else {
        console.error('Failed to get user data:', userResponse.status);
      }
          } else {
        console.error('Login failed:', responseData.message);
      }
    } else {
      console.error('Login failed:', response.status);
      const errorText = await response.text();
      console.error('Error details:', errorText);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testLogin();

console.log('=== Test completed ==='); 