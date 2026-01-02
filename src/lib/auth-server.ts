import { admin } from './firebaseAdmin';
import { NextRequest } from 'next/server';
import { DecodedIdToken } from 'firebase-admin/auth';

/**
 * Verifies the Firebase ID token in the Authorization header.
 * Returns the decoded token if valid, otherwise returns null.
 */
export async function verifyAuth(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error('Error verifying auth token:', error);
        return null;
    }
}

/**
 * Checks if the authenticated user has permission to access a specific UID.
 * Returns true if the user is the same as the target UID or is an admin.
 */
export function hasPermission(decodedToken: DecodedIdToken | null, targetUid: string) {
    if (!decodedToken) return false;

    // User is accessing their own data
    if (decodedToken.uid === targetUid) return true;

    // User is an admin
    if (decodedToken.admin === true) return true;

    return false;
}
