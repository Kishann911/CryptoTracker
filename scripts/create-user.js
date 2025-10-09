// Script to create a user in Firestore using the client SDK

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Function to create a user
async function createUser(userId, userData) {
  try {
    await setDoc(doc(db, 'users', userId), userData);
    console.log('User created successfully with ID:', userId);
    return true;
  } catch (error) {
    console.error('Error creating user:', error);
    return false;
  }
}

// Create a user with the specific ID if this script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const userData = {
    email: 'test@example.com',
    name: 'Test User',
    walletAddress: '',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    preferences: {
      currency: 'USD',
      theme: 'dark',
      notifications: true
    }
  };
  
  createUser('0sEv6k6Kg1EUbMJYtkPz', userData);
}

// Export for use in other modules
export { createUser };