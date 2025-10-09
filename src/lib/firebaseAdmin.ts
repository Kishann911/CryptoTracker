import * as admin from 'firebase-admin';

let initialized = false;

// Initialize Firebase Admin SDK
if (!admin.apps.length && !initialized) {
  try {
    // Try to initialize with service account credentials if available
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
        console.log('Firebase Admin initialized with service account credentials');
        initialized = true;
      } catch (parseError) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', parseError);
      }
    } 
    
    // Try to initialize with application default credentials
    if (!initialized && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      try {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
        console.log('Firebase Admin initialized with application default credentials');
        initialized = true;
      } catch (credError) {
        console.error('Failed to initialize with GOOGLE_APPLICATION_CREDENTIALS:', credError);
      }
    }
    
    // Fallback for development - initialize with default settings
    if (!initialized) {
      try {
        // Try to initialize with default credentials (may work in some environments)
        admin.initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
        console.warn('Firebase Admin initialized without explicit credentials. Some operations may fail.');
        console.warn('For full functionality, set up service account credentials.');
        console.warn('See FIREBASE_SETUP.md for instructions.');
        initialized = true;
      } catch (defaultError) {
        console.error('Failed to initialize Firebase Admin with default settings:', defaultError);
      }
    }
  } catch (error) {
    console.error('Critical error initializing Firebase Admin SDK:', error);
    console.error('This will cause issues with server-side Firebase operations.');
    console.error('See FIREBASE_SETUP.md for proper setup instructions.');
  }
  
  // Final check
  if (!initialized) {
    console.error('Firebase Admin SDK failed to initialize properly!');
    console.error('Server-side Firebase operations will not work.');
  }
}

// Export a function to check if Firebase Admin is properly initialized
export const isFirebaseAdminInitialized = () => {
  return initialized && admin.apps.length > 0;
};

export { admin };