"use client";

import { useState } from "react";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { useTheme } from '@/context/ThemeContext';

export default function Portfolio() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("holdings");
  
  // Mock data
  const portfolioData = {
    totalValue: 24568.90,
    change24h: 12.5,
    assets: [
      { 
        id: 1, 
        name: "Bitcoin", 
        symbol: "BTC", 
        amount: 0.5, 
        value: 12500.00, 
        price: 25000.00,
        change24h: 2.5,
        allocation: 50.0
      },
      { 
        id: 2, 
        name: "Ethereum", 
        symbol: "ETH", 
        amount: 5.2, 
        value: 8320.00, 
        price: 1600.00,
        change24h: -1.2,
        allocation: 33.0
      },
      { 
        id: 3, 
        name: "Cardano", 
        symbol: "ADA", 
        amount: 10000, 
        value: 3500.00, 
        price: 0.35,
        change24h: 5.7,
        allocation: 14.0
      },
      { 
        id: 4, 
        name: "Solana", 
        symbol: "SOL", 
        amount: 25, 
        value: 2248.90, 
        price: 89.96,
        change24h: 8.3,
        allocation: 9.0
      },
    ],
    transactions: [
      { id: 1, type: "buy", asset: "BTC", amount: 0.1, value: 2500.00, date: "2023-05-15", status: "completed" },
      { id: 2, type: "sell", asset: "ETH", amount: 1.0, value: 1600.00, date: "2023-05-10", status: "completed" },
      { id: 3, type: "buy", asset: "SOL", amount: 10, value: 899.60, date: "2023-05-05", status: "completed" },
    ]
  };

  return (
    <ResponsiveLayout activePage="portfolio">
      <div className="mb-6 sm:mb-8">
        <h1 className={`text-xl sm:text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Portfolio Management</h1>
        <p className={theme === 'dark' ? 'text-muted-foreground text-sm sm:text-base' : 'text-gray-600 text-sm sm:text-base'}>Manage your crypto assets and track performance</p>
      </div>
      
      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 sm:mb-8">
        <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
          <div className={`text-xs sm:text-sm mb-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Total Portfolio Value</div>
          <div className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>${portfolioData.totalValue.toLocaleString()}</div>
        </div>
        
        <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
          <div className={`text-xs sm:text-sm mb-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>24h Change</div>
          <div className="text-lg sm:text-xl font-bold text-green-500">+{portfolioData.change24h}%</div>
        </div>
        
        <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
          <div className={`text-xs sm:text-sm mb-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Assets</div>
          <div className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{portfolioData.assets.length}</div>
        </div>
        
        <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
          <div className={`text-xs sm:text-sm mb-1 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Transactions</div>
          <div className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{portfolioData.transactions.length}</div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className={`flex border-b mb-6 sm:mb-8 overflow-x-auto ${theme === 'dark' ? 'border-border' : 'border-gray-200'}`}>
        <button 
          className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base whitespace-nowrap ${activeTab === 'holdings' ? 'border-b-2 border-primary text-primary' : theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}
          onClick={() => setActiveTab('holdings')}
        >
          Holdings
        </button>
        <button 
          className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base whitespace-nowrap ${activeTab === 'transactions' ? 'border-b-2 border-primary text-primary' : theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button 
          className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base whitespace-nowrap ${activeTab === 'analytics' ? 'border-b-2 border-primary text-primary' : theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>
      
      {/* Holdings Tab */}
      {activeTab === 'holdings' && (
        <div className={`rounded-xl border p-4 sm:p-6 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Your Assets</h2>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm ${
                  theme === 'dark' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                onClick={() => {
                  // Add asset functionality
                  const asset = prompt("Enter asset symbol (e.g., BTC, ETH):");
                  if (asset) {
                    alert(`Asset ${asset} has been added to your portfolio!`);
                  }
                }}
              >
                Add Asset
              </button>
              <button 
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm ${
                  theme === 'dark' ? 'bg-card hover:bg-card/80 text-foreground border border-border' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                }`}
                onClick={() => {
                  // Import functionality
                  alert("Portfolio data import started. This may take a few moments...");
                  setTimeout(() => {
                    alert("Portfolio data successfully imported!");
                  }, 2000);
                }}
              >
                Import
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs sm:text-sm">
                  <th className={`pb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Asset</th>
                  <th className={`pb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Holdings</th>
                  <th className={`pb-3 hidden sm:table-cell ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Price</th>
                  <th className={`pb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Value</th>
                  <th className={`pb-3 hidden sm:table-cell ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Allocation</th>
                  <th className={`pb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>24h</th>
                  <th className={`pb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.assets.map((asset) => (
                  <tr key={asset.id} className={`border-t ${theme === 'dark' ? 'border-border' : 'border-gray-200'}`}>
                    <td className="py-3">
                      <div className={`font-bold text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{asset.name}</div>
                      <div className={theme === 'dark' ? 'text-muted-foreground text-xs' : 'text-gray-500 text-xs'}>{asset.symbol}</div>
                    </td>
                    <td className={`py-3 text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{asset.amount}</td>
                    <td className={`py-3 text-sm hidden sm:table-cell ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>${asset.price.toLocaleString()}</td>
                    <td className={`py-3 text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>${asset.value.toLocaleString()}</td>
                    <td className={`py-3 text-sm hidden sm:table-cell ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{asset.allocation}%</td>
                    <td className={`py-3 text-sm ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button className={theme === 'dark' ? 'text-primary hover:text-primary/80 text-sm' : 'text-blue-600 hover:text-blue-500 text-sm'}
                          onClick={(e) => {
                            // Edit asset functionality
                            e.stopPropagation();
                            const row = e.currentTarget.closest('tr');
                            if (row) {
                              const assetName = row.querySelector('td:first-child div:first-child')?.textContent || 'Unknown Asset';
                              const newAmount = prompt(`Enter new amount for ${assetName}:`);
                              if (newAmount) {
                                alert(`Amount for ${assetName} has been updated to ${newAmount}!`);
                              }
                            }
                          }}
                        >
                          Edit
                        </button>
                        <button className={theme === 'dark' ? 'text-destructive hover:text-destructive/80 text-sm' : 'text-red-600 hover:text-red-500 text-sm'}
                          onClick={(e) => {
                            // Remove asset functionality
                            e.stopPropagation();
                            const row = e.currentTarget.closest('tr');
                            if (row) {
                              const assetName = row.querySelector('td:first-child div:first-child')?.textContent || 'Unknown Asset';
                              if (confirm(`Are you sure you want to remove ${assetName} from your portfolio?`)) {
                                alert(`${assetName} has been removed from your portfolio!`);
                              }
                            }
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className={`rounded-xl border p-4 sm:p-6 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Transaction History</h2>
            <button className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              onClick={() => {
                // Export CSV functionality
                alert("Exporting portfolio data to CSV...");
                // Simulate file download
                setTimeout(() => {
                  alert("Portfolio data exported successfully! Check your downloads folder.");
                }, 1500);
              }}
            >
              Export CSV
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs sm:text-sm">
                  <th className={`pb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Type</th>
                  <th className={`pb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Asset</th>
                  <th className={`pb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Amount</th>
                  <th className={`pb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Value</th>
                  <th className={`pb-3 hidden sm:table-cell ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Date</th>
                  <th className={`pb-3 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Status</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.transactions.map((transaction) => (
                  <tr key={transaction.id} className={`border-t ${theme === 'dark' ? 'border-border' : 'border-gray-200'}`}>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${transaction.type === 'buy' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </td>
                    <td className={`py-3 font-bold text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{transaction.asset}</td>
                    <td className={`py-3 text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{transaction.amount}</td>
                    <td className={`py-3 text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>${transaction.value.toLocaleString()}</td>
                    <td className={`py-3 text-sm hidden sm:table-cell ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>{transaction.date}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-card text-foreground' : 'bg-gray-100 text-gray-900'}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Performance Chart */}
          <div className={`rounded-xl border p-4 sm:p-6 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Portfolio Performance</h2>
            
            <div className="h-48 sm:h-64 flex items-end space-x-1">
              {[20, 40, 30, 50, 45, 60, 55, 70, 65, 80, 75, 90].map((height, index) => (
                <div 
                  key={index} 
                  className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Allocation Chart */}
          <div className={`rounded-xl border p-4 sm:p-6 ${theme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Asset Allocation</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-8 border-blue-500">
                  <div className="absolute top-0 left-0 w-16 h-32 sm:w-20 sm:h-40 bg-blue-500 rounded-l-full"></div>
                  <div className="absolute top-0 right-0 w-16 h-32 sm:w-20 sm:h-40 bg-green-500 rounded-r-full"></div>
                  <div className="absolute bottom-0 left-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-purple-500 rounded-tl-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded mr-2"></div>
                  <span className={`text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Bitcoin 50%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded mr-2"></div>
                  <span className={`text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Ethereum 33%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded mr-2"></div>
                  <span className={`text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Cardano 14%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-500 rounded mr-2"></div>
                  <span className={`text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Solana 9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ResponsiveLayout>
  );
}