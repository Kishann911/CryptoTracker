// Script to list all users in Firestore using the client SDK
// This can be used as an alternative to the server-side API endpoints

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, limit } from 'firebase/firestore';

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

// Function to list users
async function listUsers() {
  try {
    // Create a query against the collection
    const q = query(collection(db, 'users'), limit(100));
    const querySnapshot = await getDocs(q);
    
    console.log(`Found ${querySnapshot.size} users:`);
    
    querySnapshot.forEach((doc) => {
      console.log('---');
      console.log('User ID:', doc.id);
      console.log('User Data:', doc.data());
    });
    
    if (querySnapshot.empty) {
      console.log('No users found in the database');
    }
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Error listing users:', error);
    return 0;
  }
}

// List all users if this script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  listUsers();
}

// Export for use in other modules
export { listUsers };