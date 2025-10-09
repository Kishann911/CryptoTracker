import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';

export async function PUT(request: Request) {
  try {
    const { uid, email, name, notifications } = await request.json();

    // Validate input
    if (!uid) {
      return NextResponse.json(
        { error: 'Missing required parameter: uid' },
        { status: 400 }
      );
    }

    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      try {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
      } catch (initError) {
        console.error('Firebase Admin initialization error:', initError);
        return NextResponse.json(
          { 
            error: 'Firebase Admin not properly configured',
            message: 'Service account credentials are required for server-side Firebase operations. See FIREBASE_SETUP.md for instructions.'
          },
          { status: 500 }
        );
      }
    }

    const db = admin.firestore();

    // Prepare update data
    const updateData: any = {
      lastLogin: new Date(),
    };

    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (notifications !== undefined) updateData['preferences.notifications'] = notifications;

    // Update user document
    await db.collection('users').doc(uid).update(updateData);

    // Also update Firebase Authentication user record if email is provided
    if (email) {
      try {
        await getAuth().updateUser(uid, {
          email: email,
        });
      } catch (authError) {
        console.warn('Could not update Firebase Auth user email:', authError);
        // Continue even if auth update fails, as Firestore update succeeded
      }
    }

    return NextResponse.json({ 
      message: 'User updated successfully',
      data: updateData
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating user:', error);
    // Return more detailed error information in development
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { 
          error: 'Internal server error', 
          details: error.message || 'Unknown error',
          code: error.code || 'UNKNOWN'
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}