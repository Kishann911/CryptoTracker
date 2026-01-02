import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/lib/firebaseAdmin';
import { verifyAuth, hasPermission } from '@/lib/auth-server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
  try {
    // Await the params to properly handle dynamic route parameters
    const { uid } = await params;

    // Validate input
    if (!uid) {
      return NextResponse.json(
        { error: 'Missing required parameter: uid' },
        { status: 400 }
      );
    }

    // Security Check: Verify authentication and permissions
    const decodedToken = await verifyAuth(request);
    if (!decodedToken || !hasPermission(decodedToken, uid)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }

    const db = admin.firestore();

    // Fetch user data
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // Fetch portfolio data
    const portfolioDoc = await db.collection('portfolios').doc(uid).get();
    const portfolioData = portfolioDoc.exists ? portfolioDoc.data() : null;

    return NextResponse.json({
      success: true,
      data: {
        uid: userDoc.id,
        ...userData,
        portfolio: portfolioData
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
