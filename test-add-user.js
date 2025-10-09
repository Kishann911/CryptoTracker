// Test script to add user data to Firestore
// Save this as test-add-user.js in your project root and run with: node test-add-user.js

const addUserToFirestore = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        walletAddress: '0x1234567890123456789012345678901234567890'
      }),
    });

    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Run the function
addUserToFirestore();