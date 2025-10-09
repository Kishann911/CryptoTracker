#!/usr/bin/env node

// Script to validate Firebase configuration
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Firebase configuration...\n');

// Check if .env.local file exists
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.error('❌ .env.local file not found!');
  console.log('   Please create a .env.local file by copying .env.example:');
  console.log('   cp .env.example .env.local\n');
  process.exit(1);
}

// Read .env.local file
const envContent = fs.readFileSync(envLocalPath, 'utf8');

// Check for placeholder values
const placeholders = [
  'your_actual_firebase_api_key_here',
  'your_firebase_api_key',
  'your_project_id',
  'your_messaging_sender_id',
  'your_app_id',
  'your_walletconnect_project_id_here'
];

let hasPlaceholders = false;
placeholders.forEach(placeholder => {
  if (envContent.includes(placeholder)) {
    console.error(`❌ Found placeholder value: ${placeholder}`);
    hasPlaceholders = true;
  }
});

if (hasPlaceholders) {
  console.log('\n🔧 Please replace all placeholder values in .env.local with your actual credentials:');
  console.log('   1. Get Firebase credentials from your Firebase Console');
  console.log('   2. Get WalletConnect Project ID from https://cloud.reown.com/');
  console.log('   3. Update .env.local with these values');
  console.log('   4. Restart your development server\n');
  console.log('   For detailed instructions, see FIREBASE_SETUP.md\n');
  process.exit(1);
}

// Check for actual values (basic validation)
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

let missingVars = [];
requiredVars.forEach(varName => {
  const regex = new RegExp(`${varName}\\s*=\\s*(.*)`);
  const match = envContent.match(regex);
  
  if (!match || !match[1] || match[1].trim() === '') {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.log('\n   Please ensure all required variables are set in .env.local\n');
  console.log('   For detailed instructions, see FIREBASE_SETUP.md\n');
  process.exit(1);
}

// Check for service account credentials
const hasServiceAccountKey = envContent.includes('FIREBASE_SERVICE_ACCOUNT_KEY');
const hasGoogleCreds = envContent.includes('GOOGLE_APPLICATION_CREDENTIALS');

if (!hasServiceAccountKey && !hasGoogleCreds) {
  console.warn('⚠️  Warning: No Firebase service account credentials found.');
  console.warn('   This may cause issues with server-side operations.');
  console.warn('   For full functionality, set up service account credentials.');
  console.warn('   See FIREBASE_SETUP.md for instructions.\n');
}

console.log('✅ Firebase configuration appears to be valid!');
console.log('   Note: This script only checks for obvious issues.');
console.log('   Make sure your actual Firebase credentials are correct.');
console.log('   See FIREBASE_SETUP.md for detailed setup instructions.\n');