"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface Asset {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  price: number;
  change24h: number;
  allocation: number;
}

interface Transaction {
  id: number;
  type: string;
  asset: string;
  amount: number;
  value: number;
  date: string;
  status: string;
}

interface PortfolioData {
  totalValue: number;
  change24h: number;
  assets: Asset[];
  transactions: Transaction[];
}

const PortfolioChart = () => {
  const { theme } = useTheme();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        const data: PortfolioData = await response.json();
        setPortfolioData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load portfolio data');
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
        <div className="animate-pulse">
          <div className={`rounded w-1/4 mb-6 ${theme === 'dark' ? 'h-6 bg-card' : 'h-6 bg-gray-200'}`}></div>
          <div className={`rounded h-64 ${theme === 'dark' ? 'bg-card' : 'bg-gray-200'}`}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
        <div className={theme === 'dark' ? 'text-destructive' : 'text-red-500'}>Error: {error}</div>
      </div>
    );
  }

  if (!portfolioData) {
    return null;
  }

  // Find the best performing asset
  const bestPerformer = portfolioData.assets.reduce((prev, current) => 
    (prev.change24h > current.change24h) ? prev : current
  );

  return (
    <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Portfolio Performance</h2>
        <div className="text-green-500">+{portfolioData.change24h}% (24h)</div>
      </div>
      
      <div className="h-64 flex items-end space-x-1">
        {[20, 40, 30, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85, 95, 90, 100, 95, 110, 105, 120].map((height, index) => (
          <div 
            key={index} 
            className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
            style={{ height: `${height}%` }}
          ></div>
        ))}
      </div>
      
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-card' : 'bg-gray-50'}`}>
          <div className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Total Value</div>
          <div className={`font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>${portfolioData.totalValue.toLocaleString()}</div>
        </div>
        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-card' : 'bg-gray-50'}`}>
          <div className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Assets</div>
          <div className={`font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{portfolioData.assets.length}</div>
        </div>
        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-card' : 'bg-gray-50'}`}>
          <div className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Best Performer</div>
          <div className={`font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
            {bestPerformer.symbol}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-card' : 'bg-gray-50'}`}>
          <div className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Transactions</div>
          <div className={`font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{portfolioData.transactions.length}</div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart;