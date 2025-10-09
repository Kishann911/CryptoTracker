import { NextResponse } from 'next/server';

// Mock portfolio data
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

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(portfolioData);
}