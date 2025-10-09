"use client";

import Link from "next/link";
import CryptoPieChart from "@/components/CryptoPieChart";
import CryptoLineChart from "@/components/CryptoLineChart";
import CryptoBarChart from "@/components/CryptoBarChart";

export default function Home() {
  // Mock data for charts
  const pieChartData = [
    { name: "Bitcoin", value: 12500, color: "#f59e0b" },
    { name: "Ethereum", value: 8320, color: "#6366f1" },
    { name: "Cardano", value: 3500, color: "#8b5cf6" },
    { name: "Solana", value: 2248.90, color: "#06b6d4" },
  ];

  const lineChartData = [
    { date: "Jan", value: 10000 },
    { date: "Feb", value: 12000 },
    { date: "Mar", value: 11000 },
    { date: "Apr", value: 14000 },
    { date: "May", value: 13000 },
    { date: "Jun", value: 16000 },
    { date: "Jul", value: 18000 },
    { date: "Aug", value: 17000 },
    { date: "Sep", value: 20000 },
    { date: "Oct", value: 22000 },
    { date: "Nov", value: 21000 },
    { date: "Dec", value: 24568.90 },
  ];

  const barChartData = [
    { name: "Bitcoin", value: 12500 },
    { name: "Ethereum", value: 8320 },
    { name: "Cardano", value: 3500 },
    { name: "Solana", value: 2248.90 },
    { name: "Polkadot", value: 1800 },
    { name: "Chainlink", value: 1500 },
  ];

  // Detailed feature information
  const detailedFeatures = [
    {
      icon: "📊",
      title: "Real-Time Portfolio Tracking",
      description: "Monitor your cryptocurrency holdings as market values fluctuate. Our platform aggregates data from major exchanges to provide accurate, up-to-the-second portfolio valuations.",
      benefits: [
        "Live price updates from 50+ exchanges",
        "Multi-wallet portfolio aggregation",
        "Historical performance tracking",
        "Custom asset tracking capabilities"
      ]
    },
    {
      icon: "🔔",
      title: "Intelligent Alert System",
      description: "Never miss a critical market movement with our customizable notification system. Set price alerts, volume thresholds, and technical indicators to trigger notifications.",
      benefits: [
        "Price movement alerts (5%+ changes)",
        "Technical indicator notifications",
        "News and event alerts",
        "Portfolio rebalancing suggestions"
      ]
    },
    {
      icon: "📈",
      title: "Advanced Analytics Suite",
      description: "Transform raw data into actionable insights with our comprehensive analytics tools. Visualize performance trends, correlation matrices, and risk metrics.",
      benefits: [
        "Risk-adjusted return analysis",
        "Portfolio correlation heatmaps",
        "Volatility and drawdown metrics",
        "Benchmark comparisons"
      ]
    },
    {
      icon: "🔄",
      title: "Automated Portfolio Rebalancing",
      description: "Maintain your target allocation with precision using our rebalancing engine. Set parameters and let our system execute trades to keep your portfolio aligned with your strategy.",
      benefits: [
        "Custom rebalancing rules",
        "Tax-loss harvesting integration",
        "Exchange integration support",
        "Backtesting capabilities"
      ]
    },
    {
      icon: "🛡️",
      title: "Comprehensive Risk Management",
      description: "Understand and mitigate portfolio risks with our advanced risk analytics. Monitor exposure, concentration, and correlation risks across your holdings.",
      benefits: [
        "Value-at-Risk calculations",
        "Portfolio stress testing",
        "Diversification analysis",
        "Correlation monitoring"
      ]
    },
    {
      icon: "💡",
      title: "AI-Powered Investment Insights",
      description: "Leverage machine learning algorithms to uncover hidden patterns and opportunities in the crypto market. Receive personalized recommendations based on your portfolio.",
      benefits: [
        "Predictive market analytics",
        "Sentiment analysis integration",
        "Portfolio optimization suggestions",
        "Emerging trend identification"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card text-foreground">
      {/* Header */}
      <header className="bg-card bg-opacity-50 border-b border-border p-4 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">CryptoTracker</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/crypto-data" className="text-muted-foreground hover:text-foreground text-sm">
              Market Data
            </Link>
            <Link href="/users" className="text-muted-foreground hover:text-foreground text-sm">
              User Analysis
            </Link>
            <Link href="/test-crypto" className="text-muted-foreground hover:text-foreground text-sm">
              Test Page
            </Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground text-sm">
              Login
            </Link>
            <Link 
              href="/signup" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg transition duration-300 text-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="md:w-1/2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Professional-Grade <span className="text-primary">Crypto Portfolio</span> Management
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              Sophisticated tools for serious investors. Track, analyze, and optimize your cryptocurrency portfolio with institutional-level analytics and insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/signup" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 sm:px-8 rounded-lg transition duration-300 text-center"
              >
                Start Free Trial
              </Link>
              <Link 
                href="/demo" 
                className="bg-transparent border border-border text-foreground hover:border-primary hover:text-primary font-bold py-3 px-6 sm:px-8 rounded-lg transition duration-300 text-center"
              >
                View Demo
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full bg-primary opacity-10 blur-3xl absolute -top-8 -left-8"></div>
              <div className="relative bg-card bg-opacity-30 border border-border rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm w-full max-w-xs sm:max-w-sm" style={{boxShadow: "0 0 20px rgb(59, 130, 246)"}}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm sm:text-base">Portfolio Snapshot</h3>
                  <span className="text-green-500 text-sm">+12.5%</span>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">$24,568.90</div>
                <div className="text-muted-foreground text-xs sm:text-sm mb-4">Total Value</div>
                <div className="h-20 sm:h-24 md:h-32 flex items-end space-x-1">
                  {[40, 60, 80, 70, 90, 65, 85].map((height, index) => (
                    <div 
                      key={index} 
                      className="flex-1 bg-gradient-to-t from-primary to-primary/80 rounded-t opacity-70"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Dashboard Preview */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Data-Driven Investment Decisions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Our sophisticated analytics platform transforms complex market data into actionable insights for informed investment decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Asset Allocation Pie Chart */}
          <CryptoPieChart data={pieChartData} title="Portfolio Allocation" />
          
          {/* Performance Line Chart */}
          <CryptoLineChart data={lineChartData} title="Portfolio Performance" />
        </div>
        
        {/* Asset Performance Bar Chart */}
        <div className="mb-8">
          <CryptoBarChart data={barChartData} title="Asset Performance" />
        </div>
      </div>

      {/* User Analysis Dashboard Preview */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Community Portfolio Insights</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Analyze and compare portfolio performance across our community of investors.
          </p>
        </div>
        
        <div className="bg-card bg-opacity-30 p-6 rounded-xl border border-border hover:border-primary transition duration-300 backdrop-blur-sm mb-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
              <h3 className="text-xl font-bold mb-3">User Portfolio Analysis</h3>
              <p className="text-muted-foreground mb-4">
                Our advanced analytics engine evaluates user portfolios based on key performance metrics including ROI, diversification, and risk management. 
                Compare your performance against community benchmarks and identify opportunities for improvement.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-foreground text-sm">Comprehensive portfolio scoring algorithm</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-foreground text-sm">Performance comparison with top investors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-foreground text-sm">Personalized improvement recommendations</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <Link 
                href="/users" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg transition duration-300 text-center w-full sm:w-auto"
              >
                View User Analysis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Features Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Comprehensive Portfolio Management</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-sm sm:text-base">
            Professional tools designed to give you complete visibility and control over your cryptocurrency investments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {detailedFeatures.map((feature, index) => (
            <div key={index} className="bg-card bg-opacity-30 p-6 rounded-xl border border-border hover:border-primary transition duration-300 backdrop-blur-sm">
              <div className="text-primary text-2xl mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-foreground text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Seamless Integration Process</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Get started in minutes with our intuitive setup process.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-xl font-bold">1</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Connect Your Wallets</h3>
            <p className="text-muted-foreground text-sm">
              Securely link your exchange accounts and wallet addresses through our encrypted connection process.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-xl font-bold">2</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Customize Your Dashboard</h3>
            <p className="text-muted-foreground text-sm">
              Configure alerts, set investment goals, and personalize your analytics views.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-xl font-bold">3</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Start Investing Smarter</h3>
            <p className="text-muted-foreground text-sm">
              Leverage insights and automation to optimize your portfolio performance.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Trusted by Professional Investors</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Join thousands of investors who trust our platform for their portfolio management needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-card bg-opacity-30 p-6 rounded-xl border border-border backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-4">
                <span className="font-bold">JD</span>
              </div>
              <div>
                <h4 className="font-bold">John Doe</h4>
                <div className="text-yellow-500 text-sm">★★★★★</div>
              </div>
            </div>
            <p className="text-foreground text-sm italic">
              &quot;The real-time alerts and portfolio analytics have transformed how I manage my crypto investments. The platform&apos;s insights helped me avoid significant losses during market downturns.&quot;
            </p>
            <div className="mt-4 text-muted-foreground text-xs">
              Portfolio Manager, Crypto Hedge Fund
            </div>
          </div>
          
          <div className="bg-card bg-opacity-30 p-6 rounded-xl border border-border backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mr-4">
                <span className="font-bold">AS</span>
              </div>
              <div>
                <h4 className="font-bold">Alice Smith</h4>
                <div className="text-yellow-500 text-sm">★★★★★</div>
              </div>
            </div>
            <p className="text-foreground text-sm italic">
              &quot;As a data-driven investor, I appreciate the depth of analytics available. The correlation analysis and risk metrics provide insights I can&apos;t get from other platforms.&quot;
            </p>
            <div className="mt-4 text-muted-foreground text-xs">
              Quantitative Analyst, Blockchain Venture Capital
            </div>
          </div>
          
          <div className="bg-card bg-opacity-30 p-6 rounded-xl border border-border backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mr-4">
                <span className="font-bold">MJ</span>
              </div>
              <div>
                <h4 className="font-bold">Mike Johnson</h4>
                <div className="text-yellow-500 text-sm">★★★★★</div>
              </div>
            </div>
            <p className="text-foreground text-sm italic">
              &quot;The automated rebalancing feature has saved me countless hours while maintaining my target allocation. The tax-loss harvesting integration is a game-changer for my investment strategy.&quot;
            </p>
            <div className="mt-4 text-muted-foreground text-xs">
              Private Investor, 7+ Years Experience
            </div>
          </div>
        </div>
      </div>

      {/* Security & Compliance Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="bg-gradient-to-r from-card to-secondary border border-border rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Enterprise-Grade Security</h2>
              <p className="text-muted-foreground mb-6">
                Your assets and data are protected with bank-level security measures, including end-to-end encryption, multi-factor authentication, and regular security audits.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-900 bg-opacity-30 flex items-center justify-center mr-3">
                    <span className="text-green-500">✓</span>
                  </div>
                  <span className="text-sm">SOC 2 Type II Compliant</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-900 bg-opacity-30 flex items-center justify-center mr-3">
                    <span className="text-green-500">✓</span>
                  </div>
                  <span className="text-sm">256-bit Encryption</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-900 bg-opacity-30 flex items-center justify-center mr-3">
                    <span className="text-green-500">✓</span>
                  </div>
                  <span className="text-sm">Zero-Knowledge Architecture</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-900 bg-opacity-30 flex items-center justify-center mr-3">
                    <span className="text-green-500">✓</span>
                  </div>
                  <span className="text-sm">Regular Penetration Testing</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-primary opacity-10 blur-3xl absolute -top-4 -left-4"></div>
                <div className="relative bg-card bg-opacity-50 border border-border rounded-2xl p-6 w-48">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔒</div>
                    <div className="text-lg font-bold">99.9%</div>
                    <div className="text-muted-foreground text-sm">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="bg-card border-border border rounded-2xl p-8 sm:p-12 text-center" style={{boxShadow: "0px 0px 20px rgb(59, 130, 246)"}}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Ready to Elevate Your Investment Strategy?</h2>
          <p className="text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professional investors who trust our platform for comprehensive portfolio management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-lg transition duration-300 text-center"
            >
              Start Free 14-Day Trial
            </Link>
            <Link 
              href="/demo" 
              className="bg-transparent border border-border text-foreground hover:bg-primary hover:text-primary-foreground font-bold py-3 px-8 rounded-lg transition duration-300 text-center"
            >
              Schedule a Demo
            </Link>
          </div>
          <p className="text-muted-foreground text-sm mt-4">No credit card required. Cancel anytime.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-4">CryptoTracker</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Advanced portfolio tracking and analytics for cryptocurrency investors. Professional tools for serious investors.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground">API</Link></li>
                <li><Link href="#" className="hover:text-foreground">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link href="#" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground">Guides</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link href="#" className="hover:text-foreground">About</Link></li>
                <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground text-sm">
            <p>© 2023 CryptoTracker. All rights reserved. Cryptocurrency investments are subject to market risks.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}