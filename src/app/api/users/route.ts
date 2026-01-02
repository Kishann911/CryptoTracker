import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { email, name, walletAddress, uid } = await request.json();

    // Validate input
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Missing required parameters: email and name are required' },
        { status: 400 }
      );
    }

    // Initialize Firebase Admin if not already initialized
    // Using the centralized helper would be better, but let's keep it consistent for now
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

    // Create new user document
    const userData = {
      email: email,
      name: name,
      walletAddress: walletAddress || "",
      createdAt: new Date(),
      lastLogin: new Date(),
      preferences: {
        currency: 'USD',
        theme: 'dark',
        notifications: true
      }
    };

    // Use provided UID or generate a new one
    let userId = uid;
    if (userId) {
      await db.collection('users').doc(userId).set(userData);
    } else {
      const docRef = await db.collection('users').add(userData);
      userId = docRef.id;
    }

    return NextResponse.json({
      message: 'User created successfully',
      userId: userId,
      data: userData
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    // Return more detailed error information in development
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        {
          error: 'Internal server error',
          details: (error as Error).message || 'Unknown error',
          code: (error as Error & { code?: string }).code || 'UNKNOWN'
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