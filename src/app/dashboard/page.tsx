"use client";

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { useTheme } from '@/context/ThemeContext';

// Mock data for the dashboard
const portfolioData = {
  totalValue: 24568.90,
  change24h: 12.5,
  totalInvested: 20000,
  profitLoss: 4568.90,
  roi: 22.8,
  holdings: [
    { name: "Bitcoin", symbol: "BTC", amount: 0.5, value: 12500.00, change24h: 2.5, allocation: 50.9 },
    { name: "Ethereum", symbol: "ETH", amount: 5.2, value: 8320.00, change24h: -1.2, allocation: 33.9 },
    { name: "Cardano", symbol: "ADA", amount: 10000, value: 3500.00, change24h: 5.7, allocation: 14.2 },
    { name: "Solana", symbol: "SOL", amount: 25, value: 248.90, change24h: 8.3, allocation: 1.0 },
  ],
  recentActivity: [
    { id: 1, type: "buy", asset: "BTC", amount: 0.1, value: 2500.00, time: "2 hours ago" },
    { id: 2, type: "sell", asset: "ETH", amount: 1.0, value: 1600.00, time: "1 day ago" },
    { id: 3, type: "alert", asset: "ADA", message: "Price target reached", time: "2 days ago" },
    { id: 4, type: "buy", asset: "SOL", amount: 10, value: 95.50, time: "3 days ago" },
  ],
  topMovers: [
    { name: "Solana", symbol: "SOL", change: 8.3, price: 95.50 },
    { name: "Cardano", symbol: "ADA", change: 5.7, price: 0.35 },
    { name: "Bitcoin", symbol: "BTC", change: 2.5, price: 25000 },
    { name: "Ethereum", symbol: "ETH", change: -1.2, price: 1600 },
  ],
  alerts: [
    { id: 1, asset: "BTC", condition: "Price > $50,000", status: "active" },
    { id: 2, asset: "ETH", condition: "Price < $1,500", status: "triggered" },
    { id: 3, asset: "ADA", condition: "Allocation > 20%", status: "active" },
  ],
  insights: [
    { id: 1, type: "rebalancing", message: "You're overweight on BTC (55% vs target 40%). Consider selling 0.1 BTC." },
    { id: 2, type: "tax", message: "You have 5 realized transactions with total taxable gain of $1200." },
    { id: 3, type: "roi", message: "Top Performing Asset: ETH (+24.6%)" },
  ],
  portfolioValueHistory: [
    { date: "Jan 1", value: 15000 },
    { date: "Jan 8", value: 16200 },
    { date: "Jan 15", value: 14800 },
    { date: "Jan 22", value: 17500 },
    { date: "Jan 29", value: 18200 },
    { date: "Feb 5", value: 19800 },
    { date: "Feb 12", value: 21000 },
    { date: "Feb 19", value: 22500 },
    { date: "Feb 26", value: 24000 },
    { date: "Mar 5", value: 23500 },
    { date: "Mar 12", value: 24568.90 },
  ]
};

// Color palette for charts
const COLORS = ['#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#10b981'];

export default function Dashboard() {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<'1d' | '1w' | '1m' | '3m' | '1y' | 'all'>('1m');
  const [notifications, setNotifications] = useState(3);

  // Simulate data loading
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`border p-3 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'value' ? 'Portfolio' : entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render loading skeleton
  if (loading) {
    return (
      <ResponsiveLayout activePage="dashboard">
        <div className="animate-pulse">
          {/* Summary cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`h-24 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            ))}
          </div>
          
          {/* Charts skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className={`h-80 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-80 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
          
          {/* Widgets skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className={`h-64 rounded-xl lg:col-span-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-64 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
          
          {/* Tables skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`h-64 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-64 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout activePage="dashboard">
      {/* Portfolio Summary Bar */}
      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Total Portfolio Value</div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{formatCurrency(portfolioData.totalValue)}</div>
            <div className="text-green-500 mt-1">+{portfolioData.change24h}% (24h)</div>
          </div>
          
          <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Total Invested</div>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{formatCurrency(portfolioData.totalInvested)}</div>
            <div className={`mt-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Since inception</div>
          </div>
          
          <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Profit / Loss</div>
            <div className={`text-2xl font-bold text-green-500 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>+{formatCurrency(portfolioData.profitLoss)}</div>
            <div className="text-green-500 mt-1">+{portfolioData.roi}% ROI</div>
          </div>
          
          <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Best Performer</div>
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Solana (SOL)</div>
            <div className="text-green-500 mt-1">+8.3% (24h)</div>
          </div>
          
          <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
            <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Portfolio Health</div>
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Good</div>
            <div className={`mt-1 text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Diversified</div>
          </div>
        </div>
      </div>
      
      {/* Performance & Allocation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Portfolio Value Graph */}
        <div className={`rounded-xl border p-4 sm:p-6 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Portfolio Performance</h2>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${timeRange === '1d' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                onClick={() => setTimeRange('1d')}
              >
                1D
              </button>
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${timeRange === '1w' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                onClick={() => setTimeRange('1w')}
              >
                1W
              </button>
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${timeRange === '1m' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                onClick={() => setTimeRange('1m')}
              >
                1M
              </button>
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${timeRange === '3m' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                onClick={() => setTimeRange('3m')}
              >
                3M
              </button>
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${timeRange === '1y' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                onClick={() => setTimeRange('1y')}
              >
                1Y
              </button>
              <button 
                className={`px-3 py-1 rounded-lg text-sm ${timeRange === 'all' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                onClick={() => setTimeRange('all')}
              >
                ALL
              </button>
            </div>
          </div>
          
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={portfolioData.portfolioValueHistory}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="date" 
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6b7280'} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6b7280'} 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 3, fill: theme === 'dark' ? '#1e293b' : '#fff' }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: theme === 'dark' ? '#1e293b' : '#fff' }}
                  name="Portfolio Value"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Asset Allocation Pie Chart */}
        <div className={`rounded-xl border p-4 sm:p-6 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Asset Allocation</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={portfolioData.holdings}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="symbol"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {portfolioData.holdings.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 gap-3 sm:gap-4 w-full md:w-auto">
              {portfolioData.holdings.map((asset, index) => (
                <div key={asset.symbol} className={`flex items-center justify-between p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className={`font-medium ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{asset.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{asset.allocation}%</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>{formatCurrency(asset.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Market Insights & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top Movers */}
        <div className={`rounded-xl border p-4 sm:p-6 lg:col-span-2 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Top Movers</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolioData.topMovers.map((asset, index) => (
              <div key={asset.symbol} className={`flex items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
                <div>
                  <div className={`font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{asset.name} ({asset.symbol})</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>{formatCurrency(asset.price)}</div>
                </div>
                <div className={`font-bold ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {asset.change >= 0 ? '+' : ''}{asset.change}%
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Custom Alerts */}
        <div className={`rounded-xl border p-4 sm:p-6 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Alerts</h2>
            <button className={`text-sm ${theme === 'dark' ? 'text-primary hover:text-primary/80' : 'text-blue-600 hover:text-blue-500'}`}>View All</button>
          </div>
          
          <div className="space-y-4">
            {portfolioData.alerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className={`font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{alert.asset}</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>{alert.condition}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${alert.status === 'active' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'}`}>
                    {alert.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <button className={`w-full mt-4 py-2 text-center rounded-lg text-sm ${theme === 'dark' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
            Create New Alert
          </button>
        </div>
      </div>
      
      {/* Transaction History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Assets Table */}
        <div className={`rounded-xl border p-4 sm:p-6 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Your Assets</h2>
            <button className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
              Add Asset
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className={`pb-3 text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Asset</th>
                  <th className={`pb-3 text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Holdings</th>
                  <th className={`pb-3 text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Value</th>
                  <th className={`pb-3 text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Allocation</th>
                  <th className={`pb-3 text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>24h</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.holdings.map((asset, index) => (
                  <tr key={index} className={`border-t ${theme === 'dark' ? 'border-border' : 'border-gray-200'}`}>
                    <td className="py-3">
                      <div className={`font-bold text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{asset.name}</div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>{asset.symbol}</div>
                    </td>
                    <td className={`py-3 text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{asset.amount}</td>
                    <td className={`py-3 text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{formatCurrency(asset.value)}</td>
                    <td className={`py-3 text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{asset.allocation}%</td>
                    <td className={`py-3 text-sm ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className={`rounded-xl border p-4 sm:p-6 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Recent Activity</h2>
            <button className={`text-sm ${theme === 'dark' ? 'text-primary hover:text-primary/80' : 'text-blue-600 hover:text-blue-500'}`}>View All</button>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {portfolioData.recentActivity.map((activity) => (
              <div key={activity.id} className={`flex items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3 sm:mr-4">
                  {activity.type === 'buy' && '💰'}
                  {activity.type === 'sell' && '💸'}
                  {activity.type === 'alert' && '🔔'}
                </div>
                <div className="flex-1">
                  <div className={`font-bold text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{activity.type === 'buy' && `Bought ${activity.asset}`}
                    {activity.type === 'sell' && `Sold ${activity.asset}`}
                    {activity.type === 'alert' && activity.message}</div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                    {activity.type !== 'alert' && activity.value && `${activity.amount} ${activity.asset} for ${formatCurrency(activity.value)}`}
                  </div>
                </div>
                <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Smart Insights */}
      <div className={`rounded-xl border p-4 sm:p-6 mb-8 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Smart Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {portfolioData.insights.map((insight) => (
            <div key={insight.id} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
              <div className="flex items-start">
                <div className="mr-3">
                  {insight.type === 'rebalancing' && (
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <span>⚖️</span>
                    </div>
                  )}
                  {insight.type === 'tax' && (
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span>💰</span>
                    </div>
                  )}
                  {insight.type === 'roi' && (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <span>📈</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className={`font-bold capitalize ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{insight.type} Insight</div>
                  <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-foreground' : 'text-gray-700'}`}>{insight.message}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className={`text-center py-6 text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
        <p>© 2023 CryptoTracker. All rights reserved.</p>
      </div>
    </ResponsiveLayout>
  );
}