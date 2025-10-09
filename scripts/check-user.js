// Script to check if a user exists in Firestore using the client SDK
// This can be used as an alternative to the server-side API endpoints

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

// Function to check if a user exists
async function checkUserExists(userId) {
  try {
    const userDoc = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDoc);
    
    if (userSnapshot.exists()) {
      console.log('User found:');
      console.log('User ID:', userSnapshot.id);
      console.log('User Data:', userSnapshot.data());
      return true;
    } else {
      console.log('User not found with ID:', userId);
      return false;
    }
  } catch (error) {
    console.error('Error checking user:', error);
    return false;
  }
}

// Check the specific user ID if this script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkUserExists('0sEv6k6Kg1EUbMJYtkPz');
}

// Export for use in other modules
export { checkUserExists };