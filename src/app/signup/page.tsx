"use client";

import Link from "next/link";
import { useState } from "react";
import { auth } from '../../lib/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export default function Signup() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // In a real app, you would also save the user's name to your database
      console.log("User created:", userCredential.user);
      
      // Redirect to dashboard or home page
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Signup error:", err);
      // Provide more user-friendly error messages
      if (err.code === 'auth/email-already-in-use') {
        setError("An account with this email already exists");
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email address");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters");
      } else if (err.code === 'auth/invalid-api-key') {
        setError("Firebase API key is invalid. Please check your .env.local file and ensure you've added the correct Firebase configuration. See FIREBASE_SETUP.md for instructions. You need to replace the placeholder values with actual credentials from your Firebase Console.");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // In a real app, you might want to save additional user info to your database
      console.log("Google signup successful:", result.user);
      
      // Redirect to dashboard or home page
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Google signup error:", err);
      // Provide more user-friendly error messages
      if (err.code === 'auth/popup-blocked') {
        setError("Popup was blocked by your browser. Please allow popups and try again.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        // User closed the popup, no need to show an error
        setError("");
      } else if (err.code === 'auth/invalid-api-key') {
        setError("Firebase API key is invalid. Please check your .env.local file and ensure you've added the correct Firebase configuration. See FIREBASE_SETUP.md for instructions. You need to replace the placeholder values with actual credentials from your Firebase Console.");
      } else {
        setError(err.message || "Failed to sign up with Google. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gradient-to-br from-background to-card text-foreground' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'}`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className={theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}>Join CryptoTracker to manage your portfolio</p>
        </div>

        <div className={`rounded-xl border p-6 sm:p-8 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
          {error && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${theme === 'dark' ? 'bg-destructive text-destructive-foreground' : 'bg-red-100 text-red-800'}`}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`} htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-card border-border text-foreground focus:ring-primary' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                placeholder="Enter your full name"
                required
              />
            </div>

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

            <div className="mb-4">
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
                placeholder="Create a password"
                required
              />
            </div>

            <div className="mb-6">
              <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`} htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-card border-border text-foreground focus:ring-primary' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-3 px-4 rounded-lg transition duration-300 mb-4 disabled:opacity-50 ${theme === 'dark' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="flex items-center my-4">
              <div className={`flex-grow border-t ${theme === 'dark' ? 'border-border' : 'border-gray-300'}`}></div>
              <span className={`mx-4 text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>OR</span>
              <div className={`flex-grow border-t ${theme === 'dark' ? 'border-border' : 'border-gray-300'}`}></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
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
              Sign up with Google
            </button>

            <p className={`text-center text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              Already have an account?{" "}
              <Link href="/login" className={theme === 'dark' ? 'text-primary hover:text-primary/80' : 'text-blue-600 hover:text-blue-500'}>
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}