// Test what API access is available with Business plan
const RETOOL_API_TOKEN = 'retool_01k1hkjwz56dnjxbzgcpwcecg5';
const BASE_URL = 'https://api.retool.com/api/v2';

async function testAPIAccess() {
  const headers = {
    'Authorization': `Bearer ${RETOOL_API_TOKEN}`,
    'Content-Type': 'application/json'
  };

  console.log('Testing Retool API access with Business plan...\n');

  // Test 1: List users
  try {
    console.log('1. Testing user list endpoint...');
    const response = await fetch(`${BASE_URL}/users`, { headers });
    const result = await response.json();
    console.log('Users endpoint:', response.status === 200 ? '✅ Accessible' : '❌ Not accessible');
    if (response.status !== 200) console.log('   Response:', result);
  } catch (error) {
    console.log('Users endpoint: ❌ Error:', error.message);
  }

  // Test 2: User invites
  try {
    console.log('\n2. Testing user invites endpoint...');
    const response = await fetch(`${BASE_URL}/user-invites`, { headers });
    const result = await response.json();
    console.log('User invites endpoint:', response.status === 200 ? '✅ Accessible' : '❌ Not accessible');
    if (response.status !== 200) console.log('   Response:', result);
  } catch (error) {
    console.log('User invites endpoint: ❌ Error:', error.message);
  }

  // Test 3: Custom components (already know this fails)
  console.log('\n3. Custom components endpoint: ❌ Requires Enterprise plan');

  console.log('\n---\nSince custom components API requires Enterprise plan, you\'ll need to create the UI manually in Retool.');
  console.log('\nHere\'s what you can do:');
  console.log('1. Use Retool\'s built-in components (Container, Text, Button, etc.)');
  console.log('2. Use the Custom Component (single) that allows inline React code');
  console.log('3. Use HTML components with custom styling');
  console.log('\nI can help you build the LocalBrain UI using these built-in components instead.');
}

testAPIAccess();