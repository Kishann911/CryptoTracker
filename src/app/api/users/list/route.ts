import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }

    const db = admin.firestore();
    
    // Fetch all users
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    
    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      
      // Fetch portfolio data for each user
      const portfolioSnapshot = await db.collection('portfolios').doc(doc.id).get();
      const portfolioData = portfolioSnapshot.exists ? portfolioSnapshot.data() : null;
      
      users.push({
        uid: doc.id,
        ...userData,
        portfolio: portfolioData
      });
    }
    
    return NextResponse.json({ 
      success: true,
      users: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
