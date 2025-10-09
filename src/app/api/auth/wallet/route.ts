import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { admin } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { address, signature, message, email, name } = await request.json();

    // Validate input
    if (!address || !signature || !message) {
      return NextResponse.json(
        { error: 'Missing required parameters: address, signature, message' },
        { status: 400 }
      );
    }

    // Verify the signature using ethers.js
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json(
        { error: 'Signature verification failed' },
        { status: 401 }
      );
    }

    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }

    const db = admin.firestore();

    // Check if user exists in Firestore
    const usersRef = db.collection('users');
    const userQuery = await usersRef.where('walletAddress', '==', address).limit(1).get();
    
    let userId;
    if (userQuery.empty) {
      // Create new user document
      const newUser: any = {
        walletAddress: address,
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          currency: 'USD',
          theme: 'dark',
          notifications: true
        }
      };
      
      // Add email and name if provided
      if (email) newUser.email = email;
      if (name) newUser.name = name;
      
      const newUserRef = await usersRef.add(newUser);
      userId = newUserRef.id;
    } else {
      // Update existing user's lastLogin
      const userDoc = userQuery.docs[0];
      userId = userDoc.id;
      const updateData: any = {
        lastLogin: new Date()
      };
      
      // Update email and name if provided
      if (email) updateData.email = email;
      if (name) updateData.name = name;
      
      await userDoc.ref.update(updateData);
    }

    // Create custom token for the user
    const customToken = await admin.auth().createCustomToken(userId);
    
    return NextResponse.json({ token: customToken, uid: userId });
  } catch (error) {
    console.error('Error in wallet authentication:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}