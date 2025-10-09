"use client";

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface BarDataPoint {
  name: string;
  value: number;
  bitcoin?: number;
  ethereum?: number;
}

interface CryptoBarChartProps {
  data: BarDataPoint[];
  title?: string;
}

const CryptoBarChart = ({ data, title = "Cryptocurrency Comparison" }: CryptoBarChartProps) => {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<'1d' | '7d' | '30d' | '90d' | '1y'>('30d');

  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`border p-3 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-xl border p-4 sm:p-6 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h2 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{title}</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded-lg text-sm ${timeRange === '1d' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={() => setTimeRange('1d')}
          >
            1D
          </button>
          <button 
            className={`px-3 py-1 rounded-lg text-sm ${timeRange === '7d' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={() => setTimeRange('7d')}
          >
            7D
          </button>
          <button 
            className={`px-3 py-1 rounded-lg text-sm ${timeRange === '30d' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={() => setTimeRange('30d')}
          >
            30D
          </button>
          <button 
            className={`px-3 py-1 rounded-lg text-sm ${timeRange === '90d' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={() => setTimeRange('90d')}
          >
            90D
          </button>
          <button 
            className={`px-3 py-1 rounded-lg text-sm ${timeRange === '1y' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={() => setTimeRange('1y')}
          >
            1Y
          </button>
        </div>
      </div>
      
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="name" 
              stroke={theme === 'dark' ? '#9CA3AF' : '#6b7280'} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke={theme === 'dark' ? '#9CA3AF' : '#6b7280'} 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            {data.some(item => item.value !== undefined) && (
              <Bar 
                dataKey="value" 
                fill="#3b82f6" 
                name="Portfolio"
                radius={[4, 4, 0, 0]}
              />
            )}
            {data.some(item => item.bitcoin !== undefined) && (
              <Bar 
                dataKey="bitcoin" 
                fill="#f59e0b" 
                name="Bitcoin"
                radius={[4, 4, 0, 0]}
              />
            )}
            {data.some(item => item.ethereum !== undefined) && (
              <Bar 
                dataKey="ethereum" 
                fill="#8b5cf6" 
                name="Ethereum"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Total Assets</div>
          <div className={`font-bold text-lg ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
            {data.length > 0 ? formatCurrency(data.reduce((sum, item) => sum + (item.value || 0), 0)) : '$0'}
          </div>
        </div>
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Bitcoin Dominance</div>
          <div className={`font-bold text-lg ${theme === 'dark' ? 'text-yellow-500' : 'text-yellow-600'}`}>62.3%</div>
        </div>
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Top Gainer</div>
          <div className={`font-bold text-lg ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>Bitcoin</div>
        </div>
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Total Volume</div>
          <div className={`font-bold text-lg ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>$1.2B</div>
        </div>
      </div>
    </div>
  );
};

export default CryptoBarChart;