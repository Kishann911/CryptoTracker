// Test script to verify user data in Firestore
// Run this script to check if user data is being stored correctly

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, getDoc } = require('firebase/firestore');

// Firebase configuration (use the same as your app)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-auth-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-storage-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "demo-messaging-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Function to check user data
async function checkUserData(userId) {
  try {
    const userDoc = doc(collection(db, 'users'), userId);
    const userSnapshot = await getDoc(userDoc);
    
    if (userSnapshot.exists()) {
      console.log('User data found:');
      console.log(JSON.stringify(userSnapshot.data(), null, 2));
    } else {
      console.log('No user data found for ID:', userId);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

// Check the specific user ID you mentioned
checkUserData('0sEv6k6Kg1EUbMJYtkPz');

// Also check all users (be careful with this in production)
async function listAllUsers() {
  try {
    const usersCollection = collection(db, 'users');
    // Note: This is a simplified example. In production, you'd want to use pagination
    console.log('To list all users, you would implement a query here');
  } catch (error) {
    console.error('Error listing users:', error);
  }
}