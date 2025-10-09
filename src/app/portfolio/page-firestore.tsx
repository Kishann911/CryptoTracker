"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PortfolioAsset {
  assetId: string;
  amount: number;
  value: number;
  allocation: number;
}

interface PortfolioData {
  id: string;
  userId: string;
  totalValue: number;
  change24h: number;
  assets: PortfolioAsset[];
  [key: string]: unknown; // For any additional properties
}

interface Transaction {
  id: string;
  userId: string;
  assetId: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  totalValue: number;
  date: Date;
  notes: string;
  fee: number;
  [key: string]: unknown; // For any additional properties
}

interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  [key: string]: unknown; // For any additional properties
}

export default function PortfolioFirestore() {
  const [user, loading, error] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState("holdings");
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [newTransaction, setNewTransaction] = useState({
    type: "buy",
    assetId: "",
    amount: "",
    price: "",
    notes: ""
  });

  // Fetch portfolio data
  useEffect(() => {
    if (!user) return;

    // Fetch portfolio
    const portfolioQuery = query(collection(db, "portfolios"), where("userId", "==", user.uid));
    const unsubscribePortfolio = onSnapshot(portfolioQuery, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setPortfolioData({ id: doc.id, ...doc.data() } as PortfolioData);
      }
      setLoadingData(false);
    });

    // Fetch transactions
    const transactionsQuery = query(collection(db, "transactions"), where("userId", "==", user.uid));
    const unsubscribeTransactions = onSnapshot(transactionsQuery, (querySnapshot) => {
      const transactionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(transactionsData as Transaction[]);
    });

    // Fetch assets
    const assetsQuery = query(collection(db, "assets"));
    const unsubscribeAssets = onSnapshot(assetsQuery, (querySnapshot) => {
      const assetsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAssets(assetsData as Asset[]);
    });

    return () => {
      unsubscribePortfolio();
      unsubscribeTransactions();
      unsubscribeAssets();
    };
  }, [user]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        assetId: newTransaction.assetId,
        type: newTransaction.type,
        amount: parseFloat(newTransaction.amount),
        price: parseFloat(newTransaction.price),
        totalValue: parseFloat(newTransaction.amount) * parseFloat(newTransaction.price),
        date: new Date(),
        notes: newTransaction.notes,
        fee: 0 // In a real app, you might calculate this
      });

      // Reset form
      setNewTransaction({
        type: "buy",
        assetId: "",
        amount: "",
        price: "",
        notes: ""
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteDoc(doc(db, "transactions", transactionId));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  if (loading || loadingData) {
    return (
      <ResponsiveLayout activePage="portfolio">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </ResponsiveLayout>
    );
  }

  if (error || !user) {
    return (
      <ResponsiveLayout activePage="portfolio">
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">Failed to load portfolio data. Please try again later.</span>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout activePage="portfolio">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Portfolio Management</h1>
        <p className="text-gray-400 text-sm sm:text-base">Manage your crypto assets and track performance</p>
      </div>
      
      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 sm:mb-8">
        <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-4">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">Total Portfolio Value</div>
          <div className="text-lg sm:text-xl font-bold">
            ${portfolioData?.totalValue ? portfolioData.totalValue.toLocaleString() : "0.00"}
          </div>
        </div>
        
        <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-4">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">24h Change</div>
          <div className={`text-lg sm:text-xl font-bold ${portfolioData?.change24h && portfolioData.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {portfolioData?.change24h ? (portfolioData.change24h >= 0 ? '+' : '') + portfolioData.change24h.toFixed(2) + '%' : '0.00%'}
          </div>
        </div>
        
        <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-4">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">Assets</div>
          <div className="text-lg sm:text-xl font-bold">{portfolioData?.assets?.length || 0}</div>
        </div>
        
        <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-4">
          <div className="text-gray-400 text-xs sm:text-sm mb-1">Transactions</div>
          <div className="text-lg sm:text-xl font-bold">{transactions.length}</div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6 sm:mb-8 overflow-x-auto">
        <button 
          className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base whitespace-nowrap ${activeTab === 'holdings' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('holdings')}
        >
          Holdings
        </button>
        <button 
          className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base whitespace-nowrap ${activeTab === 'transactions' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button 
          className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base whitespace-nowrap ${activeTab === 'analytics' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>
      
      {/* Holdings Tab */}
      {activeTab === 'holdings' && (
        <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 className="text-lg sm:text-xl font-bold">Your Assets</h2>
            <div className="flex space-x-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm">
                Add Asset
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm">
                Import
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-xs sm:text-sm">
                  <th className="pb-3">Asset</th>
                  <th className="pb-3">Holdings</th>
                  <th className="pb-3 hidden sm:table-cell">Price</th>
                  <th className="pb-3">Value</th>
                  <th className="pb-3 hidden sm:table-cell">Allocation</th>
                  <th className="pb-3">24h</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData?.assets?.map((asset: PortfolioAsset) => {
                  const assetData = assets.find(a => a.id === asset.assetId);
                  return (
                    <tr key={asset.assetId} className="border-t border-gray-700">
                      <td className="py-3">
                        <div className="font-bold text-sm">{assetData?.name || asset.assetId}</div>
                        <div className="text-gray-400 text-xs">{assetData?.symbol || 'N/A'}</div>
                      </td>
                      <td className="py-3 text-sm">{asset.amount?.toFixed(6)}</td>
                      <td className="py-3 text-sm hidden sm:table-cell">
                        ${assetData?.currentPrice?.toLocaleString() || '0.00'}
                      </td>
                      <td className="py-3 text-sm">${asset.value?.toLocaleString() || '0.00'}</td>
                      <td className="py-3 text-sm hidden sm:table-cell">
                        {asset.allocation ? asset.allocation.toFixed(2) + '%' : '0%'}
                      </td>
                      <td className={`py-3 text-sm ${assetData?.change24h && assetData.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {assetData?.change24h ? (assetData.change24h >= 0 ? '+' : '') + assetData.change24h.toFixed(2) + '%' : '0.00%'}
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-400 text-sm">
                            Edit
                          </button>
                          <button className="text-red-500 hover:text-red-400 text-sm">
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 className="text-lg sm:text-xl font-bold">Transaction History</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm">
              Export CSV
            </button>
          </div>
          
          {/* Add Transaction Form */}
          <div className="mb-6 p-4 bg-gray-700 bg-opacity-30 rounded-lg">
            <h3 className="text-md font-bold mb-3">Add New Transaction</h3>
            <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                className="md:col-span-1 bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
              
              <select
                value={newTransaction.assetId}
                onChange={(e) => setNewTransaction({...newTransaction, assetId: e.target.value})}
                className="md:col-span-2 bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm"
                required
              >
                <option value="">Select Asset</option>
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.symbol})
                  </option>
                ))}
              </select>
              
              <input
                type="number"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                className="md:col-span-1 bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm"
                required
              />
              
              <input
                type="number"
                placeholder="Price"
                value={newTransaction.price}
                onChange={(e) => setNewTransaction({...newTransaction, price: e.target.value})}
                className="md:col-span-1 bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm"
                required
              />
              
              <button 
                type="submit"
                className="md:col-span-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 text-sm"
              >
                Add
              </button>
            </form>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-xs sm:text-sm">
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Asset</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Value</th>
                  <th className="pb-3 hidden sm:table-cell">Date</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => {
                  const assetData = assets.find(a => a.id === transaction.assetId);
                  return (
                    <tr key={transaction.id} className="border-t border-gray-700">
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${transaction.type === 'buy' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-sm">
                        {assetData ? `${assetData.name} (${assetData.symbol})` : transaction.assetId}
                      </td>
                      <td className="py-3 text-sm">{transaction.amount?.toFixed(6)}</td>
                      <td className="py-3 text-sm">${transaction.price?.toFixed(2)}</td>
                      <td className="py-3 text-sm">${transaction.totalValue?.toFixed(2)}</td>
                      <td className="py-3 text-sm hidden sm:table-cell">
                        {transaction.date ? (transaction.date instanceof Date ? transaction.date.toLocaleDateString() : new Date(transaction.date).toLocaleDateString()) : 'N/A'}
                      </td>
                      <td className="py-3">
                        <button 
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-red-500 hover:text-red-400 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Performance Chart */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Portfolio Performance</h2>
            
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
          <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Asset Allocation</h2>
            
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
                {portfolioData?.assets?.slice(0, 4).map((asset: PortfolioAsset, index: number) => {
                  const assetData = assets.find(a => a.id === asset.assetId);
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-gray-500'];
                  return (
                    <div key={asset.assetId} className="flex items-center">
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 ${colors[index]} rounded mr-2`}></div>
                      <span className="text-sm">
                        {assetData?.symbol || asset.assetId} {asset.allocation ? asset.allocation.toFixed(1) + '%' : '0%'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </ResponsiveLayout>
  );
}