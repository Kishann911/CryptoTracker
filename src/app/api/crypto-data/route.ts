import { NextResponse } from 'next/server';

const API_KEY = process.env.CMC_API_KEY || 'your_api_key_here';
const BASE_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

export async function GET() {
  try {
    // Check if API key is configured
    if (API_KEY === 'your_api_key_here') {
      console.warn('CMC_API_KEY is not configured. Please add it to your environment variables.');
    }

    const res = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
        'Accept': 'application/json',
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`CoinMarketCap API error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data' },
      { status: 500 }
    );
  }
}