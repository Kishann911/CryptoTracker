"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface PerformanceDataPoint {
  date: string;
  value: number;
  bitcoin?: number;
  ethereum?: number;
}

interface CryptoLineChartProps {
  data: PerformanceDataPoint[];
  title?: string;
}

const CryptoLineChart = ({ data, title = "Cryptocurrency Prices" }: CryptoLineChartProps) => {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>('6m');

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
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`border p-3 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'value' ? 'Portfolio' : entry.dataKey}: {formatCurrency(entry.value)}
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
            className={`px-3 py-1 rounded-lg text-sm ${timeRange === '6m' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={() => setTimeRange('6m')}
          >
            6M
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
            All
          </button>
        </div>
      </div>
      
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
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
            {data.some(item => item.value !== undefined) && (
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 3, fill: theme === 'dark' ? '#1e293b' : '#fff' }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: theme === 'dark' ? '#1e293b' : '#fff' }}
                name="Portfolio"
              />
            )}
            {data.some(item => item.bitcoin !== undefined) && (
              <Line 
                type="monotone" 
                dataKey="bitcoin" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ stroke: '#f59e0b', strokeWidth: 2, r: 3, fill: theme === 'dark' ? '#1e293b' : '#fff' }}
                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2, fill: theme === 'dark' ? '#1e293b' : '#fff' }}
                name="Bitcoin"
              />
            )}
            {data.some(item => item.ethereum !== undefined) && (
              <Line 
                type="monotone" 
                dataKey="ethereum" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 3, fill: theme === 'dark' ? '#1e293b' : '#fff' }}
                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: theme === 'dark' ? '#1e293b' : '#fff' }}
                name="Ethereum"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Current Value</div>
          <div className={`font-bold text-lg ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
            {data.length > 0 ? formatCurrency(data[data.length - 1].value || 0) : '$0'}
          </div>
        </div>
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Change (24h)</div>
          <div className={`font-bold text-lg ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>+2.5%</div>
        </div>
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>All Time High</div>
          <div className={`font-bold text-lg ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>$28,450</div>
        </div>
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Volatility</div>
          <div className={`font-bold text-lg ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>12.4%</div>
        </div>
      </div>
    </div>
  );
};

export default CryptoLineChart;