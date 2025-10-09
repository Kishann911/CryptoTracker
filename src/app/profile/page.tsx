"use client";

import { useState, useEffect } from "react";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { useTheme } from '@/context/ThemeContext';

export default function Profile() {
  const { theme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photoURL: "",
    walletAddress: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Load user data when component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load user data from Firestore
        await loadUserProfile(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (currentUser: User) => {
    try {
      const response = await fetch(`/api/users/${currentUser.uid}`);
      const data = await response.json();

      if (response.ok) {
        // Handle empty strings properly
        const firestoreName = data.data.name && data.data.name.trim() !== '' ? data.data.name : null;
        setProfile({
          name: firestoreName || currentUser.displayName || "",
          email: data.data.email || currentUser.email || "",
          photoURL: data.data.photoURL || currentUser.photoURL || "",
          walletAddress: data.data.walletAddress || "",
        });
      } else {
        // Set default values if user not found
        setProfile({
          name: currentUser.displayName || "",
          email: currentUser.email || "",
          photoURL: currentUser.photoURL || "",
          walletAddress: "",
        });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      // Set default values on error
      setProfile({
        name: currentUser.displayName || "",
        email: currentUser.email || "",
        photoURL: currentUser.photoURL || "",
        walletAddress: "",
      });
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSaveStatus(null);

    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          email: profile.email,
          name: profile.name,
          walletAddress: profile.walletAddress,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
      } else {
        setSaveStatus({ type: 'error', message: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveStatus({ type: 'error', message: 'Failed to update profile' });
    } finally {
      setSaving(false);
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <ResponsiveLayout activePage="profile">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout activePage="profile">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Profile</h1>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Manage your account information</p>
      </div>

      {/* Status Message */}
      {saveStatus && (
        <div className={`mb-4 p-3 rounded-lg ${
          saveStatus.type === 'success' 
            ? 'bg-green-800 text-green-200' 
            : 'bg-red-800 text-red-200'
        }`}>
          {saveStatus.message}
        </div>
      )}

      <div className={`rounded-xl border p-4 sm:p-6 ${
        theme === 'dark' 
          ? 'bg-card/50 border-border' 
          : 'bg-white border-gray-300'
      }`}>
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mb-4">
            {profile.photoURL ? (
              <img 
                src={profile.photoURL} 
                alt={profile.name} 
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <span className="font-bold text-2xl text-white">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold">{profile.name || "User"}</h2>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{profile.email}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-6">
            <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-card border border-border text-foreground' 
                  : 'bg-white border border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div className="mb-4 sm:mb-6">
            <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-card border border-border text-foreground' 
                  : 'bg-white border border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div className="mb-6 sm:mb-8">
            <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} htmlFor="walletAddress">
              Wallet Address (Optional)
            </label>
            <input
              type="text"
              id="walletAddress"
              name="walletAddress"
              value={profile.walletAddress}
              onChange={handleProfileChange}
              className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-card border border-border text-foreground' 
                  : 'bg-white border border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              type="submit"
              disabled={saving}
              className={`font-bold py-2 px-4 rounded-lg transition duration-300 flex-1 ${
                saving 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
            
            <button 
              type="button"
              onClick={handleLogout}
              className={`font-bold py-2 px-4 rounded-lg transition duration-300 flex-1 ${
                theme === 'dark' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </ResponsiveLayout>
  );
}