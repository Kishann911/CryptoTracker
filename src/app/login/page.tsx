"use client";

import Link from "next/link";
import { useState } from "react";
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export default function Login() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError("");
    
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      console.log("User logged in:", userCredential.user);
      
      // Redirect to dashboard or home page
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error("Login error:", err);
      // Provide more user-friendly error messages
      const error = err as Error & { code?: string };
      if (error.code === 'auth/invalid-email') {
        setError("Please enter a valid email address");
      } else if (error.code === 'auth/user-not-found') {
        setError("No account found with this email");
      } else if (error.code === 'auth/wrong-password') {
        setError("Incorrect password");
      } else if (error.code === 'auth/invalid-credential') {
        setError("Invalid credentials. Please check your email and password.");
      } else if (error.code === 'auth/invalid-api-key') {
        setError("Firebase API key is invalid. Please check your .env.local file and ensure you've added the correct Firebase configuration. See FIREBASE_SETUP.md for instructions. You need to replace the placeholder values with actual credentials from your Firebase Console.");
      } else {
        setError((error as Error).message || "Failed to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      console.log("Google login successful:", result.user);
      
      // Redirect to dashboard or home page
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error("Google login error:", err);
      // Provide more user-friendly error messages
      const error = err as Error & { code?: string };
      if (error.code === 'auth/popup-blocked') {
        setError("Popup was blocked by your browser. Please allow popups and try again.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User closed the popup, no need to show an error
        setError("");
      } else if (error.code === 'auth/invalid-api-key') {
        setError("Firebase API key is invalid. Please check your .env.local file and ensure you've added the correct Firebase configuration. See FIREBASE_SETUP.md for instructions. You need to replace the placeholder values with actual credentials from your Firebase Console.");
      } else {
        setError((error as Error).message || "Failed to log in with Google. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    try {
      // Dynamically import Reown AppKit to avoid SSR issues
      const { createAppKit } = await import('@reown/appkit');
      const { mainnet } = await import('@reown/appkit/networks');
      
      // Create the AppKit modal
      const modal = createAppKit({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '0e0ad13f1853b8f83e8f5f7abee3d955',
        networks: [mainnet],
        defaultNetwork: mainnet,
        metadata: {
          name: 'CryptoTracker',
          description: 'Crypto portfolio tracker',
          url: 'https://your-app-url.com',
          icons: ['https://your-app-url.com/logo.png'],
        },
      });
      
      // Open modal and wait for connection
      modal.open();
      
      // Listen for connection events
      const unsubscribe = modal.subscribeState((state) => {
        // Check if the state has the properties we need
        if ('connectionState' in state && state.connectionState === 'connected' && 'address' in state) {
          // Get the user's wallet address
          const address = (state as Record<string, unknown>).address as string;
          
          if (address) {
            // Create a message for the user to sign
            const message = `Sign this message to authenticate with CryptoTracker: ${Date.now()}`;
            
            // For now, we'll proceed with authentication without signature
            // In a real implementation, you would use the adapter's signMessage method
            import('../../lib/wallet-auth').then(({ authenticateWithWallet }) => {
              // Using a placeholder signature for demonstration
              const placeholderSignature = "0x"; // This should be replaced with actual signature
              authenticateWithWallet(placeholderSignature, address, message).then((authResult) => {
                if (authResult.success) {
                  // Redirect to dashboard or home page
                  router.push('/dashboard');
                } else {
                  console.error('Authentication failed:', authResult.error);
                  setError(authResult.error || "Wallet authentication failed");
                }
              });
            });
            
            // Unsubscribe to prevent multiple triggers
            unsubscribe();
          }
        }
      });
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setError("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gradient-to-br from-background to-card text-foreground' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'}`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className={theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}>Sign in to your CryptoTracker account</p>
        </div>

        <div className={`rounded-xl border p-6 sm:p-8 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
          {error && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${theme === 'dark' ? 'bg-destructive text-destructive-foreground' : 'bg-red-100 text-red-800'}`}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`} htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-card border-border text-foreground focus:ring-primary' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-6">
              <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`} htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-card border-border text-foreground focus:ring-primary' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className={`w-4 h-4 ${theme === 'dark' ? 'text-primary bg-card border-border focus:ring-primary' : 'text-blue-600 bg-gray-50 border-gray-300 focus:ring-blue-500'}`}
                />
                <label htmlFor="remember" className={`ml-2 text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
                  Remember me
                </label>
              </div>
              <Link href="#" className={theme === 'dark' ? 'text-primary hover:text-primary/80' : 'text-blue-600 hover:text-blue-500'}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-3 px-4 rounded-lg transition duration-300 mb-4 disabled:opacity-50 ${theme === 'dark' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="flex items-center my-4">
              <div className={`flex-grow border-t ${theme === 'dark' ? 'border-border' : 'border-gray-300'}`}></div>
              <span className={`mx-4 text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>OR</span>
              <div className={`flex-grow border-t ${theme === 'dark' ? 'border-border' : 'border-gray-300'}`}></div>
            </div>

            <button
              type="button"
              onClick={handleWalletConnect}
              disabled={loading}
              className={`w-full font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center mb-4 disabled:opacity-50 ${theme === 'dark' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                />
              </svg>
              Connect Wallet
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className={`w-full font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center mb-6 disabled:opacity-50 ${theme === 'dark' ? 'bg-card hover:bg-card/80 text-foreground border border-border' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'}`}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            <p className={`text-center text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className={theme === 'dark' ? 'text-primary hover:text-primary/80' : 'text-blue-600 hover:text-blue-500'}>
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}