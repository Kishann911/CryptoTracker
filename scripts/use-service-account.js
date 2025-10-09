#!/usr/bin/env node

// Script to help set up Firebase service account credentials
// This script will guide you on how to use the service account key file

console.log('=== Firebase Service Account Setup Guide ===\n');

console.log('1. First, generate a service account key file from Firebase Console:');
console.log('   - Go to Firebase Console (https://console.firebase.google.com/)');
console.log('   - Select your project');
console.log('   - Click the gear icon (Project Settings)');
console.log('   - Go to the "Service accounts" tab');
console.log('   - Click "Generate new private key"');
console.log('   - Save the JSON file (e.g., as "firebase-service-account.json")\n');

console.log('2. Place the service account file in your project root directory\n');

console.log('3. Update your .env.local file with one of these options:\n');

console.log('   Option A - Reference the file path:');
console.log('   GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json\n');

console.log('   Option B - Copy the contents to .env.local (recommended):');
console.log('   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}\n');

console.log('4. After updating .env.local, restart your development server:');
console.log('   npm run dev\n');

console.log('5. Run the populate script to add mock data to Firebase:');
console.log('   node scripts/populate-mock-users.js\n');

console.log('For detailed instructions, see FIREBASE_CREDENTIALS_SETUP.md');