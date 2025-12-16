# CryptoTracker - Crypto Portfolio Management App

CryptoTracker is a comprehensive cryptocurrency portfolio management application built with Next.js. It allows users to track, analyze, and optimize their crypto investments with real-time data and advanced analytics.

## Features

### Landing Page
- Eye-catching hero section with product introduction
- Benefits overview and prominent CTA (Sign Up/Login)
- Feature highlights and trust badges
- Demo section with screenshots
- User testimonials
- Responsive footer with navigation links
- **Dark/Light Theme Toggle** - Switch between color schemes based on user preference

### Authentication
- Sign Up / Login pages with Email/Password support
- Social login options (Google, Facebook)
- WalletConnect integration for crypto wallet authentication
- Branded UI with seamless transitions
- Form validation and error handling

### Dashboard
- Main navigation sidebar
- Portfolio overview with current holdings and value
- Performance graphs with historical data visualization
- Recent activity feed (transactions, alerts)
- Quick actions (add holding, import wallet, export data)

### Portfolio Management
- Detailed breakdown by coin/token
- Add/edit/remove assets functionality
- Performance filters (time, asset, category)
- Key statistics and metrics

### Analytics & Insights
- Visual tools for correlation analysis
- Asset diversification metrics
- Historical returns tracking
- Automated rebalancing suggestions
- Risk metrics and portfolio health scoring

### Profile & Settings
- User profile management
- Connected wallets integration
- API integrations with major exchanges
- Notification settings (price alerts, portfolio drift)

## Tech Stack

- **Frontend**: Next.js 13+ with App Router, React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom built with Tailwind
- **State Management**: React Context API
- **Data Visualization**: Custom chart components
- **Authentication**: Firebase Authentication
- **API**: RESTful API endpoints
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/             # API routes
│   ├── dashboard/       # Dashboard page
│   ├── login/           # Login page
│   ├── signup/          # Signup page
│   ├── portfolio/       # Portfolio management page
│   ├── analytics/       # Analytics and insights page
│   ├── settings/        # User settings page
│   ├── demo/            # Demo page
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/          # Reusable components
│   ├── ThemeToggle.tsx  # Theme switcher component
│   └── ThemeDemo.tsx    # Theme demonstration component
├── context/             # React context for theme management
│   └── ThemeContext.tsx # Theme context provider
└── ...
```

## Getting Started

### Prerequisites
- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the project directory:
```bash
cd crpto-app
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. **Set up environment variables (CRITICAL - READ CAREFULLY):**
   
   > **⚠️ SECURITY WARNING**: Improper handling of Firebase credentials can expose your entire database. Follow these steps carefully.
   
   ```bash
   # Copy the example file
   cp .env.example .env.local
   ```
   
   **Quick Start Security Checklist:**
   - [ ] Copy `.env.example` to `.env.local`
   - [ ] Fill in Firebase client configuration (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md))
   - [ ] Set up Firebase Admin SDK credentials (see [SECURITY.md](SECURITY.md))
   - [ ] Get WalletConnect Project ID from https://cloud.reown.com/
   - [ ] Verify `.env.local` is in `.gitignore`
   - [ ] **NEVER commit `.env.local` to version control**
   - [ ] Store service account keys **outside** the project directory
   
   **For detailed setup instructions, see:**
   - [SECURITY.md](SECURITY.md) - **READ THIS FIRST** for credential security best practices
   - [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Step-by-step Firebase configuration guide


5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Theme System

The application now includes a theme system that allows users to switch between light and dark modes:

- **Automatic Detection**: The theme automatically detects the user's system preference
- **Persistent Storage**: User preference is saved in localStorage
- **Smooth Transitions**: Theme changes are animated for a seamless experience
- **Full Customization**: All UI components respect the current theme

To use the theme system in your components:
```typescript
import { useTheme } from "@/context/ThemeContext";

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="bg-background text-foreground">
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

## Security

> **🔒 Security is a top priority for CryptoTracker.** This application handles sensitive financial data and Firebase credentials that require proper security practices.

### Security Best Practices

**DO:**
- ✅ Keep `.env.local` in `.gitignore` (already configured)
- ✅ Store service account keys outside the project directory
- ✅ Use different Firebase projects for development/staging/production
- ✅ Rotate credentials regularly (every 90 days)
- ✅ Enable Firebase Security Rules and App Check
- ✅ Monitor Firebase usage for unusual activity

**DON'T:**
- ❌ Commit `.env.local` or service account keys to version control
- ❌ Share credentials via email, messaging apps, or screenshots
- ❌ Store service account keys in the project directory
- ❌ Use production credentials in development
- ❌ Expose Firebase Admin SDK credentials in client-side code

### Security Documentation

- **[SECURITY.md](SECURITY.md)** - Comprehensive security guide covering:
  - Firebase credentials security
  - Environment variable setup
  - Service account management
  - Incident response procedures
  - Credential rotation guidelines

- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Firebase configuration guide with security considerations

### Reporting Security Issues

If you discover a security vulnerability, please **do not** create a public issue. Contact the project maintainer directly.

## Firebase Setup

To use Firebase Authentication, you need to set up a Firebase project. See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed instructions.

## Deployment

The application can be deployed to Vercel with a single click or by using the Vercel CLI:

```bash
npm run build
# or
yarn build
```

## Key Differentiators

1. **AI-Powered Insights**: Predictive analytics for automatic risk alerts and future projections
2. **Advanced Analytics**: Risk metrics, auto-rebalancing suggestions, and correlation analysis
3. **Educational Content**: Built-in learning resources and simulated demo trading for beginners
4. **Community Features**: Portfolio sharing (public/private) for benchmarking
5. **Portfolio Health Score**: Unique scoring system based on diversification, volatility, and risk

## Business Model

- **Freemium Model**: Core features free, advanced analytics or more connections as paid features
- **Target Market**: Positioning as simple but powerful, educational, and community-driven
- **User Retention**: Customizable alerts, daily/weekly summaries, gamified incentives

## Future Enhancements

- Integration with real cryptocurrency exchanges via APIs
- Real-time data fetching from CoinGecko or similar services
- Advanced portfolio optimization algorithms
- Mobile app development

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.