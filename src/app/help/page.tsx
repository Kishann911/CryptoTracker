"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { useTheme } from '@/context/ThemeContext';

// Define types for our data
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  questions: FAQItem[];
}

interface GlossaryTerm {
  term: string;
  definition: string;
}

interface TroubleshootingIssue {
  problem: string;
  solution: string;
}

interface SearchResult {
  type: string;
  category?: string;
  question?: string;
  answer?: string;
  term?: string;
  definition?: string;
  problem?: string;
  solution?: string;
}

// FAQ data
const faqs: FAQCategory[] = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I create an account?",
        answer: "Click the 'Sign Up' button in the top right corner of the homepage. Enter your email address, create a password, and follow the verification steps sent to your email."
      },
      {
        question: "How do I add a wallet?",
        answer: "After logging in, go to the 'Portfolio' section and click 'Add Wallet'. You can add wallets by entering wallet addresses for public blockchains or by connecting through exchange APIs."
      },
      {
        question: "How do I connect my exchange account?",
        answer: "Navigate to 'Settings' > 'Exchange Connections'. Select your exchange from the list, generate an API key on the exchange platform with read permissions, and enter the API key and secret in our secure form."
      }
    ]
  },
  {
    category: "Portfolio Management",
    questions: [
      {
        question: "How is my portfolio calculated?",
        answer: "Your portfolio value is calculated by combining all connected wallets and exchange accounts. We fetch real-time prices from multiple exchanges and calculate the total value based on your asset holdings."
      },
      {
        question: "How often is my portfolio updated?",
        answer: "Portfolio data updates every 5 minutes for most assets. High-volume assets like Bitcoin and Ethereum update every minute. Exchange data updates according to each exchange's API rate limits."
      },
      {
        question: "Can I track multiple wallets?",
        answer: "Yes, you can track as many wallets as you want. Simply go to the Portfolio section and click 'Add Wallet' for each additional wallet you'd like to monitor."
      }
    ]
  },
  {
    category: "Alerts & Notifications",
    questions: [
      {
        question: "How do I set up price alerts?",
        answer: "Go to the 'Alerts' section in your dashboard. Click 'Create Alert', select the cryptocurrency, set your target price, and choose your notification method (email, SMS, or in-app)."
      },
      {
        question: "What types of alerts can I set?",
        answer: "You can set price alerts (when a coin reaches a specific value), percentage change alerts (when a coin moves more than X% in 24 hours), and portfolio value alerts (when your total portfolio crosses a threshold)."
      }
    ]
  },
  {
    category: "Security",
    questions: [
      {
        question: "How is my data secured?",
        answer: "We use bank-level encryption (AES-256) for all data at rest and in transit. API keys are encrypted with separate keys and never stored in plain text. We undergo regular security audits and penetration testing."
      },
      {
        question: "What should I do if I suspect unauthorized access?",
        answer: "Immediately change your password and revoke any API keys from your exchange accounts. Contact our support team immediately through the Help page or by emailing security@cryptotracker.com."
      }
    ]
  }
];

// Glossary terms
const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Staking",
    definition: "The process of participating in the validation of transactions on a proof-of-stake blockchain network, typically earning rewards for locking up your coins."
  },
  {
    term: "Market Cap",
    definition: "The total value of all coins in circulation for a particular cryptocurrency, calculated by multiplying the current price by the total supply."
  },
  {
    term: "Portfolio Allocation",
    definition: "The distribution of your investment across different assets, typically expressed as percentages of your total portfolio value."
  },
  {
    term: "P&L (Profit and Loss)",
    definition: "The financial gain or loss on your investments, calculated as the difference between your purchase price and current value."
  },
  {
    term: "APY (Annual Percentage Yield)",
    definition: "The real rate of return earned on an investment over a year, taking into account the effect of compounding interest."
  },
  {
    term: "Diversification",
    definition: "A risk management strategy that mixes a wide variety of investments within a portfolio to minimize the impact of any single asset's poor performance."
  }
];

// Troubleshooting issues
const troubleshootingIssues: TroubleshootingIssue[] = [
  {
    problem: "Sync failed: API key expired",
    solution: "Log into your exchange account and generate a new API key with read permissions. Update the key in your CryptoTracker settings under 'Exchange Connections'."
  },
  {
    problem: "Wallet not showing transactions",
    solution: "Ensure the wallet address is entered correctly. Some blockchains require you to specify the token type (e.g., ERC-20 for Ethereum tokens). Check the transaction history on a blockchain explorer to verify the address."
  },
  {
    problem: "Portfolio value seems incorrect",
    solution: "Check that all your wallets and exchanges are properly connected. Some assets may take time to sync. If the issue persists, contact support with details about the discrepancy."
  },
  {
    problem: "Alerts not triggering",
    solution: "Verify that alerts are enabled in your notification settings. Check that your contact information (email/SMS) is correct. Note that alerts check prices every 5 minutes, so there may be a slight delay."
  }
];

export default function HelpPage() {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState("faq");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Filter results based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results: SearchResult[] = [];

    // Search in FAQs
    faqs.forEach(category => {
      category.questions.forEach(q => {
        if (q.question.toLowerCase().includes(term) || q.answer.toLowerCase().includes(term)) {
          results.push({
            type: "faq",
            category: category.category,
            question: q.question,
            answer: q.answer
          });
        }
      });
    });

    // Search in glossary
    glossaryTerms.forEach(termItem => {
      if (termItem.term.toLowerCase().includes(term) || termItem.definition.toLowerCase().includes(term)) {
        results.push({
          type: "glossary",
          term: termItem.term,
          definition: termItem.definition
        });
      }
    });

    // Search in troubleshooting
    troubleshootingIssues.forEach(issue => {
      if (issue.problem.toLowerCase().includes(term) || issue.solution.toLowerCase().includes(term)) {
        results.push({
          type: "troubleshooting",
          problem: issue.problem,
          solution: issue.solution
        });
      }
    });

    setFilteredResults(results);
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset form after submission
    setTimeout(() => {
      setIsSubmitted(false);
      (e.target as HTMLFormElement).reset();
    }, 3000);
  };

  return (
    <ResponsiveLayout activePage="help">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Help Center</h1>
          <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Find answers to common questions, learn how to use CryptoTracker, and get help with any issues.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search help articles, FAQs, and guides..."
              className={`w-full px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700 text-white' 
                  : 'bg-white border border-gray-300 text-gray-900'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Search Results */}
          {searchTerm && (
            <div className={`mt-4 rounded-xl max-h-96 overflow-y-auto ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-300'
            }`}>
              {filteredResults.length > 0 ? (
                filteredResults.map((result, index) => (
                  <div key={index} className={`p-4 border-b last:border-b-0 ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                  }`}>
                    {result.type === "faq" && (
                      <div>
                        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{result.category}</div>
                        <h3 className="font-bold mt-1">{result.question}</h3>
                        <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{result.answer}</p>
                      </div>
                    )}
                    {result.type === "glossary" && (
                      <div>
                        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Glossary</div>
                        <h3 className="font-bold mt-1">{result.term}</h3>
                        <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{result.definition}</p>
                      </div>
                    )}
                    {result.type === "troubleshooting" && (
                      <div>
                        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>Troubleshooting</div>
                        <h3 className="font-bold mt-1">{result.problem}</h3>
                        <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{result.solution}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>No results found for "{searchTerm}"</div>
                  <div className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Can't find what you're looking for? <Link href="#contact" className={theme === 'dark' ? 'text-blue-400 hover:underline' : 'text-blue-600 hover:underline'}>Contact support</Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "faq" 
                ? theme === 'dark' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-500 text-white'
                : theme === 'dark' 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab("faq")}
          >
            FAQs
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "guides" 
                ? theme === 'dark' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-500 text-white'
                : theme === 'dark' 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab("guides")}
          >
            How-to Guides
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "glossary" 
                ? theme === 'dark' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-500 text-white'
                : theme === 'dark' 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab("glossary")}
          >
            Glossary
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "troubleshooting" 
                ? theme === 'dark' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-500 text-white'
                : theme === 'dark' 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab("troubleshooting")}
          >
            Troubleshooting
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "contact" 
                ? theme === 'dark' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-500 text-white'
                : theme === 'dark' 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab("contact")}
          >
            Contact Support
          </button>
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto">
          {/* FAQs Section */}
          {activeTab === "faq" && (
            <div className="space-y-8">
              {faqs.map((category, categoryIndex) => (
                <div key={categoryIndex} className={`rounded-xl border p-6 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 bg-opacity-50 border-gray-700' 
                    : 'bg-white border-gray-300'
                }`}>
                  <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{category.category}</h2>
                  <div className="space-y-6">
                    {category.questions.map((faq, faqIndex) => (
                      <div key={faqIndex} className={`pb-6 last:pb-0 ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                      } ${faqIndex !== category.questions.length - 1 ? 'border-b' : ''}`}>
                        <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* How-to Guides Section */}
          {activeTab === "guides" && (
            <div className={`rounded-xl border p-6 ${
              theme === 'dark' 
                ? 'bg-gray-800 bg-opacity-50 border-gray-700' 
                : 'bg-white border-gray-300'
            }`}>
              <h2 className="text-2xl font-bold mb-6">How-to Guides</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`rounded-lg p-5 border ${
                  theme === 'dark' 
                    ? 'bg-gray-900 border-gray-700' 
                    : 'bg-gray-50 border-gray-300'
                }`}>
                  <div className="flex items-start mb-4">
                    <div className={`p-2 rounded-lg mr-4 ${
                      theme === 'dark' 
                        ? 'bg-blue-900 bg-opacity-30' 
                        : 'bg-blue-100'
                    }`}>
                      <svg className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Connect Binance API</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Track your Binance holdings automatically</p>
                    </div>
                  </div>
                  <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                    <span>Read Guide</span>
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                <div className={`rounded-lg p-5 border ${
                  theme === 'dark' 
                    ? 'bg-gray-900 border-gray-700' 
                    : 'bg-gray-50 border-gray-300'
                }`}>
                  <div className="flex items-start mb-4">
                    <div className={`p-2 rounded-lg mr-4 ${
                      theme === 'dark' 
                        ? 'bg-green-900 bg-opacity-30' 
                        : 'bg-green-100'
                    }`}>
                      <svg className={`h-6 w-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Add Wallet Addresses</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Monitor your wallet balances</p>
                    </div>
                  </div>
                  <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    <span>Read Guide</span>
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                <div className={`rounded-lg p-5 border ${
                  theme === 'dark' 
                    ? 'bg-gray-900 border-gray-700' 
                    : 'bg-gray-50 border-gray-300'
                }`}>
                  <div className="flex items-start mb-4">
                    <div className={`p-2 rounded-lg mr-4 ${
                      theme === 'dark' 
                        ? 'bg-purple-900 bg-opacity-30' 
                        : 'bg-purple-100'
                    }`}>
                      <svg className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Set Up Price Alerts</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Get notified when prices change</p>
                    </div>
                  </div>
                  <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                    <span>Read Guide</span>
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                <div className={`rounded-lg p-5 border ${
                  theme === 'dark' 
                    ? 'bg-gray-900 border-gray-700' 
                    : 'bg-gray-50 border-gray-300'
                }`}>
                  <div className="flex items-start mb-4">
                    <div className={`p-2 rounded-lg mr-4 ${
                      theme === 'dark' 
                        ? 'bg-yellow-900 bg-opacity-30' 
                        : 'bg-yellow-100'
                    }`}>
                      <svg className={`h-6 w-6 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Analyze Portfolio Performance</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Understand your investment returns</p>
                    </div>
                  </div>
                  <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    <span>Read Guide</span>
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className={`mt-8 p-5 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-gray-50 border-gray-300'
              }`}>
                <h3 className="font-bold text-lg mb-3">Video Tutorials</h3>
                <div className={`flex items-center ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Watch our getting started playlist on YouTube</span>
                </div>
              </div>
            </div>
          )}

          {/* Glossary Section */}
          {activeTab === "glossary" && (
            <div className={`rounded-xl border p-6 ${
              theme === 'dark' 
                ? 'bg-gray-800 bg-opacity-50 border-gray-700' 
                : 'bg-white border-gray-300'
            }`}>
              <h2 className="text-2xl font-bold mb-6">Crypto Glossary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {glossaryTerms.map((term, index) => (
                  <div key={index} className={`rounded-lg p-5 border ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border-gray-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <h3 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{term.term}</h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{term.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Troubleshooting Section */}
          {activeTab === "troubleshooting" && (
            <div className={`rounded-xl border p-6 ${
              theme === 'dark' 
                ? 'bg-gray-800 bg-opacity-50 border-gray-700' 
                : 'bg-white border-gray-300'
            }`}>
              <h2 className="text-2xl font-bold mb-6">Troubleshooting</h2>
              <div className="space-y-6">
                {troubleshootingIssues.map((issue, index) => (
                  <div key={index} className={`rounded-lg p-5 border ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border-gray-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <h3 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>{issue.problem}</h3>
                    <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{issue.solution}</p>
                    <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Try Again</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={`mt-8 p-5 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-blue-900 bg-opacity-20 border-blue-700' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <h3 className="font-bold text-lg mb-2">Still having issues?</h3>
                <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  If none of these solutions work for you, please contact our support team with details about your issue.
                </p>
                <Link 
                  href="#contact" 
                  className={`inline-block font-bold py-2 px-4 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  Contact Support
                </Link>
              </div>
            </div>
          )}

          {/* Contact Support Section */}
          {activeTab === "contact" && (
            <div className={`rounded-xl border p-6 ${
              theme === 'dark' 
                ? 'bg-gray-800 bg-opacity-50 border-gray-700' 
                : 'bg-white border-gray-300'
            }`}>
              <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
              
              {isSubmitted ? (
                <div className={`border rounded-lg p-6 text-center ${
                  theme === 'dark' 
                    ? 'bg-green-900 bg-opacity-30 border-green-700' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <svg className={`h-12 w-12 mx-auto mb-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-bold text-xl mb-2">Message Sent!</h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Thank you for contacting us. Our support team will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'dark' 
                          ? 'bg-gray-900 border border-gray-700 text-white' 
                          : 'bg-white border border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'dark' 
                          ? 'bg-gray-900 border border-gray-700 text-white' 
                          : 'bg-white border border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Subject
                    </label>
                    <select
                      id="subject"
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'dark' 
                          ? 'bg-gray-900 border border-gray-700 text-white' 
                          : 'bg-white border border-gray-300 text-gray-900'
                      }`}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="account">Account Issues</option>
                      <option value="billing">Billing Questions</option>
                      <option value="technical">Technical Support</option>
                      <option value="feature">Feature Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'dark' 
                          ? 'bg-gray-900 border border-gray-700 text-white' 
                          : 'bg-white border border-gray-300 text-gray-900'
                      }`}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="urgent"
                      className={`h-4 w-4 rounded focus:ring-blue-500 ${
                        theme === 'dark' 
                          ? 'bg-gray-900 border-gray-700 text-blue-600' 
                          : 'bg-white border-gray-300 text-blue-500'
                      }`}
                    />
                    <label htmlFor="urgent" className={`ml-2 block text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      This is an urgent request
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className={`w-full font-bold py-3 px-4 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    Send Message
                  </button>
                </form>
              )}
              
              <div className={`mt-10 pt-8 border-t ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
              }`}>
                <h3 className="font-bold text-lg mb-4">Other Ways to Get Help</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`rounded-lg p-5 border text-center ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border-gray-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 ${
                      theme === 'dark' 
                        ? 'bg-blue-900 bg-opacity-30' 
                        : 'bg-blue-100'
                    }`}>
                      <svg className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h4 className="font-bold mb-2">Live Chat</h4>
                    <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Chat with our support team</p>
                    <button className={`text-sm font-medium ${
                      theme === 'dark' 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}>
                      Start Chat
                    </button>
                  </div>
                  
                  <div className={`rounded-lg p-5 border text-center ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border-gray-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 ${
                      theme === 'dark' 
                        ? 'bg-green-900 bg-opacity-30' 
                        : 'bg-green-100'
                    }`}>
                      <svg className={`h-6 w-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-bold mb-2">Email Support</h4>
                    <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>support@cryptotracker.com</p>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Response within 24 hours</span>
                  </div>
                  
                  <div className={`rounded-lg p-5 border text-center ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border-gray-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 ${
                      theme === 'dark' 
                        ? 'bg-purple-900 bg-opacity-30' 
                        : 'bg-purple-100'
                    }`}>
                      <svg className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </div>
                    <h4 className="font-bold mb-2">Community</h4>
                    <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Join our Discord community</p>
                    <button className={`text-sm font-medium ${
                      theme === 'dark' 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}>
                      Join Discord
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Still Need Help Section */}
        {searchTerm && filteredResults.length === 0 && (
          <div className={`max-w-2xl mx-auto mt-12 p-6 rounded-xl border text-center ${
            theme === 'dark' 
              ? 'bg-gray-800 bg-opacity-50 border-gray-700' 
              : 'bg-white border-gray-300'
          }`}>
            <h3 className="font-bold text-xl mb-3">Still need help?</h3>
            <p className={`mb-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link 
              href="#contact" 
              className={`inline-block font-bold py-3 px-6 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              onClick={() => setActiveTab("contact")}
            >
              Contact Support
            </Link>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
}