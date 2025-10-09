"use client";

import Link from "next/link";
import CryptoLineChart from "@/components/CryptoLineChart";
import CryptoBarChart from "@/components/CryptoBarChart";
import CryptoPieChart from "@/components/CryptoPieChart";

// Sample data for charts
const lineChartData = [
  { date: "Jan 1", value: 15000, bitcoin: 42000, ethereum: 2800 },
  { date: "Jan 8", value: 16200, bitcoin: 43500, ethereum: 2900 },
  { date: "Jan 15", value: 14800, bitcoin: 41000, ethereum: 2700 },
  { date: "Jan 22", value: 17500, bitcoin: 45000, ethereum: 3100 },
  { date: "Jan 29", value: 18200, bitcoin: 46500, ethereum: 3200 },
  { date: "Feb 5", value: 19800, bitcoin: 48000, ethereum: 3300 },
  { date: "Feb 12", value: 21000, bitcoin: 51000, ethereum: 3500 },
  { date: "Feb 19", value: 22500, bitcoin: 53000, ethereum: 3700 },
  { date: "Feb 26", value: 24000, bitcoin: 55000, ethereum: 3900 },
  { date: "Mar 5", value: 23500, bitcoin: 54000, ethereum: 3800 },
];

const barChartData = [
  { name: "Bitcoin", value: 12500, bitcoin: 25000 },
  { name: "Ethereum", value: 8320, ethereum: 18000 },
  { name: "Cardano", value: 3200, bitcoin: 1200 },
  { name: "Solana", value: 4500, ethereum: 9500 },
  { name: "Polkadot", value: 2100, bitcoin: 6500 },
];

const pieChartData = [
  { name: "Bitcoin", value: 12500, color: "#f59e0b" },
  { name: "Ethereum", value: 8320, color: "#8b5cf6" },
  { name: "Cardano", value: 3200, color: "#06b6d4" },
  { name: "Solana", value: 4500, color: "#ef4444" },
  { name: "Polkadot", value: 2100, color: "#10b981" },
];

export default function Demo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <Link href="/" className="inline-block mb-8 text-blue-500 hover:text-blue-400">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">CryptoTracker Demo</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the powerful features of our crypto portfolio tracking platform
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link href="/help" className="text-blue-400 hover:text-blue-300">
              Need help? Visit our Help Center
            </Link>
            <Link href="/alerts" className="text-blue-400 hover:text-blue-300">
              Set up alerts
            </Link>
            <Link href="/test-links" className="text-blue-400 hover:text-blue-300">
              Test Links
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-gray-800 bg-opacity-50 rounded-2xl border border-gray-700 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center mr-4">
                <span className="text-xl">📊</span>
              </div>
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            </div>
            
            <p className="text-gray-300 mb-6">
              Get a comprehensive view of your portfolio performance with real-time data, 
              asset allocation charts, and recent activity tracking.
            </p>
            
            <div className="mb-6">
              <CryptoLineChart data={lineChartData} title="Portfolio Performance" />
            </div>
            
            <Link 
              href="/dashboard" 
              className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              View Dashboard
            </Link>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-2xl border border-gray-700 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center mr-4">
                <span className="text-xl">💼</span>
              </div>
              <h2 className="text-2xl font-bold">Portfolio Management</h2>
            </div>
            
            <p className="text-gray-300 mb-6">
              Manage your crypto assets with detailed holdings information, 
              transaction history, and performance analytics.
            </p>
            
            <div className="mb-6">
              <CryptoBarChart data={barChartData} title="Asset Distribution" />
            </div>
            
            <Link 
              href="/portfolio" 
              className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Manage Portfolio
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-gray-800 bg-opacity-50 rounded-2xl border border-gray-700 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center mr-4">
                <span className="text-xl">📈</span>
              </div>
              <h2 className="text-2xl font-bold">Advanced Analytics</h2>
            </div>
            
            <p className="text-gray-300 mb-6">
              Gain deeper insights with our AI-powered analytics, risk metrics, 
              and portfolio health scoring system.
            </p>
            
            <div className="mb-6">
              <CryptoPieChart data={pieChartData} title="Portfolio Allocation" />
            </div>
            
            <Link 
              href="/analytics" 
              className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              View Analytics
            </Link>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-2xl border border-gray-700 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center mr-4">
                <span className="text-xl">⚙️</span>
              </div>
              <h2 className="text-2xl font-bold">Customizable Settings</h2>
            </div>
            
            <p className="text-gray-300 mb-6">
              Personalize your experience with notification preferences, 
              exchange integrations, and security settings.
            </p>
            
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">Price Alerts</div>
                    <div className="text-gray-400 text-sm">Get notified when assets reach target prices</div>
                  </div>
                  <div className="w-11 h-6 bg-blue-600 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">Portfolio Updates</div>
                    <div className="text-gray-400 text-sm">Daily performance summaries</div>
                  </div>
                  <div className="w-11 h-6 bg-blue-600 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">Binance Integration</div>
                    <div className="text-gray-400 text-sm">Connected account</div>
                  </div>
                  <div className="w-11 h-6 bg-gray-700 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <Link 
              href="/settings" 
              className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Configure Settings
            </Link>
          </div>
        </div>
        
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of crypto investors who trust CryptoTracker to manage their digital assets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 text-center"
            >
              Create Free Account
            </Link>
            <Link 
              href="/login" 
              className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-8 rounded-lg transition duration-300 text-center"
            >
              Login to Existing Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}