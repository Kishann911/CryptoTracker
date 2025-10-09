# Firebase Functions for CryptoTracker

This directory contains the Firebase Cloud Functions for the CryptoTracker application.

## Functions

1. **authenticateWallet** - Verifies wallet signatures and creates custom Firebase tokens
2. **calculatePortfolioValue** - Aggregates portfolio values when transactions are added/updated
3. **sendPriceAlerts** - Checks price conditions and sends notifications (runs every 5 minutes)
4. **syncExchangeData** - Synchronizes cryptocurrency data from CoinMarketCap API (runs every 10 minutes)

## Development

### Install Dependencies

```bash
npm install
```

### Build

```bash
npm run build
```

### Test Locally

```bash
npm run serve
```

### Deploy

```bash
npm run deploy
```

## Environment Configuration

Set the CoinMarketCap API key:

```bash
firebase functions:config:set coinmarketcap.api_key="YOUR_API_KEY"
```