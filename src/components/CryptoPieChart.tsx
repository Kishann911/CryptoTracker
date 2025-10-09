"use client";

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface PieDataPoint {
  name: string;
  value: number;
  color: string;
}

interface CryptoPieChartProps {
  data: PieDataPoint[];
  title?: string;
}

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#06b6d4'];

const CryptoPieChart = ({ data, title = "Portfolio Allocation" }: CryptoPieChartProps) => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<'value' | 'percentage'>('percentage');

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
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`bg-card border border-border p-3 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{data.name}</p>
          <p className="text-sm" style={{ color: data.color }}>
            {viewMode === 'value' ? formatCurrency(data.value) : `${data.percent.toFixed(2)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate total value for percentage calculations
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  // Add percentages to data
  const dataWithPercentages = data.map(item => ({
    ...item,
    percent: totalValue > 0 ? (item.value / totalValue) * 100 : 0
  }));

  return (
    <div className={`rounded-xl border p-4 sm:p-6 ${theme === 'dark' ? 'bg-card bg-opacity-50 border-border' : 'bg-white border-gray-200'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h2 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{title}</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded-lg text-sm ${viewMode === 'percentage' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={() => setViewMode('percentage')}
          >
            %
          </button>
          <button 
            className={`px-3 py-1 rounded-lg text-sm ${viewMode === 'value' ? 'bg-primary text-primary-foreground' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={() => setViewMode('value')}
          >
            $
          </button>
        </div>
      </div>
      
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithPercentages}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }: any) => (
                <text 
                  className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} 
                  fontSize={12}
                >
                  {`${name}: ${(percent).toFixed(0)}%`}
                </text>
              )}
            >
              {dataWithPercentages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value, entry, index) => (
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Total Portfolio</div>
          <div className={`font-bold text-lg ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
            {formatCurrency(totalValue)}
          </div>
        </div>
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Assets Count</div>
          <div className={`font-bold text-lg ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{data.length}</div>
        </div>
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Top Asset</div>
          <div className={`font-bold text-lg ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
            {dataWithPercentages.length > 0 
              ? dataWithPercentages.reduce((max, item) => item.percent > (max as any).percent ? item : max).name 
              : 'N/A'}
          </div>
        </div>
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-card bg-opacity-50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Diversification</div>
          <div className={`font-bold text-lg ${data.length > 3 ? 'text-green-500' : data.length > 1 ? 'text-yellow-500' : 'text-red-500'}`}>
            {data.length > 3 ? 'High' : data.length > 1 ? 'Medium' : 'Low'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPieChart;