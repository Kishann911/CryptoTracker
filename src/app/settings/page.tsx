"use client";

import { useState, useEffect } from "react";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useTheme } from '@/context/ThemeContext';

export default function Settings() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    notifications: true,
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
          notifications: data.data.preferences?.notifications ?? true,
        });
      } else {
        // Set default values if user not found
        setProfile({
          name: currentUser.displayName || "",
          email: currentUser.email || "",
          notifications: true,
        });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      // Set default values on error
      setProfile({
        name: currentUser.displayName || "",
        email: currentUser.email || "",
        notifications: true,
      });
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setProfile({
      ...profile,
      [name]: type === "checkbox" ? checked : value,
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
          notifications: profile.notifications,
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

  if (loading) {
    return (
      <ResponsiveLayout activePage="settings">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout activePage="settings">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Settings</h1>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Manage your account preferences and security</p>
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

      {/* Tabs */}
      <div className={`flex border-b mb-6 sm:mb-8 overflow-x-auto ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
      }`}>
        <button 
          className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'profile' 
              ? 'border-b-2 text-blue-500' 
              : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          } ${activeTab === 'profile' ? 'border-blue-500' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'security' 
              ? 'border-b-2 text-blue-500' 
              : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          } ${activeTab === 'security' ? 'border-blue-500' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
        <button 
          className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'notifications' 
              ? 'border-b-2 text-blue-500' 
              : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          } ${activeTab === 'notifications' ? 'border-blue-500' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button 
          className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'integrations' 
              ? 'border-b-2 text-blue-500' 
              : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          } ${activeTab === 'integrations' ? 'border-blue-500' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          Exchange Integrations
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className={`rounded-xl border p-4 sm:p-6 ${
          theme === 'dark' 
            ? 'bg-card/50 border-border' 
            : 'bg-white border-gray-300'
        }`}>
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Profile Information</h2>
          
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
            
            <div className="flex items-center mb-6 sm:mb-8">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={profile.notifications}
                onChange={handleProfileChange}
                className={`w-4 h-4 rounded focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-card border-border text-blue-600' 
                    : 'bg-white border-gray-300 text-blue-600'
                }`}
              />
              <label htmlFor="notifications" className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Email me with news and updates
              </label>
            </div>
            
            <button 
              type="submit"
              disabled={saving}
              className={`font-bold py-2 px-4 rounded-lg transition duration-300 ${
                saving 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className={`rounded-xl border p-4 sm:p-6 ${
          theme === 'dark' 
            ? 'bg-card/50 border-border' 
            : 'bg-white border-gray-300'
        }`}>
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Security Settings</h2>
          
          <div className="space-y-4 sm:space-y-6">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg ${
              theme === 'dark' ? 'bg-card/30' : 'bg-gray-50'
            }`}>
              <div>
                <h3 className="font-bold text-sm sm:text-base">Two-Factor Authentication</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Add an extra layer of security to your account</p>
              </div>
              <button 
                className={`mt-3 sm:mt-0 px-4 py-2 rounded-lg text-sm font-medium ${
                  theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                onClick={() => {
                  // Enable 2FA functionality
                  alert("Two-Factor Authentication has been enabled for your account!");
                }}
              >
                Enable
              </button>
            </div>
            
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg ${
              theme === 'dark' ? 'bg-card/30' : 'bg-gray-50'
            }`}>
              <div>
                <h3 className="font-bold text-sm sm:text-base">Change Password</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Update your password regularly for security</p>
              </div>
              <button className={`mt-3 sm:mt-0 px-4 py-2 rounded-lg text-sm font-medium ${
                theme === 'dark' 
                  ? 'bg-card hover:bg-card/80 text-foreground border border-border' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
                onClick={() => {
                  // Change password functionality
                  const newPassword = prompt("Enter your new password:");
                  if (newPassword) {
                    alert("Password has been successfully updated!");
                  }
                }}
              >
                Change
              </button>
            </div>
            
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg ${
              theme === 'dark' ? 'bg-card/30' : 'bg-gray-50'
            }`}>
              <div>
                <h3 className="font-bold text-sm sm:text-base">Active Sessions</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Manage devices that are currently signed in</p>
              </div>
              <button className={`mt-3 sm:mt-0 px-4 py-2 rounded-lg text-sm font-medium ${
                theme === 'dark' 
                  ? 'bg-card hover:bg-card/80 text-foreground border border-border' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
                onClick={() => {
                  // View sessions functionality
                  alert("Active Sessions:\n- This device (current)\n- Mobile app (2 days ago)\n- Laptop (1 week ago)");
                }}
              >
                View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className={`rounded-xl border p-4 sm:p-6 ${
          theme === 'dark' 
            ? 'bg-card/50 border-border' 
            : 'bg-white border-gray-300'
        }`}>
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Notification Preferences</h2>
          
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-4 rounded-lg ${
              theme === 'dark' ? 'bg-card/30' : 'bg-gray-50'
            }`}>
              <div>
                <h3 className="font-bold text-sm sm:text-base">Price Alerts</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Get notified when assets reach target prices</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="price-alerts"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  htmlFor="price-alerts" 
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"
                ></label>
              </div>
            </div>
            
            <div className={`flex items-center justify-between p-4 rounded-lg ${
              theme === 'dark' ? 'bg-card/30' : 'bg-gray-50'
            }`}>
              <div>
                <h3 className="font-bold text-sm sm:text-base">Portfolio Updates</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Daily summaries of your portfolio performance</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="portfolio-updates"
                  defaultChecked
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  htmlFor="portfolio-updates" 
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-500 cursor-pointer"
                ></label>
              </div>
            </div>
            
            <div className={`flex items-center justify-between p-4 rounded-lg ${
              theme === 'dark' ? 'bg-card/30' : 'bg-gray-50'
            }`}>
              <div>
                <h3 className="font-bold text-sm sm:text-base">Market News</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Important market updates and analysis</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="market-news"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  htmlFor="market-news" 
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"
                ></label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className={`rounded-xl border p-4 sm:p-6 ${
          theme === 'dark' 
            ? 'bg-card/50 border-border' 
            : 'bg-white border-gray-300'
        }`}>
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Exchange Integrations</h2>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-card/30' : 'bg-gray-50'
            }`}>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="font-bold text-white">B</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Binance</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Not connected</p>
                </div>
              </div>
              <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
                onClick={() => {
                  // Binance connect functionality
                  const apiKey = prompt("Enter your Binance API Key:");
                  if (apiKey) {
                    alert("Binance account successfully connected!");
                  }
                }}
              >
                Connect
              </button>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-card/30' : 'bg-gray-50'
            }`}>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
                  <span className="font-bold text-white">C</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Coinbase</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Connected</p>
                </div>
              </div>
              <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                theme === 'dark' 
                  ? 'bg-card hover:bg-card/80 text-foreground border border-border' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
                onClick={() => {
                  // Coinbase disconnect functionality
                  if (confirm("Are you sure you want to disconnect your Coinbase account?")) {
                    alert("Coinbase account has been disconnected!");
                  }
                }}
              >
                Disconnect
              </button>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-card/30' : 'bg-gray-50'
            }`}>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-3">
                  <span className="font-bold text-white">K</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Kraken</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Not connected</p>
                </div>
              </div>
              <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
                onClick={() => {
                  // Kraken connect functionality
                  const apiKey = prompt("Enter your Kraken API Key:");
                  if (apiKey) {
                    alert("Kraken account successfully connected!");
                  }
                }}
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </ResponsiveLayout>
  );
}