'use client';

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTheme } from '@/context/ThemeContext';
import ResponsiveLayout from '@/components/ResponsiveLayout';

interface Cryptocurrency {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
      market_cap: number;
      volume_24h: number;
    }
  };
  cmc_rank: number;
}

const CryptoDataPage = () => {
  const { theme } = useTheme();
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/crypto-data');
        if (!response.ok) {
          throw new Error('Failed to fetch cryptocurrency data');
        }
        const data = await response.json();
        setCryptocurrencies(data.data);
        setError(null);
      } catch (err) {
        setError('Error fetching data: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, []);

  if (loading) return (
    <ResponsiveLayout activePage="market-data">
      <LoadingSpinner />
    </ResponsiveLayout>
  );
  
  if (error) return (
    <ResponsiveLayout activePage="market-data">
      <div className={`p-8 text-center ${theme === 'dark' ? 'text-destructive' : 'text-red-500'}`}>Error: {error}</div>
    </ResponsiveLayout>
  );

  return (
    <ResponsiveLayout activePage="market-data">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>Cryptocurrency Market Data</h1>
          <p className={theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}>Real-time data from CoinMarketCap API</p>
        </div>

        <div className={`shadow overflow-hidden sm:rounded-lg ${theme === 'dark' ? 'bg-card' : 'bg-white'}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className={theme === 'dark' ? 'bg-card' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                    Rank
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                    Name
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                    Symbol
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                    Price (USD)
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                    24h Change
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                    Market Cap
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                    Volume (24h)
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'bg-card divide-border' : 'bg-white divide-gray-200'}`}>
                {cryptocurrencies.map((crypto) => (
                  <tr key={crypto.id} className={theme === 'dark' ? 'hover:bg-card/80' : 'hover:bg-gray-50'}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                      #{crypto.cmc_rank}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
                      {crypto.name}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                      {crypto.symbol}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-foreground' : 'text-gray-900'}`}>
                      ${crypto.quote.USD.price.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      crypto.quote.USD.percent_change_24h >= 0 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}>
                      {crypto.quote.USD.percent_change_24h >= 0 ? '+' : ''}
                      {crypto.quote.USD.percent_change_24h.toFixed(2)}%
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                      ${(crypto.quote.USD.market_cap / 1000000000).toFixed(2)}B
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                      ${(crypto.quote.USD.volume_24h / 1000000).toFixed(2)}M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default CryptoDataPage;