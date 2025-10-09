import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-auth-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-storage-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "demo-messaging-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app-id",
};

// Check if we're using demo values and log a warning
if (firebaseConfig.apiKey === "demo-api-key") {
  console.warn("⚠️  Using demo Firebase configuration. Please update your .env.local file with actual Firebase credentials.");
  console.warn("⚠️  See FIREBASE_SETUP.md for detailed instructions.");
}

// Check if we're using placeholder values from .env.example
const placeholderValues = [
  "your_firebase_api_key",
  "your_firebase_auth_domain", 
  "your_firebase_project_id",
  "your_firebase_storage_bucket",
  "your_firebase_messaging_sender_id",
  "your_firebase_app_id"
];

const hasPlaceholderValues = placeholderValues.some(placeholder => 
  Object.values(firebaseConfig).some(value => value.includes(placeholder))
);

if (hasPlaceholderValues) {
  console.error("❌ Firebase configuration contains placeholder values. Please update your .env.local file with actual Firebase credentials from your Firebase Console.");
  console.error("❌ See FIREBASE_SETUP.md for detailed setup instructions.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;