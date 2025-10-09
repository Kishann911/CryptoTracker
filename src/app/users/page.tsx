"use client";

import { useState, useEffect } from 'react';
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { useTheme } from '@/context/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Image from 'next/image';

// User interface
interface User {
  uid: string;
  email: string;
  name: string;
  walletAddress: string;
  photoURL: string;
  createdAt: string;
  lastLogin: string;
  preferences: {
    currency: string;
    theme: string;
    notifications: boolean;
  };
  portfolio: {
    totalValue: number;
    totalInvested: number;
    holdings: {
      symbol: string;
      name: string;
      amount: number;
      purchasePrice: number;
      currentPrice: number;
    }[];
  };
  score?: number; // Added score property
}

// Color palette for charts
const COLORS = ['#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#10b981', '#f97316', '#6366f1', '#ec4899'];

export default function UsersDashboard() {
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'score' | 'value' | 'roi'>('score');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Mock data
  const mockUsers: User[] = [
    {
      uid: "user_001",
      email: "alice.crypto@example.com",
      name: "Alice Crypto",
      walletAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      photoURL: "https://i.pravatar.cc/150?img=1",
      createdAt: "2023-01-15T10:30:00Z",
      lastLogin: "2023-10-05T14:22:00Z",
      preferences: {
        currency: "USD",
        theme: "dark",
        notifications: true
      },
      portfolio: {
        totalValue: 45250.75,
        totalInvested: 38000.00,
        holdings: [
          { symbol: "BTC", name: "Bitcoin", amount: 0.8, purchasePrice: 22000, currentPrice: 28500 },
          { symbol: "ETH", name: "Ethereum", amount: 12.5, purchasePrice: 1400, currentPrice: 1750 },
          { symbol: "ADA", name: "Cardano", amount: 50000, purchasePrice: 0.45, currentPrice: 0.62 }
        ]
      }
    },
    {
      uid: "user_002",
      email: "bob.blockchain@example.com",
      name: "Bob Blockchain",
      walletAddress: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
      photoURL: "https://i.pravatar.cc/150?img=2",
      createdAt: "2023-02-20T14:45:00Z",
      lastLogin: "2023-10-06T09:15:00Z",
      preferences: {
        currency: "EUR",
        theme: "light",
        notifications: false
      },
      portfolio: {
        totalValue: 32100.50,
        totalInvested: 29500.00,
        holdings: [
          { symbol: "BTC", name: "Bitcoin", amount: 0.5, purchasePrice: 25000, currentPrice: 28500 },
          { symbol: "SOL", name: "Solana", amount: 150, purchasePrice: 35.5, currentPrice: 42.8 },
          { symbol: "DOT", name: "Polkadot", amount: 2000, purchasePrice: 6.8, currentPrice: 8.2 }
        ]
      }
    },
    {
      uid: "user_003",
      email: "charlie.defi@example.com",
      name: "Charlie DeFi",
      walletAddress: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
      photoURL: "https://i.pravatar.cc/150?img=3",
      createdAt: "2023-03-10T08:20:00Z",
      lastLogin: "2023-10-04T18:45:00Z",
      preferences: {
        currency: "USD",
        theme: "dark",
        notifications: true
      },
      portfolio: {
        totalValue: 28750.25,
        totalInvested: 25000.00,
        holdings: [
          { symbol: "ETH", name: "Ethereum", amount: 10.2, purchasePrice: 1600, currentPrice: 1750 },
          { symbol: "SOL", name: "Solana", amount: 200, purchasePrice: 38.0, currentPrice: 42.8 },
          { symbol: "AVAX", name: "Avalanche", amount: 350, purchasePrice: 18.5, currentPrice: 22.3 }
        ]
      }
    },
    {
      uid: "user_004",
      email: "diana.nft@example.com",
      name: "Diana NFT",
      walletAddress: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e",
      photoURL: "https://i.pravatar.cc/150?img=4",
      createdAt: "2023-04-05T12:10:00Z",
      lastLogin: "2023-10-06T11:30:00Z",
      preferences: {
        currency: "USD",
        theme: "light",
        notifications: true
      },
      portfolio: {
        totalValue: 52300.80,
        totalInvested: 45000.00,
        holdings: [
          { symbol: "BTC", name: "Bitcoin", amount: 1.2, purchasePrice: 24000, currentPrice: 28500 },
          { symbol: "ETH", name: "Ethereum", amount: 15.8, purchasePrice: 1550, currentPrice: 1750 },
          { symbol: "ADA", name: "Cardano", amount: 75000, purchasePrice: 0.48, currentPrice: 0.62 }
        ]
      }
    },
    {
      uid: "user_005",
      email: "eric.miner@example.com",
      name: "Eric Miner",
      walletAddress: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
      photoURL: "https://i.pravatar.cc/150?img=5",
      createdAt: "2023-05-12T16:30:00Z",
      lastLogin: "2023-10-05T20:15:00Z",
      preferences: {
        currency: "USD",
        theme: "dark",
        notifications: false
      },
      portfolio: {
        totalValue: 19800.60,
        totalInvested: 18200.00,
        holdings: [
          { symbol: "BTC", name: "Bitcoin", amount: 0.3, purchasePrice: 27000, currentPrice: 28500 },
          { symbol: "SOL", name: "Solana", amount: 300, purchasePrice: 32.0, currentPrice: 42.8 },
          { symbol: "DOT", name: "Polkadot", amount: 1500, purchasePrice: 7.2, currentPrice: 8.2 }
        ]
      }
    },
    {
      uid: "user_006",
      email: "fiona.trader@example.com",
      name: "Fiona Trader",
      walletAddress: "0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a",
      photoURL: "https://i.pravatar.cc/150?img=6",
      createdAt: "2023-06-18T09:45:00Z",
      lastLogin: "2023-10-06T07:30:00Z",
      preferences: {
        currency: "GBP",
        theme: "light",
        notifications: true
      },
      portfolio: {
        totalValue: 38900.40,
        totalInvested: 32000.00,
        holdings: [
          { symbol: "ETH", name: "Ethereum", amount: 18.5, purchasePrice: 1450, currentPrice: 1750 },
          { symbol: "ADA", name: "Cardano", amount: 100000, purchasePrice: 0.42, currentPrice: 0.62 },
          { symbol: "AVAX", name: "Avalanche", amount: 500, purchasePrice: 16.8, currentPrice: 22.3 }
        ]
      }
    },
    {
      uid: "user_007",
      email: "george.hodl@example.com",
      name: "George HODL",
      walletAddress: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
      photoURL: "https://i.pravatar.cc/150?img=7",
      createdAt: "2023-07-22T13:20:00Z",
      lastLogin: "2023-10-04T16:45:00Z",
      preferences: {
        currency: "USD",
        theme: "dark",
        notifications: true
      },
      portfolio: {
        totalValue: 65400.90,
        totalInvested: 52000.00,
        holdings: [
          { symbol: "BTC", name: "Bitcoin", amount: 1.8, purchasePrice: 21000, currentPrice: 28500 },
          { symbol: "ETH", name: "Ethereum", amount: 22.3, purchasePrice: 1300, currentPrice: 1750 },
          { symbol: "SOL", name: "Solana", amount: 400, purchasePrice: 30.5, currentPrice: 42.8 }
        ]
      }
    },
    {
      uid: "user_008",
      email: "helen.staker@example.com",
      name: "Helen Staker",
      walletAddress: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
      photoURL: "https://i.pravatar.cc/150?img=8",
      createdAt: "2023-08-30T11:15:00Z",
      lastLogin: "2023-10-06T12:20:00Z",
      preferences: {
        currency: "USD",
        theme: "light",
        notifications: false
      },
      portfolio: {
        totalValue: 24650.30,
        totalInvested: 21500.00,
        holdings: [
          { symbol: "BTC", name: "Bitcoin", amount: 0.6, purchasePrice: 25500, currentPrice: 28500 },
          { symbol: "DOT", name: "Polkadot", amount: 3000, purchasePrice: 6.5, currentPrice: 8.2 },
          { symbol: "AVAX", name: "Avalanche", amount: 450, purchasePrice: 17.8, currentPrice: 22.3 }
        ]
      }
    },
    {
      uid: "user_009",
      email: "ian.analyst@example.com",
      name: "Ian Analyst",
      walletAddress: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
      photoURL: "https://i.pravatar.cc/150?img=9",
      createdAt: "2023-09-05T15:40:00Z",
      lastLogin: "2023-10-05T08:10:00Z",
      preferences: {
        currency: "USD",
        theme: "dark",
        notifications: true
      },
      portfolio: {
        totalValue: 31200.75,
        totalInvested: 27800.00,
        holdings: [
          { symbol: "ETH", name: "Ethereum", amount: 14.2, purchasePrice: 1500, currentPrice: 1750 },
          { symbol: "SOL", name: "Solana", amount: 250, purchasePrice: 36.0, currentPrice: 42.8 },
          { symbol: "ADA", name: "Cardano", amount: 60000, purchasePrice: 0.46, currentPrice: 0.62 }
        ]
      }
    },
    {
      uid: "user_010",
      email: "julia.yield@example.com",
      name: "Julia Yield",
      walletAddress: "0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e",
      photoURL: "https://i.pravatar.cc/150?img=10",
      createdAt: "2023-09-15T14:25:00Z",
      lastLogin: "2023-10-06T14:50:00Z",
      preferences: {
        currency: "USD",
        theme: "light",
        notifications: true
      },
      portfolio: {
        totalValue: 18750.20,
        totalInvested: 16500.00,
        holdings: [
          { symbol: "BTC", name: "Bitcoin", amount: 0.4, purchasePrice: 26000, currentPrice: 28500 },
          { symbol: "ETH", name: "Ethereum", amount: 8.5, purchasePrice: 1600, currentPrice: 1750 },
          { symbol: "DOT", name: "Polkadot", amount: 1800, purchasePrice: 7.0, currentPrice: 8.2 }
        ]
      }
    },
    {
      uid: "user_011",
      email: "kevin.whale@example.com",
      name: "Kevin Whale",
      walletAddress: "0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
      photoURL: "https://i.pravatar.cc/150?img=11",
      createdAt: "2023-09-20T10:50:00Z",
      lastLogin: "2023-10-05T19:30:00Z",
      preferences: {
        currency: "USD",
        theme: "dark",
        notifications: false
      },
      portfolio: {
        totalValue: 89200.60,
        totalInvested: 75000.00,
        holdings: [
          { symbol: "BTC", name: "Bitcoin", amount: 2.5, purchasePrice: 20500, currentPrice: 28500 },
          { symbol: "ETH", name: "Ethereum", amount: 30.8, purchasePrice: 1250, currentPrice: 1750 },
          { symbol: "SOL", name: "Solana", amount: 600, purchasePrice: 28.5, currentPrice: 42.8 }
        ]
      }
    },
    {
      uid: "user_012",
      email: "lisa.daytrader@example.com",
      name: "Lisa Daytrader",
      walletAddress: "0x2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
      photoURL: "https://i.pravatar.cc/150?img=12",
      createdAt: "2023-09-25T16:15:00Z",
      lastLogin: "2023-10-06T13:40:00Z",
      preferences: {
        currency: "USD",
        theme: "light",
        notifications: true
      },
      portfolio: {
        totalValue: 15600.45,
        totalInvested: 14200.00,
        holdings: [
          { symbol: "BTC", name: "Bitcoin", amount: 0.3, purchasePrice: 27500, currentPrice: 28500 },
          { symbol: "ADA", name: "Cardano", amount: 45000, purchasePrice: 0.47, currentPrice: 0.62 },
          { symbol: "AVAX", name: "Avalanche", amount: 300, purchasePrice: 19.2, currentPrice: 22.3 }
        ]
      }
    },
    {
      uid: "user_013",
      email: "mike.investor@example.com",
      name: "Mike Investor",
      walletAddress: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      photoURL: "https://i.pravatar.cc/150?img=13",
      createdAt: "2023-09-28T09:30:00Z",
      lastLogin: "2023-10-05T11:20:00Z",
      preferences: {
        currency: "USD",
        theme: "dark",
        notifications: true
      },
      portfolio: {
        totalValue: 42100.85,
        totalInvested: 38500.00,
        holdings: [
          { symbol: "ETH", name: "Ethereum", amount: 16.5, purchasePrice: 1550, currentPrice: 1750 },
          { symbol: "SOL", name: "Solana", amount: 350, purchasePrice: 34.0, currentPrice: 42.8 },
          { symbol: "DOT", name: "Polkadot", amount: 2500, purchasePrice: 6.9, currentPrice: 8.2 }
        ]
      }
    },
    {
      uid: "user_014",
      email: "nina.hodler@example.com",
      name: "Nina Hodler",
      walletAddress: "0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
      photoURL: "https://i.pravatar.cc/150?img=14",
      createdAt: "2023-09-30T13:45:00Z",
      lastLogin: "2023-10-06T08:50:00Z",
      preferences: {
        currency: "USD",
        theme: "light",
        notifications: false
      },
      portfolio: {
        totalValue: 27850.35,
        totalInvested: 24500.00,
        holdings: [
          { symbol: "BTC", name: "Bitcoin", amount: 0.7, purchasePrice: 24500, currentPrice: 28500 },
          { symbol: "ETH", name: "Ethereum", amount: 11.2, purchasePrice: 1580, currentPrice: 1750 },
          { symbol: "ADA", name: "Cardano", amount: 55000, purchasePrice: 0.44, currentPrice: 0.62 }
        ]
      }
    },
    {
      uid: "user_015",
      email: "oscar.trader@example.com",
      name: "Oscar Trader",
      walletAddress: "0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
      photoURL: "https://i.pravatar.cc/150?img=15",
      createdAt: "2023-10-01T11:20:00Z",
      lastLogin: "2023-10-06T15:30:00Z",
      preferences: {
        currency: "USD",
        theme: "dark",
        notifications: true
      },
      portfolio: {
        totalValue: 22400.65,
        totalInvested: 20100.00,
        holdings: [
          { symbol: "BTC", name: "Bitcoin", amount: 0.5, purchasePrice: 26500, currentPrice: 28500 },
          { symbol: "SOL", name: "Solana", amount: 280, purchasePrice: 32.5, currentPrice: 42.8 },
          { symbol: "AVAX", name: "Avalanche", amount: 380, purchasePrice: 17.5, currentPrice: 22.3 }
        ]
      }
    }
  ];

  // Calculate user score based on portfolio performance
  function calculateUserScore(user: User): number {
    if (!user.portfolio) return 0;
    
    const { totalValue, totalInvested } = user.portfolio;
    
    // Calculate ROI
    const roi = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;
    
    // Calculate diversification score (0-100)
    const holdingsCount = user.portfolio.holdings.length;
    const diversificationScore = Math.min(holdingsCount * 20, 100); // Max 5 assets for full diversification score
    
    // Calculate experience score based on account age (0-100)
    const accountAgeMs = Date.now() - new Date(user.createdAt).getTime();
    const accountAgeDays = accountAgeMs / (1000 * 60 * 60 * 24);
    const experienceScore = Math.min(accountAgeDays / 30, 100); // Max 100 points for 3+ years
    
    // Calculate activity score based on recent login (0-100)
    const daysSinceLogin = (Date.now() - new Date(user.lastLogin).getTime()) / (1000 * 60 * 60 * 24);
    const activityScore = Math.max(0, 100 - daysSinceLogin); // More points for recent activity
    
    // Weighted score calculation
    const score = (
      (roi * 0.4) +           // 40% weight to ROI
      (diversificationScore * 0.25) +  // 25% weight to diversification
      (experienceScore * 0.2) +        // 20% weight to experience
      (activityScore * 0.15)           // 15% weight to activity
    );
    
    return Math.round(Math.max(0, Math.min(100, score))); // Clamp between 0-100
  }

  // Add scores to users
  useEffect(() => {
    const usersWithScores = mockUsers.map(user => ({
      ...user,
      score: calculateUserScore(user)
    }));
    
    setUsers(usersWithScores);
    setLoading(false);
  }, [mockUsers]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Sort users based on selected criteria
  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'score') {
      return (b.score || 0) - (a.score || 0);
    } else if (sortBy === 'value') {
      return (b.portfolio?.totalValue || 0) - (a.portfolio?.totalValue || 0);
    } else if (sortBy === 'roi') {
      const roiA = a.portfolio?.totalInvested ? 
        ((a.portfolio.totalValue - a.portfolio.totalInvested) / a.portfolio.totalInvested) * 100 : 0;
      const roiB = b.portfolio?.totalInvested ? 
        ((b.portfolio.totalValue - b.portfolio.totalInvested) / b.portfolio.totalInvested) * 100 : 0;
      return roiB - roiA;
    }
    return 0;
  });

  // Render loading skeleton
  if (loading) {
    return (
      <ResponsiveLayout activePage="users">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-16 w-16"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout activePage="users">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
            User Portfolio Analysis
          </h1>
          <div className="flex flex-wrap gap-3">
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium ${sortBy === 'score' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              onClick={() => setSortBy('score')}
            >
              Sort by Score
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium ${sortBy === 'value' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              onClick={() => setSortBy('value')}
            >
              Sort by Value
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium ${sortBy === 'roi' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              onClick={() => setSortBy('roi')}
            >
              Sort by ROI
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Total Users</div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{users.length}</div>
          </div>
          
          <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Avg. Score</div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
              {users.length ? Math.round(users.reduce((sum, user) => sum + (user.score || 0), 0) / users.length) : 0}
            </div>
          </div>
          
          <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Top Portfolio</div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
              {users.length ? formatCurrency(Math.max(...users.map(u => u.portfolio?.totalValue || 0))) : '$0'}
            </div>
          </div>
          
          <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Best Performer</div>
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
              {users.length ? 
                users.reduce((best, user) => {
                  const roi = user.portfolio?.totalInvested ? 
                    ((user.portfolio.totalValue - user.portfolio.totalInvested) / user.portfolio.totalInvested) * 100 : 0;
                  const bestRoi = best.portfolio?.totalInvested ? 
                    ((best.portfolio.totalValue - best.portfolio.totalInvested) / best.portfolio.totalInvested) * 100 : 0;
                  return roi > bestRoi ? user : best;
                }, users[0])?.name || 'N/A' : 'N/A'}
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedUsers.map((user) => (
            <div 
              key={user.uid} 
              className={`rounded-xl border p-6 cursor-pointer transition-all hover:shadow-lg ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border hover:bg-opacity-70' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center space-x-4">
                <Image 
                  src={user.photoURL} 
                  alt={user.name} 
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
                <div>
                  <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
                    {user.name}
                  </h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                    {user.email}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Portfolio Value</span>
                  <span className={`font-medium ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
                    {formatCurrency(user.portfolio?.totalValue || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>ROI</span>
                  <span className={`font-medium ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
                    {user.portfolio?.totalInvested ? 
                      `${(((user.portfolio.totalValue - user.portfolio.totalInvested) / user.portfolio.totalInvested) * 100).toFixed(1)}%` : 
                      '0%'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Diversification</span>
                  <span className={`font-medium ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
                    {user.portfolio?.holdings.length || 0} assets
                  </span>
                </div>
                
                <div className="pt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>User Score</span>
                    <span className={`text-sm font-bold ${user.score && user.score >= 80 ? 'text-green-500' : user.score && user.score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {user.score || 0}/100
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className={`h-2 rounded-full ${user.score && user.score >= 80 ? 'bg-green-500' : user.score && user.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${user.score || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl border max-w-4xl w-full max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-card bg-opacity-100 border-border' : 'bg-white border-gray-200'}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
                  {selectedUser.name}&apos;s Portfolio
                </h2>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Info */}
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <Image 
                      src={selectedUser.photoURL} 
                      alt={selectedUser.name} 
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
                        {selectedUser.name}
                      </h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                        {selectedUser.email}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${selectedUser.score && selectedUser.score >= 80 ? 'bg-green-900 text-green-300' : selectedUser.score && selectedUser.score >= 60 ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>
                          Score: {selectedUser.score || 0}/100
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`rounded-lg border p-4 mb-6 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`font-bold mb-3 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Portfolio Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Total Value</span>
                        <span className={`font-medium ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
                          {formatCurrency(selectedUser.portfolio?.totalValue || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Total Invested</span>
                        <span className={`font-medium ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
                          {formatCurrency(selectedUser.portfolio?.totalInvested || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Profit/Loss</span>
                        <span className={`font-medium ${selectedUser.portfolio && selectedUser.portfolio.totalInvested && selectedUser.portfolio.totalValue >= selectedUser.portfolio.totalInvested ? 'text-green-500' : 'text-red-500'}`}>
                          {selectedUser.portfolio?.totalInvested ? 
                            formatCurrency(selectedUser.portfolio.totalValue - selectedUser.portfolio.totalInvested) : 
                            '$0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>ROI</span>
                        <span className={`font-medium ${selectedUser.portfolio && selectedUser.portfolio.totalInvested && selectedUser.portfolio.totalValue >= selectedUser.portfolio.totalInvested ? 'text-green-500' : 'text-red-500'}`}>
                          {selectedUser.portfolio?.totalInvested ? 
                            `${(((selectedUser.portfolio.totalValue - selectedUser.portfolio.totalInvested) / selectedUser.portfolio.totalInvested) * 100).toFixed(2)}%` : 
                            '0%'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`rounded-lg border p-4 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`font-bold mb-3 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Holdings</h4>
                    <div className="space-y-3">
                      {selectedUser.portfolio?.holdings.map((holding, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className={`font-medium ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
                              {holding.symbol}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
                              {holding.amount} {holding.symbol}
                            </div>
                            <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                              {formatCurrency(holding.amount * holding.currentPrice)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Charts */}
                <div>
                  <div className={`rounded-lg border p-4 mb-6 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`font-bold mb-4 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Asset Allocation</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={selectedUser.portfolio?.holdings.map((holding, index) => ({
                            name: holding.symbol,
                            value: holding.amount * holding.currentPrice,
                            color: COLORS[index % COLORS.length]
                          })) || []}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} horizontal={true} vertical={false} />
                          <XAxis 
                            type="number" 
                            stroke={theme === 'dark' ? '#9CA3AF' : '#6b7280'} 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                          />
                          <YAxis 
                            type="category" 
                            dataKey="name" 
                            stroke={theme === 'dark' ? '#9CA3AF' : '#6b7280'} 
                            tick={{ fontSize: 12 }}
                            width={40}
                          />
                          <Tooltip 
                            formatter={(value) => [formatCurrency(Number(value)), 'Value']}
                            contentStyle={theme === 'dark' ? { 
                              backgroundColor: '#1e293b', 
                              borderColor: '#334155',
                              color: '#f1f5f9'
                            } : { 
                              backgroundColor: '#fff', 
                              borderColor: '#e5e7eb',
                              color: '#111827'
                            }}
                          />
                          <Bar dataKey="value" name="Value">
                            {selectedUser.portfolio?.holdings.map((holding, index) => (
                              <rect key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className={`rounded-lg border p-4 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`font-bold mb-4 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-card' : 'bg-white'}`}>
                        <div className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Diversification</div>
                        <div className={`text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
                          {selectedUser.portfolio?.holdings.length || 0}/5
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(selectedUser.portfolio?.holdings.length || 0) * 20}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-card' : 'bg-white'}`}>
                        <div className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>ROI</div>
                        <div className={`text-xl font-bold ${selectedUser.portfolio && selectedUser.portfolio.totalInvested && selectedUser.portfolio.totalValue >= selectedUser.portfolio.totalInvested ? 'text-green-500' : 'text-red-500'}`}>
                          {selectedUser.portfolio?.totalInvested ? 
                            `${(((selectedUser.portfolio.totalValue - selectedUser.portfolio.totalInvested) / selectedUser.portfolio.totalInvested) * 100).toFixed(1)}%` : 
                            '0%'}
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-card' : 'bg-white'}`}>
                        <div className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Account Age</div>
                        <div className={`text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
                          {Math.floor((Date.now() - new Date(selectedUser.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-card' : 'bg-white'}`}>
                        <div className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Last Active</div>
                        <div className={`text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
                          {Math.floor((Date.now() - new Date(selectedUser.lastLogin).getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ResponsiveLayout>
  );
}