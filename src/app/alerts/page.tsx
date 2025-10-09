"use client";

import Link from "next/link";
import { useState } from "react";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { useTheme } from '@/context/ThemeContext';

interface Alert {
  id: string;
  name: string;
  type: "price" | "percentage" | "portfolio";
  asset: string;
  condition: string;
  target: string;
  enabled: boolean;
  lastTriggered?: string;
}

export default function AlertsPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("active");
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      name: "Bitcoin Price Alert",
      type: "price",
      asset: "Bitcoin (BTC)",
      condition: "above",
      target: "$50,000",
      enabled: true,
      lastTriggered: "2023-06-15 14:30"
    },
    {
      id: "2",
      name: "Ethereum Drop Alert",
      type: "percentage",
      asset: "Ethereum (ETH)",
      condition: "below",
      target: "-5% in 24h",
      enabled: true,
      lastTriggered: "2023-06-10 09:15"
    },
    {
      id: "3",
      name: "Portfolio Value Alert",
      type: "portfolio",
      asset: "Total Portfolio",
      condition: "above",
      target: "$30,000",
      enabled: false,
      lastTriggered: "2023-06-05 16:45"
    }
  ]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    name: "",
    type: "price" as "price" | "percentage" | "portfolio",
    asset: "",
    condition: "above",
    target: ""
  });

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const alert: Alert = {
      id: (alerts.length + 1).toString(),
      name: newAlert.name || `${newAlert.asset} Alert`,
      type: newAlert.type,
      asset: newAlert.asset,
      condition: newAlert.condition,
      target: newAlert.target,
      enabled: true
    };
    setAlerts([...alerts, alert]);
    setNewAlert({
      name: "",
      type: "price",
      asset: "",
      condition: "above",
      target: ""
    });
    setShowCreateForm(false);
  };

  return (
    <ResponsiveLayout activePage="alerts">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Alerts</h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Manage your price and portfolio alerts</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className={`font-bold py-2 px-4 rounded-lg transition-colors flex items-center ${
              theme === 'dark' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Alert
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b mb-8 ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
        }`}>
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === "active" 
                ? theme === 'dark' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-blue-600 border-b-2 border-blue-600'
                : theme === 'dark' 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active Alerts
          </button>
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === "inactive" 
                ? theme === 'dark' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-blue-600 border-b-2 border-blue-600'
                : theme === 'dark' 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab("inactive")}
          >
            Inactive Alerts
          </button>
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === "history" 
                ? theme === 'dark' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-blue-600 border-b-2 border-blue-600'
                : theme === 'dark' 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab("history")}
          >
            Trigger History
          </button>
        </div>

        {/* Alerts List */}
        <div className={`rounded-xl border overflow-hidden ${
          theme === 'dark' 
            ? 'bg-gray-800 bg-opacity-50 border-gray-700' 
            : 'bg-white border-gray-300'
        }`}>
          {activeTab === "active" && (
            <div>
              {alerts.filter(alert => alert.enabled).length > 0 ? (
                <ul className={theme === 'dark' ? 'divide-y divide-gray-700' : 'divide-y divide-gray-300'}>
                  {alerts.filter(alert => alert.enabled).map(alert => (
                    <li key={alert.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="font-bold text-lg">{alert.name}</h3>
                            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                              theme === 'dark' 
                                ? 'bg-green-900 bg-opacity-30 text-green-400' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              Active
                            </span>
                          </div>
                          <div className={`flex flex-wrap gap-4 text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {alert.asset}
                            </div>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                              </svg>
                              {alert.type === "price" && "Price Alert"}
                              {alert.type === "percentage" && "Percentage Alert"}
                              {alert.type === "portfolio" && "Portfolio Alert"}
                            </div>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 00-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                              </svg>
                              {alert.condition} {alert.target}
                            </div>
                          </div>
                          {alert.lastTriggered && (
                            <div className={`mt-3 text-xs ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              Last triggered: {alert.lastTriggered}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => toggleAlert(alert.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark' 
                                ? 'bg-gray-700 hover:bg-gray-600' 
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <button
                            onClick={() => toggleAlert(alert.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark' 
                                ? 'bg-gray-700 hover:bg-gray-600' 
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12">
                  <svg className={`h-16 w-16 mx-auto ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 00-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <h3 className="mt-4 font-bold text-lg">No active alerts</h3>
                  <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Create your first alert to get notified about price changes</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className={`mt-4 font-bold py-2 px-4 rounded-lg transition-colors inline-flex items-center ${
                      theme === 'dark' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Alert
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "inactive" && (
            <div>
              {alerts.filter(alert => !alert.enabled).length > 0 ? (
                <ul className={theme === 'dark' ? 'divide-y divide-gray-700' : 'divide-y divide-gray-300'}>
                  {alerts.filter(alert => !alert.enabled).map(alert => (
                    <li key={alert.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="font-bold text-lg">{alert.name}</h3>
                            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                              theme === 'dark' 
                                ? 'bg-gray-700 text-gray-400' 
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              Inactive
                            </span>
                          </div>
                          <div className={`flex flex-wrap gap-4 text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {alert.asset}
                            </div>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                              </svg>
                              {alert.type === "price" && "Price Alert"}
                              {alert.type === "percentage" && "Percentage Alert"}
                              {alert.type === "portfolio" && "Portfolio Alert"}
                            </div>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 00-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                              </svg>
                              {alert.condition} {alert.target}
                            </div>
                          </div>
                          {alert.lastTriggered && (
                            <div className={`mt-3 text-xs ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              Last triggered: {alert.lastTriggered}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => toggleAlert(alert.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark' 
                                ? 'bg-gray-700 hover:bg-gray-600' 
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark' 
                                ? 'bg-gray-700 hover:bg-gray-600' 
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12">
                  <svg className={`h-16 w-16 mx-auto ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 00-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <h3 className="mt-4 font-bold text-lg">No inactive alerts</h3>
                  <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>All your alerts are currently active</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="p-6">
              <div className="text-center py-12">
                <svg className={`h-16 w-16 mx-auto ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 font-bold text-lg">Alert History</h3>
                <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Alert trigger history will appear here</p>
                <p className={`text-sm mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Upgrade to Premium to access detailed alert history</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Alert Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl border w-full max-w-md ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-300'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Alert</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreateAlert}>
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} htmlFor="name">
                    Alert Name (Optional)
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-gray-900 border border-gray-700 text-white' 
                        : 'bg-white border border-gray-300 text-gray-900'
                    }`}
                    placeholder="e.g., Bitcoin Price Alert"
                    value={newAlert.name}
                    onChange={(e) => setNewAlert({...newAlert, name: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} htmlFor="type">
                    Alert Type
                  </label>
                  <select
                    id="type"
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-gray-900 border border-gray-700 text-white' 
                        : 'bg-white border border-gray-300 text-gray-900'
                    }`}
                    value={newAlert.type}
                    onChange={(e) => setNewAlert({...newAlert, type: e.target.value as any})}
                  >
                    <option value="price">Price Alert</option>
                    <option value="percentage">Percentage Change Alert</option>
                    <option value="portfolio">Portfolio Value Alert</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} htmlFor="asset">
                    Asset
                  </label>
                  <select
                    id="asset"
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-gray-900 border border-gray-700 text-white' 
                        : 'bg-white border border-gray-300 text-gray-900'
                    }`}
                    value={newAlert.asset}
                    onChange={(e) => setNewAlert({...newAlert, asset: e.target.value})}
                  >
                    <option value="">Select an asset</option>
                    <option value="Bitcoin (BTC)">Bitcoin (BTC)</option>
                    <option value="Ethereum (ETH)">Ethereum (ETH)</option>
                    <option value="Cardano (ADA)">Cardano (ADA)</option>
                    <option value="Solana (SOL)">Solana (SOL)</option>
                    <option value="Total Portfolio">Total Portfolio</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} htmlFor="condition">
                      Condition
                    </label>
                    <select
                      id="condition"
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'dark' 
                          ? 'bg-gray-900 border border-gray-700 text-white' 
                          : 'bg-white border border-gray-300 text-gray-900'
                      }`}
                      value={newAlert.condition}
                      onChange={(e) => setNewAlert({...newAlert, condition: e.target.value})}
                    >
                      <option value="above">Above</option>
                      <option value="below">Below</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} htmlFor="target">
                      Target Value
                    </label>
                    <input
                      id="target"
                      type="text"
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'dark' 
                          ? 'bg-gray-900 border border-gray-700 text-white' 
                          : 'bg-white border border-gray-300 text-gray-900'
                      }`}
                      placeholder={newAlert.type === "price" ? "$50000" : newAlert.type === "percentage" ? "5%" : "$30000"}
                      value={newAlert.target}
                      onChange={(e) => setNewAlert({...newAlert, target: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    Create Alert
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </ResponsiveLayout>
  );
}