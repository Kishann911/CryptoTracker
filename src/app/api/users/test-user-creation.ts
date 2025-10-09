/**
 * Test function to demonstrate how to call the user creation API endpoint
 * This is not an API route, but a utility function for testing
 */

// Example usage of the POST endpoint
const createUserExample = async () => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@example.com',
        name: 'John Doe',
        walletAddress: '0x1234567890123456789012345678901234567890'
      }),
    });

    const result = await response.json();
    console.log('User creation result:', result);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

export default createUserExample;