"use client";

import Link from "next/link";
import { useState, ReactNode, useEffect } from "react";
import { useTheme } from '@/context/ThemeContext';
import { Dock, DockIcon, DockItem } from '@/components/ui/dock';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface ResponsiveLayoutProps {
  children: ReactNode;
  activePage: string;
}

interface Alert {
  id: string;
  name: string;
  type: "price" | "percentage" | "portfolio";
  asset: string;
  condition: string;
  target: string;
  enabled: boolean;
  lastTriggered?: string;
}

interface UserProfile {
  name: string;
  email: string;
  photoURL?: string;
}

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: string;
}

export default function ResponsiveLayout({ children, activePage }: ResponsiveLayoutProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAlertsPopup, setShowAlertsPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Mock active alerts data - in a real app, this would come from an API
  useEffect(() => {
    // Simulating fetching active alerts
    const mockActiveAlerts: Alert[] = [
      {
        id: "1",
        name: "Bitcoin Price Alert",
        type: "price",
        asset: "Bitcoin (BTC)",
        condition: "above",
        target: "$50,000",
        enabled: true,
        lastTriggered: "2023-06-15 14:30"
      },
      {
        id: "2",
        name: "Ethereum Drop Alert",
        type: "percentage",
        asset: "Ethereum (ETH)",
        condition: "below",
        target: "-5% in 24h",
        enabled: true,
        lastTriggered: "2023-06-10 09:15"
      }
    ];
    setActiveAlerts(mockActiveAlerts);
  }, []);

  const navItems: NavItem[] = [
    { id: 'dashboard', href: "/dashboard", label: "Dashboard", icon: "📊" },
    { id: 'portfolio', href: "/portfolio", label: "Portfolio", icon: "💼" },
    { id: 'analytics', href: "/analytics", label: "Analytics", icon: "📈" },
    { id: 'market-data', href: "/crypto-data", label: "Market Data", icon: "💰" },
    { id: 'users', href: "/users", label: "Users", icon: "👥" },
    { id: 'alerts', href: "/alerts", label: "Alerts", icon: "🔔" },
    { id: 'settings', href: "/settings", label: "Settings", icon: "⚙️" },
    { id: 'help', href: "/help", label: "Help", icon: "❓" },
  ];

  const handleAlertIconClick = () => {
    if (activeAlerts.length > 0) {
      setShowAlertsPopup(!showAlertsPopup);
    } else {
      // If no active alerts, redirect to alerts page
      window.location.href = "/alerts";
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load user profile data
        await loadUserProfile(currentUser.uid);
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (uid: string) => {
    setLoadingProfile(true);
    try {
      const response = await fetch(`/api/users/${uid}`);
      const data = await response.json();

      if (response.ok) {
        // Use the name from Firestore data, or fallback to Firebase Auth display name, or email name
        // Handle empty strings properly
        const firestoreName = data.data.name && data.data.name.trim() !== '' ? data.data.name : null;
        const displayName = firestoreName || user?.displayName || getUserDisplayNameFromEmail() || "User";
        
        setUserProfile({
          name: displayName,
          email: data.data.email || user?.email || "",
          photoURL: data.data.photoURL || user?.photoURL || ""
        });
      } else {
        // Handle API errors gracefully
        console.warn("Failed to load user profile:", data.error);
        // Check if it's a Firebase credentials error
        if (data.error === 'Server configuration error' || data.error === 'Authentication required') {
          console.warn('Firebase Admin SDK not properly configured. See FIREBASE_CREDENTIALS_SETUP.md for instructions.');
        }
        // Set default user profile using Firebase user data as fallback
        const displayName = user?.displayName || getUserDisplayNameFromEmail() || "User";
        setUserProfile({
          name: displayName,
          email: user?.email || "",
          photoURL: user?.photoURL || ""
        });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      // Set default user profile using Firebase user data as fallback
      const displayName = user?.displayName || getUserDisplayNameFromEmail() || "User";
      setUserProfile({
        name: displayName,
        email: user?.email || "",
        photoURL: user?.photoURL || ""
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  // Extract display name from email
  const getUserDisplayNameFromEmail = () => {
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      // Capitalize first letter
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return null;
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userProfile?.name) {
      return userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    // Fallback to email name if no profile name
    const emailName = getUserDisplayNameFromEmail();
    if (emailName) {
      return emailName.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Get display name for user
  const getUserDisplayName = () => {
    // Check if userProfile.name exists and is not empty
    if (userProfile?.name && userProfile.name.trim() !== '') {
      return userProfile.name;
    }
    // Fallback to email name if no profile name
    const emailName = getUserDisplayNameFromEmail();
    if (emailName) {
      return emailName;
    }
    return 'User';
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowProfilePopup(false);
      // Use window.location.href instead of router.push for full page refresh
      // This ensures the user is completely logged out
      window.location.href = '/login';
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-background text-foreground' : 'bg-gray-50 text-gray-900'}`}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`p-4 ${theme === 'dark' ? 'bg-card border-b border-border' : 'bg-white border-b border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">CryptoTracker</h1>
            </div>
            
            <div className="relative w-full max-w-xs sm:max-w-md">
              <input
                type="text"
                placeholder="Search assets..."
                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  theme === 'dark' 
                    ? 'bg-card border border-border text-foreground' 
                    : 'bg-gray-50 border border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Notification Icon with Popup */}
              <div className="relative">
                <button 
                  onClick={handleAlertIconClick}
                  className={`relative p-1 ${theme === 'dark' ? 'text-muted-foreground hover:text-foreground' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {activeAlerts.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                
                {/* Alerts Popup */}
                {showAlertsPopup && (
                  <div 
                    className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50 ${
                      theme === 'dark' 
                        ? 'bg-card border border-border' 
                        : 'bg-white border border-gray-200'
                    }`}
                    style={{ top: '100%' }}
                  >
                    <div className={`p-4 border-b ${
                      theme === 'dark' ? 'border-border' : 'border-gray-200'
                    }`}>
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold">Active Alerts</h3>
                        <button 
                          onClick={() => setShowAlertsPopup(false)}
                          className={theme === 'dark' ? 'text-muted-foreground hover:text-foreground' : 'text-gray-500 hover:text-gray-900'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto">
                      {activeAlerts.length > 0 ? (
                        <ul>
                          {activeAlerts.map((alert) => (
                            <li 
                              key={alert.id} 
                              className={`p-4 border-b ${
                                theme === 'dark' ? 'border-border hover:bg-card/50' : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-sm">{alert.name}</h4>
                                  <p className={`text-xs mt-1 ${
                                    theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'
                                  }`}>
                                    {alert.asset} • {alert.condition} {alert.target}
                                  </p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  theme === 'dark' 
                                    ? 'bg-green-900 bg-opacity-30 text-green-400' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  Active
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className={`p-8 text-center ${
                          theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'
                        }`}>
                          <p>No active alerts</p>
                        </div>
                      )}
                    </div>
                    
                    <div className={`p-3 border-t ${
                      theme === 'dark' ? 'border-border' : 'border-gray-200'
                    }`}>
                      <button
                        onClick={() => {
                          setShowAlertsPopup(false);
                          window.location.href = "/alerts";
                        }}
                        className={`w-full text-center text-sm font-medium ${
                          theme === 'dark' 
                            ? 'text-blue-400 hover:text-blue-300' 
                            : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        View All Alerts
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                {/* User Avatar and Name */}
                {user ? (
                  <button 
                    onClick={() => setShowProfilePopup(!showProfilePopup)}
                    className="flex items-center focus:outline-none hover:opacity-80 transition-opacity"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      {loadingProfile ? (
                        <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                      ) : userProfile?.photoURL ? (
                        <img 
                          src={userProfile.photoURL} 
                          alt={userProfile.name} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-sm text-white">
                          {getUserInitials()}
                        </span>
                      )}
                    </div>
                    <span className="ml-2 hidden md:inline">
                      {loadingProfile ? 'Loading...' : getUserDisplayName()}
                    </span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowProfilePopup(!showProfilePopup)}
                    className="flex items-center focus:outline-none hover:opacity-80 transition-opacity"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="font-bold text-sm">U</span>
                    </div>
                    <span className="ml-2 hidden md:inline">User</span>
                  </button>
                )}
                
                {/* Profile Popup */}
                {showProfilePopup && (
                  <div 
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 ${
                      theme === 'dark' 
                        ? 'bg-card border border-border' 
                        : 'bg-white border border-gray-200'
                    }`}
                    style={{ top: '100%' }}
                  >
                    <div className={`p-4 border-b ${
                      theme === 'dark' ? 'border-border' : 'border-gray-200'
                    }`}>
                      <p className="font-medium truncate">{getUserDisplayName()}</p>
                      <p className={`text-xs truncate ${
                        theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'
                      }`}>
                        {user?.email}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        href="/profile"
                        className={`block px-4 py-2 text-sm ${
                          theme === 'dark' 
                            ? 'text-foreground hover:bg-card/50' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setShowProfilePopup(false)}
                      >
                        Profile
                      </Link>
                      <Link 
                        href="/settings"
                        className={`block px-4 py-2 text-sm ${
                          theme === 'dark' 
                            ? 'text-foreground hover:bg-card/50' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setShowProfilePopup(false)}
                      >
                        Settings
                      </Link>
                    </div>
                    
                    <div className={`border-t ${
                      theme === 'dark' ? 'border-border' : 'border-gray-200'
                    }`}>
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          theme === 'dark' 
                            ? 'text-red-400 hover:bg-card/50' 
                            : 'text-red-600 hover:bg-gray-100'
                        }`}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24">
          {children}
        </main>
      </div>

      {/* Floating Dock */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <Dock magnification={65} distance={120} panelHeight={65}>
          {navItems.map((item) => (
            <DockItem key={item.id} href={item.href}>
              <Link 
                href={item.href}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                  activePage === item.id 
                    ? theme === 'dark' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-blue-500 text-white'
                    : theme === 'dark' 
                      ? 'text-muted-foreground hover:bg-card/80' 
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <DockIcon>
                  <span className="text-2xl">{item.icon}</span>
                </DockIcon>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            </DockItem>
          ))}
        </Dock>
      </div>
    </div>
  );
}