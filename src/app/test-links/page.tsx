"use client";

import Link from "next/link";

export default function TestLinks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Test Links</h1>
        <div className="space-y-4">
          <Link 
            href="/help" 
            className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 transition duration-300"
          >
            <h2 className="text-xl font-bold">Help Page</h2>
            <p className="text-gray-400">Test the help center functionality</p>
          </Link>
          
          <Link 
            href="/alerts" 
            className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 transition duration-300"
          >
            <h2 className="text-xl font-bold">Alerts Page</h2>
            <p className="text-gray-400">Test the alerts management system</p>
          </Link>
          
          <Link 
            href="/" 
            className="block bg-blue-600 hover:bg-blue-700 p-4 rounded-lg border border-blue-500 transition duration-300 text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}