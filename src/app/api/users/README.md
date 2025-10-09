# User API Endpoints

This directory contains API endpoints for managing user data in Firestore.

## Available Endpoints

### POST /api/users
Creates or updates a user with a specific ID (`0sEv6k6Kg1EUbMJYtkPz`).

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "walletAddress": "0x1234..." // optional
}
```

### POST /api/users/create
Creates a new user with an auto-generated ID.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "walletAddress": "0x1234..." // optional
}
```

### PUT /api/users/update
Updates an existing user's profile information.

**Request Body:**
```json
{
  "uid": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "notifications": true
}
```

### GET /api/users/[uid]
Fetches a specific user's data by their UID.

### GET /api/users/list
Lists all users (limited to 100 for performance).

## User Data Structure

The user documents in Firestore follow this structure:
- `email` (string, optional)
- [name](file:///Users/kishann/Documents/sem-3_sprint-1/crpto-app/src/app/alerts/page.tsx#L7-L7) (string, optional)
- `walletAddress` (string, required)
- `createdAt` (timestamp)
- `lastLogin` (timestamp)
- `preferences` (object)
  - `currency` (string, default: "USD")
  - `theme` (string, default: "dark")
  - `notifications` (boolean, default: true)

## Firebase Admin Setup

These API endpoints require Firebase Admin SDK to be properly configured with service account credentials.

See [FIREBASE_ADMIN_SETUP.md](../../../../FIREBASE_ADMIN_SETUP.md) for detailed instructions on setting up Firebase Admin for development.

## Troubleshooting

If you're getting "Internal server error" responses:

1. Check that Firebase Admin is properly configured with service account credentials
2. Ensure the user ID exists in your Firestore database
3. Check the server logs for detailed error messages
4. Verify that your Firebase project ID is correctly set in environment variables