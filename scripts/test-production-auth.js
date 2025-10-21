const https = require('https');

async function testProductionAuth() {
  const baseUrl = 'https://eduexpressint.com';
  
  console.log('Testing production authentication...');
  
  try {
    // First, try to initialize admin user
    console.log('1. Initializing admin user...');
    const initResponse = await fetch(`${baseUrl}/api/init-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const initData = await initResponse.json();
    console.log('Init admin response:', initData);
    
    // Then try to login
    console.log('2. Testing login...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@eduexpressint.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response status:', loginResponse.status);
    console.log('Login response:', loginData);
    
    if (loginResponse.ok && loginData.token) {
      // Test admin dashboard access
      console.log('3. Testing admin dashboard access...');
      const dashboardResponse = await fetch(`${baseUrl}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Dashboard response status:', dashboardResponse.status);
      const dashboardData = await dashboardResponse.json();
      console.log('Dashboard response:', dashboardData);
    }
    
  } catch (error) {
    console.error('Error testing production auth:', error);
  }
}

testProductionAuth();
