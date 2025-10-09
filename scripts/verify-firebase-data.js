#!/usr/bin/env node

// Script to verify if mock data was added to Firebase

import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
config({ path: path.resolve(__dirname, '../.env.local') });

async function verifyFirebaseData() {
  try {
    // Dynamically import Firebase Admin
    const firebaseAdminModule = await import('firebase-admin');
    const admin = firebaseAdminModule.default;
    
    // Initialize Firebase Admin
    if (!admin.apps.length) {
      try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
          const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          });
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          });
        } else {
          admin.initializeApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mock-project-id',
          });
        }
      } catch (initError) {
        console.log('Firebase Admin initialization failed:', initError.message);
        console.log('Please set up Firebase credentials to verify data.');
        return;
      }
    }

    const db = admin.firestore();
    
    console.log('Checking Firebase data...\n');
    
    // Check users collection
    try {
      const usersSnapshot = await db.collection('users').get();
      console.log(`Users collection: ${usersSnapshot.size} documents found`);
      
      if (usersSnapshot.size > 0) {
        console.log('Sample users:');
        usersSnapshot.docs.slice(0, 3).forEach(doc => {
          const data = doc.data();
          console.log(`  - ${data.name} (${doc.id})`);
        });
        if (usersSnapshot.size > 3) {
          console.log(`  ... and ${usersSnapshot.size - 3} more users`);
        }
      }
    } catch (error) {
      console.log('Error accessing users collection:', error.message);
    }
    
    // Check portfolios collection
    try {
      const portfoliosSnapshot = await db.collection('portfolios').get();
      console.log(`\nPortfolios collection: ${portfoliosSnapshot.size} documents found`);
      
      if (portfoliosSnapshot.size > 0) {
        console.log('Sample portfolios:');
        portfoliosSnapshot.docs.slice(0, 3).forEach(doc => {
          const data = doc.data();
          console.log(`  - Portfolio for user ${doc.id} with ${data.holdings ? Object.keys(data.holdings).length : 0} assets`);
        });
        if (portfoliosSnapshot.size > 3) {
          console.log(`  ... and ${portfoliosSnapshot.size - 3} more portfolios`);
        }
      }
    } catch (error) {
      console.log('Error accessing portfolios collection:', error.message);
    }
    
    console.log('\nVerification complete!');
    
  } catch (error) {
    console.error('Error verifying Firebase data:', error.message);
    console.log('Please ensure Firebase is properly configured.');
  }
}

// Run the script if called directly
if (process.argv[1] && process.argv[1].endsWith('verify-firebase-data.js')) {
  verifyFirebaseData();
}

export { verifyFirebaseData };