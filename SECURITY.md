# Security Guide for CryptoTracker

This document outlines security best practices and procedures for handling sensitive credentials in the CryptoTracker application.

## Table of Contents

- [Overview](#overview)
- [Firebase Credentials Security](#firebase-credentials-security)
- [Environment Variables Setup](#environment-variables-setup)
- [Service Account Management](#service-account-management)
- [Security Best Practices](#security-best-practices)
- [Incident Response](#incident-response)
- [Credential Rotation](#credential-rotation)

## Overview

CryptoTracker uses Firebase for authentication and database services. Proper handling of Firebase credentials is critical to maintaining the security of the application and user data.

> [!CAUTION]
> **Never commit sensitive credentials to version control.** This includes API keys, service account keys, private keys, and any other authentication tokens.

## Firebase Credentials Security

### What Are Firebase Credentials?

Firebase credentials come in two forms:

1. **Client-side Configuration** (Public)
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID
   
   These are safe to expose in client-side code as they are protected by Firebase Security Rules.

2. **Service Account Keys** (Private - NEVER EXPOSE)
   - Private Key
   - Client Email
   - Private Key ID
   
   These provide full administrative access to your Firebase project and must be kept secure.

### Why Service Account Keys Must Be Protected

Service account keys grant **full administrative access** to your Firebase project, including:
- Reading/writing all data in Firestore
- Managing user accounts
- Accessing Firebase Storage
- Modifying Firebase Security Rules
- Deleting data

**If exposed, an attacker could:**
- Steal all user data
- Delete your entire database
- Impersonate users
- Rack up charges on your Firebase account
- Lock you out of your own project

## Environment Variables Setup

### Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Firebase Client Configuration (Safe for client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Firebase Admin SDK (Server-side only - KEEP SECURE)
# Option 1: JSON string (recommended for production/Vercel)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# Option 2: File path (recommended for local development)
# GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account-key.json
```

### Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Get Firebase Client Configuration:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Click the gear icon → Project settings
   - Scroll to "Your apps" section
   - Copy the configuration values

3. **Set up Service Account (choose one method):**

   **Method A: JSON String (Production/Vercel)**
   - In Firebase Console, go to Project settings → Service accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Minify the JSON (remove whitespace): `cat service-account.json | jq -c`
   - Copy the entire JSON string to `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Delete the downloaded JSON file** or store it securely outside the project

   **Method B: File Path (Local Development)**
   - Download the service account key JSON file
   - Store it in a secure location **outside your project directory**
   - Set `GOOGLE_APPLICATION_CREDENTIALS` to the absolute path
   - Example: `/Users/yourname/.firebase/cryptotracker-service-account.json`

4. **Verify `.env.local` is in `.gitignore`:**
   ```bash
   grep -q "^\.env\*" .gitignore && echo "✓ Protected" || echo "✗ NOT PROTECTED"
   ```

## Service Account Management

### Creating a Service Account

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon → Project settings
4. Go to "Service accounts" tab
5. Click "Generate new private key"
6. Confirm and download the JSON file
7. **Immediately secure the file** - do not leave it in Downloads

### Storing Service Account Keys

> [!IMPORTANT]
> **Never store service account keys in:**
> - Your project directory
> - Version control (Git)
> - Public cloud storage
> - Email or messaging apps
> - Screenshots or documentation

**Recommended storage locations:**

**For Local Development:**
- `~/.firebase/` directory (create if it doesn't exist)
- `~/.config/gcloud/` directory
- Password manager (1Password, LastPass, etc.)

**For Production:**
- Environment variables in your hosting platform (Vercel, Netlify, etc.)
- Secret management services (AWS Secrets Manager, Google Secret Manager)
- Encrypted configuration management (HashiCorp Vault)

### Verifying Service Account Permissions

Your service account should have the minimum necessary permissions:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to IAM & Admin → IAM
4. Find your service account
5. Verify it has only necessary roles (typically "Firebase Admin SDK Administrator Service Agent")

## Security Best Practices

### 1. Use Separate Environments

Create separate Firebase projects for each environment:

- **Development**: For local development and testing
- **Staging**: For pre-production testing
- **Production**: For live application

Each environment should have its own service account with separate credentials.

### 2. Implement Firebase Security Rules

Protect your Firestore database with security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Example: Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Example: Public read, authenticated write
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Enable Firebase App Check

App Check helps protect your Firebase resources from abuse:

1. Go to Firebase Console → App Check
2. Register your app
3. Configure reCAPTCHA or other attestation providers
4. Enforce App Check for your services

### 4. Monitor Firebase Usage

Regularly check for unusual activity:

- Review Firebase Console → Usage and billing
- Set up budget alerts
- Monitor authentication logs
- Check Firestore usage patterns

### 5. Use HTTPS Only

Ensure all Firebase requests use HTTPS:

```typescript
// In your Firebase config
const firebaseConfig = {
  // ... other config
  authDomain: "your-project.firebaseapp.com", // Always HTTPS
};
```

### 6. Implement Rate Limiting

Protect against abuse with rate limiting:

```typescript
// Example using Firebase Functions
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const rateLimitedFunction = functions.https.onCall(async (data, context) => {
  // Implement rate limiting logic
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  
  // Check rate limit in Firestore
  // ... rate limiting logic
});
```

## Incident Response

### If Credentials Are Exposed

> [!CAUTION]
> **Act immediately if you suspect credentials have been exposed!**

**Immediate Actions (within 1 hour):**

1. **Revoke the exposed service account key:**
   - Go to Firebase Console → Project settings → Service accounts
   - Click "Manage service account permissions" → Google Cloud Console
   - Find the exposed key and delete it

2. **Generate a new service account key:**
   - Follow the steps in [Creating a Service Account](#creating-a-service-account)
   - Update your environment variables with the new key

3. **Check for unauthorized access:**
   - Review Firebase Console → Authentication → Users (check for unknown users)
   - Check Firestore for unauthorized data changes
   - Review Firebase Console → Usage (check for unusual spikes)

4. **If credentials were committed to Git:**
   - Remove from Git history using `git-filter-repo` (see below)
   - Force push to remote repository
   - Notify all collaborators to re-clone the repository

**Follow-up Actions (within 24 hours):**

5. **Audit all Firebase resources:**
   - Review all Firestore collections
   - Check Firebase Storage for unauthorized files
   - Review Firebase Functions logs

6. **Update security rules:**
   - Tighten Firestore Security Rules
   - Enable App Check if not already enabled

7. **Monitor for continued abuse:**
   - Set up alerts for unusual activity
   - Monitor for 7-14 days

### Removing Credentials from Git History

If credentials were committed to Git:

```bash
# 1. Install git-filter-repo
brew install git-filter-repo  # macOS
# or
pip install git-filter-repo   # Linux/Windows

# 2. Create a backup
cp -r your-repo your-repo-backup

# 3. Remove the sensitive file from all history
git filter-repo --path path/to/sensitive-file.json --invert-paths --force

# 4. Re-add the remote (filter-repo removes it)
git remote add origin https://github.com/username/repo.git

# 5. Force push (WARNING: This rewrites history)
git push origin --force --all
git push origin --force --tags

# 6. Notify collaborators to re-clone the repository
```

> [!WARNING]
> **Force pushing rewrites Git history.** All collaborators must delete their local copies and re-clone the repository.

## Credential Rotation

### When to Rotate Credentials

Rotate service account keys:

- **Regularly**: Every 90 days as a best practice
- **After exposure**: Immediately if credentials are exposed
- **After team changes**: When team members leave
- **After security incidents**: As part of incident response

### How to Rotate Credentials

1. **Generate a new service account key** (keep the old one active)
2. **Update production environment** with the new key
3. **Verify the application works** with the new key
4. **Update all other environments** (staging, development)
5. **Delete the old service account key**
6. **Document the rotation** (date, reason, who performed it)

### Rotation Checklist

```markdown
- [ ] Generate new service account key
- [ ] Update production environment variables
- [ ] Test production application
- [ ] Update staging environment
- [ ] Test staging application
- [ ] Update development environment
- [ ] Update team documentation
- [ ] Delete old service account key
- [ ] Verify old key is revoked
- [ ] Update password manager/secret storage
- [ ] Document rotation in security log
```

## Additional Resources

- [Firebase Security Documentation](https://firebase.google.com/docs/rules)
- [Firebase Security Checklist](https://firebase.google.com/support/guides/security-checklist)
- [Google Cloud Security Best Practices](https://cloud.google.com/security/best-practices)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## Questions or Concerns?

If you have questions about security practices or suspect a security issue:

1. **Do not** discuss sensitive details in public channels
2. Contact the project maintainer directly
3. Follow the incident response procedures above
4. Document all actions taken

---

**Last Updated**: December 17, 2025  
**Version**: 1.0.0
