// Test script to debug /users/me endpoint
const testUsersMeEndpoint = async () => {
  try {
    console.log('1. Testing login first...');
    
    // Step 1: Login to get token
    const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      console.error('Login failed:', loginResponse.status, loginResponse.statusText);
      const errorData = await loginResponse.text();
      console.error('Error details:', errorData);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (!loginData.success || !loginData.data) {
      console.error('Login failed - no token received');
      return;
    }

    const token = loginData.data;
    console.log('Token received:', token.substring(0, 20) + '...');
    
    // Step 2: Test /users/me endpoint
    console.log('2. Testing /users/me endpoint...');
    
    const userResponse = await fetch('http://localhost:8080/api/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('User response status:', userResponse.status);
    console.log('User response headers:', Object.fromEntries(userResponse.headers.entries()));

    if (!userResponse.ok) {
      console.error('Failed to get user data:', userResponse.status, userResponse.statusText);
      const errorData = await userResponse.text();
      console.error('Error details:', errorData);
      return;
    }

    const userData = await userResponse.json();
    console.log('User data retrieved successfully:', userData);
    
    // Step 3: Test with different token format
    console.log('3. Testing with different token format...');
    
    const userResponse2 = await fetch('http://localhost:8080/api/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('User response 2 status:', userResponse2.status);
    
    if (userResponse2.ok) {
      const userData2 = await userResponse2.json();
      console.log('User data 2:', userData2);
    } else {
      const errorData2 = await userResponse2.text();
      console.error('Error details 2:', errorData2);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testUsersMeEndpoint(); 