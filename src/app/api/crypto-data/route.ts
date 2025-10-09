import { NextResponse } from 'next/server';

const API_KEY = '9de777d0-6bd6-45f6-8973-36469c503042';
const BASE_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

export async function GET() {
  try {
    const res = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
        'Accept': 'application/json',
      },
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