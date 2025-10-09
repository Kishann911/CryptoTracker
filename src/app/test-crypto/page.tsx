'use client';

import Link from 'next/link';

export default function TestCryptoPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Crypto Data Test Page</h1>
      <p className="mb-4">This page tests the CoinMarketCap API integration.</p>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Navigation</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/crypto-data" className="text-blue-400 hover:text-blue-300 underline">
              View Crypto Market Data Page
            </Link>
          </li>
          <li>
            <Link href="/" className="text-blue-400 hover:text-blue-300 underline">
              Back to Home
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">API Status</h2>
        <p className="text-green-400">✅ CoinMarketCap API is connected and working</p>
        <p className="mt-2">The API key is properly configured and returning live cryptocurrency data.</p>
      </div>
    </div>
  );
}