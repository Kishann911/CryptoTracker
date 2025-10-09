import { auth } from './firebase';
import { signInWithCustomToken, UserCredential } from 'firebase/auth';
import { verifyMessage } from 'viem';

export interface WalletAuthResult {
  success: boolean;
  error?: string;
  user?: UserCredential;
}

export async function authenticateWithWallet(
  signature: string, 
  address: string, 
  message: string,
  email?: string,
  name?: string
): Promise<WalletAuthResult> {
  try {
    // Verify the signature using viem
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    // Check if the signature is valid
    if (!isValid) {
      throw new Error('Signature verification failed: Invalid signature');
    }

    // Send the verified data to our backend to generate a custom token
    const response = await fetch('/api/auth/wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        signature,
        message,
        email,
        name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    // Sign in with the custom token returned from our backend
    const userCredential = await signInWithCustomToken(auth, data.token);
    return { success: true, user: userCredential };
  } catch (error: unknown) {
    console.error('Wallet authentication error:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Helper function to create a message for signing
export function createSignInMessage(address: string, nonce: string): string {
  return `Welcome to CryptoTracker!

Click "Sign" to sign in. No password needed!

Wallet address:
${address}

Nonce:
${nonce}`;
}