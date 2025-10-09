"use client";

import Link from "next/link";
import CryptoLineChart from "@/components/CryptoLineChart";
import CryptoBarChart from "@/components/CryptoBarChart";
import CryptoPieChart from "@/components/CryptoPieChart";

// Sample data for all charts
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

export default function TestCharts() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Chart Components Test</h1>
          <Link 
            href="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Back to Home
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-4">Line Chart</h2>
            <CryptoLineChart data={lineChartData} title="Cryptocurrency Prices" />
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-4">Bar Chart</h2>
            <CryptoBarChart data={barChartData} title="Asset Distribution" />
          </div>
        </div>
        
        <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Pie Chart</h2>
          <CryptoPieChart data={pieChartData} title="Portfolio Allocation" />
        </div>
      </div>
    </div>
  );
}