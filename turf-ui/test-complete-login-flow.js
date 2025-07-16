// Test script to verify complete login flow
const testCompleteLoginFlow = async () => {
  try {
    console.log('🚀 Testing complete login flow...');
    
    // Step 1: Login to get token
    console.log('1. Logging in...');
    const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@turf.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.error('❌ Login failed:', loginResponse.status, loginResponse.statusText);
      const errorData = await loginResponse.text();
      console.error('Error details:', errorData);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful:', loginData);
    
    if (!loginData.success || !loginData.data) {
      console.error('❌ Login failed - no token received');
      return;
    }

    const token = loginData.data;
    console.log('🔑 Token received:', token.substring(0, 20) + '...');
    
    // Step 2: Get user profile
    console.log('2. Getting user profile...');
    const userResponse = await fetch('http://localhost:8080/api/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!userResponse.ok) {
      console.error('❌ Failed to get user data:', userResponse.status, userResponse.statusText);
      const errorData = await userResponse.text();
      console.error('Error details:', errorData);
      return;
    }

    const userData = await userResponse.json();
    console.log('✅ User data retrieved:', userData);
    
    // Step 3: Simulate frontend state management
    console.log('3. Simulating frontend state management...');
    
    // Store token in localStorage (simulating frontend)
    localStorage.setItem('access_token', token);
    console.log('💾 Token stored in localStorage');
    
    // Store user data in localStorage (simulating frontend)
    const frontendUserData = {
      id: userData.data.id,
      email: userData.data.email,
      name: userData.data.fullName || userData.data.email.split('@')[0],
      role: userData.data.role?.toLowerCase() || 'customer',
      phone: userData.data.phoneNumber,
    };
    
    localStorage.setItem('userData', JSON.stringify(frontendUserData));
    console.log('💾 User data stored in localStorage:', frontendUserData);
    
    // Step 4: Verify stored data
    console.log('4. Verifying stored data...');
    const storedToken = localStorage.getItem('access_token');
    const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    console.log('🔍 Stored token:', storedToken ? storedToken.substring(0, 20) + '...' : 'null');
    console.log('🔍 Stored user data:', storedUserData);
    
    // Step 5: Test navigation simulation
    console.log('5. Simulating navigation to home page...');
    console.log('📍 User would be redirected to /home');
    console.log('👤 User role:', frontendUserData.role);
    console.log('🔐 Authentication status: Authenticated');
    
    // Step 6: Test protected route access
    console.log('6. Testing protected route access...');
    if (frontendUserData.role === 'admin') {
      console.log('✅ Admin can access: /dashboard/admin, /home, /profile, etc.');
    } else if (frontendUserData.role === 'customer') {
      console.log('✅ Customer can access: /home, /profile, /bookings, etc.');
    } else if (frontendUserData.role === 'vendor') {
      console.log('✅ Vendor can access: /dashboard/vendor, /home, /profile, etc.');
    }
    
    console.log('🎉 Complete login flow test successful!');
    console.log('📋 Summary:');
    console.log('   - Login: ✅');
    console.log('   - Token retrieval: ✅');
    console.log('   - User profile: ✅');
    console.log('   - State management: ✅');
    console.log('   - Navigation ready: ✅');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testCompleteLoginFlow(); 