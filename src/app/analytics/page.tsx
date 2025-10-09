"use client";

import ResponsiveLayout from "@/components/ResponsiveLayout";
import { useTheme } from '@/context/ThemeContext';

export default function Analytics() {
  const { theme } = useTheme();
  
  // Mock data
  const performanceData = [
    { month: "Jan", value: 10000 },
    { month: "Feb", value: 12000 },
    { month: "Mar", value: 11000 },
    { month: "Apr", value: 14000 },
    { month: "May", value: 13000 },
    { month: "Jun", value: 16000 },
    { month: "Jul", value: 18000 },
    { month: "Aug", value: 17000 },
    { month: "Sep", value: 20000 },
    { month: "Oct", value: 22000 },
    { month: "Nov", value: 21000 },
    { month: "Dec", value: 24568 },
  ];

  const recommendations = [
    { title: "Diversify Portfolio", description: "Consider adding more altcoins to reduce risk", priority: "High" },
    { title: "Rebalance Holdings", description: "Bitcoin allocation is high, consider selling 10%", priority: "Medium" },
    { title: "Add Stablecoins", description: "Include stablecoins for market downturn protection", priority: "Low" },
  ];

  const getMaxValue = (data: { value: number }[]) => {
    return Math.max(...data.map(item => item.value));
  };

  const maxValue = getMaxValue(performanceData);

  return (
    <ResponsiveLayout activePage="analytics">
      <div className="mb-6 sm:mb-8">
        <h1 className={`text-xl sm:text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Portfolio Analytics</h1>
        <p className={theme === 'dark' ? 'text-muted-foreground text-sm sm:text-base' : 'text-gray-600 text-sm sm:text-base'}>Advanced insights and recommendations for your portfolio</p>
      </div>

      {/* Performance Chart */}
      <div className={`rounded-xl border p-4 sm:p-6 mb-6 sm:mb-8 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <h2 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Portfolio Performance</h2>
          <div className="flex space-x-2">
            <button className={`px-3 py-1.5 rounded-lg text-sm ${theme === 'dark' ? 'bg-card hover:bg-card/80 text-foreground border border-border' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'}`}>
              1M
            </button>
            <button className={`px-3 py-1.5 rounded-lg text-sm ${theme === 'dark' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
              6M
            </button>
            <button className={`px-3 py-1.5 rounded-lg text-sm ${theme === 'dark' ? 'bg-card hover:bg-card/80 text-foreground border border-border' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'}`}>
              1Y
            </button>
            <button className={`px-3 py-1.5 rounded-lg text-sm ${theme === 'dark' ? 'bg-card hover:bg-card/80 text-foreground border border-border' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'}`}>
              All
            </button>
          </div>
        </div>

        <div className="h-48 sm:h-64 flex items-end space-x-1 sm:space-x-2">
          {performanceData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                  style={{ height: `${(data.value / maxValue) * 100}%` }}
                ></div>
              </div>
              <div className={`text-xs mt-2 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>{data.month}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className={`rounded-xl border p-4 sm:p-6 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>AI Recommendations</h2>
          
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-card' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold text-sm sm:text-base ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{rec.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    rec.priority === "High" ? "bg-red-900 text-red-300" :
                    rec.priority === "Medium" ? "bg-yellow-900 text-yellow-300" :
                    "bg-green-900 text-green-300"
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className={theme === 'dark' ? 'text-muted-foreground text-sm' : 'text-gray-600 text-sm'}>{rec.description}</p>
                <button className={theme === 'dark' ? 'mt-3 text-primary hover:text-primary/80 text-sm' : 'mt-3 text-blue-600 hover:text-blue-500 text-sm'}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Analysis */}
        <div className={`rounded-xl border p-4 sm:p-6 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Risk Analysis</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className={`text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Portfolio Risk</span>
                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Moderate</span>
              </div>
              <div className={`rounded-full h-2 ${theme === 'dark' ? 'bg-card' : 'bg-gray-200'}`}>
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className={`text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Diversification</span>
                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Good</span>
              </div>
              <div className={`rounded-full h-2 ${theme === 'dark' ? 'bg-card' : 'bg-gray-200'}`}>
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className={`text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Volatility</span>
                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>High</span>
              </div>
              <div className={`rounded-full h-2 ${theme === 'dark' ? 'bg-card' : 'bg-gray-200'}`}>
                <div className="bg-red-500 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
            
            <div className={`pt-4 border-t ${theme === 'dark' ? 'border-border' : 'border-gray-200'}`}>
              <h3 className={`font-bold mb-3 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Asset Correlation</h3>
              <div className="flex items-center justify-center h-32">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-8 border-blue-500">
                  <div className="absolute top-0 left-0 w-12 h-24 sm:w-16 sm:h-32 bg-blue-500 rounded-l-full"></div>
                  <div className="absolute top-0 right-0 w-12 h-24 sm:w-16 sm:h-32 bg-green-500 rounded-r-full"></div>
                  <div className="absolute bottom-0 left-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-purple-500 rounded-tl-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}