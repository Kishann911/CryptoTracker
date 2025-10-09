// Script to populate mock users and portfolios in Firestore
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use dynamic import for Firebase Admin
let admin;

async function populateMockUsers() {
  try {
    // Dynamically import Firebase Admin
    const firebaseAdminModule = await import('firebase-admin');
    admin = firebaseAdminModule.default;
    
    // Initialize Firebase Admin with service account credentials from environment variables
    if (!admin.apps.length) {
      try {
        // Try to initialize with service account credentials if available
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
          console.log('Initializing Firebase with service account key from environment variable...');
          try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
              projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
            console.log('Firebase Admin initialized with service account credentials from FIREBASE_SERVICE_ACCOUNT_KEY');
          } catch (parseError) {
            console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', parseError);
            throw parseError;
          }
        } 
        // Try to initialize with application default credentials
        else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          console.log('Initializing Firebase with GOOGLE_APPLICATION_CREDENTIALS...');
          // Resolve the path relative to the project root
          const credentialsPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
          if (fs.existsSync(credentialsPath)) {
            process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
            admin.initializeApp({
              credential: admin.credential.applicationDefault(),
              projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
            console.log('Firebase Admin initialized with application default credentials');
          } else {
            throw new Error(`Service account file not found at: ${credentialsPath}`);
          }
        }
        // Fallback to default initialization (may work in some environments)
        else {
          console.log('No service account credentials found. Initializing Firebase with default settings...');
          admin.initializeApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mock-project-id',
          });
          console.log('Firebase Admin initialized with default settings (limited functionality)');
          console.log('To enable full Firebase functionality, please set up service account credentials.');
          console.log('Run "npm run setup-service-account" for instructions.');
        }
      } catch (initError) {
        console.error('Firebase Admin initialization error:', initError.message);
        console.log('Attempting to initialize without credentials...');
        try {
          admin.initializeApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mock-project-id',
          });
          console.log('Firebase Admin initialized with basic settings (limited functionality)');
          console.log('To enable full Firebase functionality, please set up service account credentials.');
          console.log('Run "npm run setup-service-account" for instructions.');
        } catch (fallbackError) {
          console.error('Fallback initialization failed:', fallbackError.message);
          process.exit(1);
        }
      }
    }

    const db = admin.firestore();

    // Read mock users from JSON file
    const mockUsersPath = path.join(__dirname, '..', 'mock-users.json');
    const mockUsersData = fs.readFileSync(mockUsersPath, 'utf8');
    const mockUsers = JSON.parse(mockUsersData);

    console.log(`Populating ${mockUsers.length} mock users...`);

    // Check if we can access Firestore
    try {
      // Test Firestore connection
      await db.collection('test').limit(1).get();
      console.log('Firestore connection successful!');
    } catch (testError) {
      console.warn('⚠️  Firestore connection test failed:', testError.message);
      console.log('You can still use the application with mock data in the frontend.');
      console.log('To enable Firebase integration, please set up service account credentials.');
      console.log('Run "npm run setup-service-account" for instructions.');
      return;
    }

    // Add each user to Firestore
    let successCount = 0;
    for (const user of mockUsers) {
      try {
        // Separate user data from portfolio data
        const { portfolio, ...userData } = user;
        
        // Add user to 'users' collection
        await db.collection('users').doc(user.uid).set({
          ...userData,
          createdAt: admin.firestore.Timestamp.fromDate(new Date(userData.createdAt)),
          lastLogin: admin.firestore.Timestamp.fromDate(new Date(userData.lastLogin))
        });
        
        // Add portfolio to 'portfolios' collection
        if (portfolio) {
          await db.collection('portfolios').doc(user.uid).set({
            ...portfolio,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
        
        console.log(`✓ Added user: ${user.name} (${user.uid})`);
        successCount++;
      } catch (error) {
        console.error(`✗ Error adding user ${user.name}:`, error.message);
      }
    }

    console.log(`\n✅ Successfully added ${successCount} out of ${mockUsers.length} users to Firebase!`);
    console.log('\nTo verify the data:');
    console.log('1. Go to Firebase Console > Firestore Database');
    console.log('2. You should see "users" and "portfolios" collections');
    console.log('3. The dashboard will now use real data from Firebase instead of mock data');
    
  } catch (error) {
    console.error('Error populating mock users:', error.message);
    console.log('\nDon\'t worry! The application will continue to work with mock data in the frontend.');
    console.log('To enable Firebase integration, please set up service account credentials.');
    console.log('Run "npm run setup-service-account" for instructions.');
  }
}

// Run the script if called directly
if (process.argv[1] && process.argv[1].endsWith('populate-mock-users.js')) {
  populateMockUsers();
}

export { populateMockUsers };