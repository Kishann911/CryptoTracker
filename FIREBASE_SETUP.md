# Firebase Setup Guide

This guide explains how to set up Firebase for the CryptoTracker application.

## Prerequisites

1. A Google account
2. Node.js installed on your development machine

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "CryptoTracker")
4. Accept the terms and conditions
5. Choose whether to enable Google Analytics (optional)
6. Click "Create project"

## Step 2: Register Your Web App

1. In the Firebase Console, click the "Web" icon to create a new web app
2. Enter an app nickname (e.g., "CryptoTracker Web")
3. Optionally, set up Firebase Hosting (you can skip this for now)
4. Click "Register app"
5. Copy the Firebase configuration object - you'll need this for your `.env.local` file

## Step 3: Enable Authentication Methods

1. In the Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable the following sign-in providers:
   - Email/Password
   - Google
3. For Google sign-in, you may need to provide your project's support email

## Step 4: Set Up Firestore Database

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development only)
4. Select a location for your database
5. Click "Enable"

## Step 5: Create Service Account for Admin SDK

For server-side operations, you'll need to set up a service account:

1. In the Firebase Console, click the gear icon next to "Project Overview" and select "Project settings"
2. Go to the "Service accounts" tab
3. Under "Firebase Admin SDK", click "Generate new private key"
4. This will download a JSON file with your service account credentials
5. **Important**: Keep this file secure and never commit it to version control

## Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Firebase configuration:
   ```env
   # Firebase Client Configuration (from Step 2)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # WalletConnect Project ID (get from https://cloud.reown.com/)
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

   # Firebase Service Account (for server-side operations)
   # Option 1: Set individual environment variables
   # FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your_project_id",...}

   # Option 2: Point to a service account key file (recommended for development)
   # GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json
   ```

## Step 7: Set Up Service Account Credentials

For server-side Firebase operations, you have two options:

### Option 1: Environment Variable (Recommended for production)
1. Copy the entire contents of your service account JSON file
2. Set it as the `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable in `.env.local`:
   ```env
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your_project_id",...}
   ```

### Option 2: Service Account Key File (Recommended for development)
1. Save your service account JSON file in a secure location outside your project directory
2. Set the path to this file in `.env.local`:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/your/service-account-key.json
   ```

## Security Best Practices

1. **Never commit credentials to version control**
   - The `.gitignore` file is configured to exclude service account files
   - Always use environment variables for sensitive data

2. **Use different projects for development and production**
   - Create separate Firebase projects for development, staging, and production
   - Use different service accounts for each environment

3. **Regularly rotate credentials**
   - Generate new private keys periodically
   - Revoke compromised or unused keys immediately

4. **Limit permissions**
   - Only grant necessary permissions to your service accounts
   - Use Firebase Security Rules to restrict database access

## Troubleshooting

### Authentication Errors
If you see authentication errors:
1. Verify all Firebase configuration values in `.env.local`
2. Ensure you've enabled the required authentication providers in Firebase Console
3. Check that your Firebase project's API key restrictions (if any) allow your domain

### Database Errors
If you see Firestore errors:
1. Verify that you've created a Firestore database in your Firebase project
2. Check that your service account has the necessary permissions
3. Ensure your Firestore Security Rules allow the required read/write operations

### Service Account Errors
If you see service account errors:
1. Verify that you've created a service account and downloaded the key file
2. Check that the `GOOGLE_APPLICATION_CREDENTIALS` environment variable points to the correct file
3. Ensure the service account has the necessary Firebase Admin permissions

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)