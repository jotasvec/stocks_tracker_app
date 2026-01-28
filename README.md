# 📈 Signalist - Advanced Stock Tracker

<div align="center">
  <img src="public/assets/images/logo.png" alt="Signalist Logo" width="200"/>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  
  **A powerful, feature-rich stock tracking application with real-time data, intelligent insights, and personalized portfolios**
  
  [![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Now-brightgreen?style=for-the-badge&logo=vercel)](https://stocks-tracker-app-sigma.vercel.app/)
</div>

---

## ✨ Key Features

### 🎯 **Core Functionality**
- **Real-time Stock Tracking**: Live market data powered by Finnhub API
- **Interactive Charts**: Advanced TradingView widgets with multiple chart types
- **Personalized Watchlists**: Create and manage custom stock portfolios
- **Smart Search**: Command palette-style stock search with keyboard shortcuts (⌘K)
- **Detailed Stock Analysis**: Comprehensive company profiles, financials, and technical indicators

### 🧠 **AI-Powered Intelligence**
- **Daily News Summaries**: AI-curated market news delivered to your inbox
- **Personalized Welcome**: AI-generated onboarding based on investment preferences
- **Smart Content Curation**: Gemini AI processes market data for actionable insights
- **Automated Email Digests**: Scheduled daily market summaries with Inngest

### 📊 **Market Intelligence**
- **Market Overview**: Global market summaries across sectors
- **Stock Heatmaps**: Visual market performance indicators
- **Technical Analysis**: Advanced charting with multiple indicators
- **Financial Data**: Company fundamentals and key metrics
- **Real-time News**: Market news aggregation and filtering

### 👤 **User Experience**
- **Modern Authentication**: Secure authentication with Better Auth
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark Theme**: Sleek dark mode interface throughout
- **Keyboard Navigation**: Power-user shortcuts and commands
- **Country-specific Preferences**: Personalized based on user location

---

## 🛠️ Technology Stack

### **Frontend Framework**
- **Next.js 16** with App Router and React Server Components
- **React 19.2** with React Compiler optimization
- **TypeScript 5** for type-safe development
- **Tailwind CSS 4** with custom animations

### **UI Components**
- **Radix UI**: Primitive components for accessibility
- **Lucide React**: Beautiful icon system
- **Sonner**: Elegant toast notifications
- **Command Menu**: VS Code-style command palette

### **Backend & Data**
- **MongoDB 7.0** with Mongoose ODM
- **Better Auth**: Modern authentication solution
- **Finnhub API**: Real-time stock market data
- **TradingView**: Professional charting widgets

### **AI & Automation**
- **Inngest**: Event-driven workflows and cron jobs
- **Google Gemini AI**: Content generation and summarization
- **Nodemailer**: Transactional email service

### **Development Tools**
- **ESLint**: Code quality and consistency
- **React Compiler**: Automatic performance optimization
- **Hot Reload**: Instant development feedback

---


## 📁 Project Structure

```
stocks_app/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication pages
│   ├── (root)/                  # Main application pages
│   │   ├── stocks/[symbol]/     # Dynamic stock pages
│   │   ├── watchlist/           # User watchlist
│   │   └── page.tsx             # Dashboard
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   ├── forms/                   # Form components
│   └── *.tsx                    # Feature components
├── lib/                         # Core libraries
│   ├── actions/                 # Server actions
│   ├── betterAuth/             # Authentication config
│   ├── inngest/                # Background jobs
│   └── utils.ts                # Utility functions
├── database/                    # Database configuration
│   ├── models/                 # Mongoose schemas
│   └── mongoose.ts             # DB connection
├── hooks/                       # Custom React hooks
├── public/                      # Static assets
└── scripts/                     # Utility scripts
```

---

## 🎯 Core Features Deep Dive

### **1. Interactive Dashboard**
The home page features a sophisticated market overview with:
- **Market Overview Widget**: Sector-wise performance tracking
- **Stock Heatmap**: Visual representation of market movements
- **Market Timeline**: Key market events and milestones  
- **Live Quotes**: Real-time stock price updates

### **2. Advanced Stock Search**
Powered by a command palette interface:
- **Keyboard Shortcuts**: Press `⌘K` to instantly open search
- **Real-time Results**: Debounced search with instant feedback
- **Smart Categorization**: Popular stocks, tech giants, growing companies
- **Watchlist Integration**: Add/remove stocks directly from search

### **3. Personalized Watchlist**
Create and manage your investment portfolio:
- **One-click Management**: Simple add/remove functionality
- **Real-time Updates**: Live price changes in your watchlist
- **Detailed Metrics**: Price, market cap, P/E ratio, and more
- **Persistent Storage**: Your watchlist is saved and synced

### **4. Comprehensive Stock Analysis**
Detailed stock pages with multiple widgets:
- **Symbol Info**: Company overview and key statistics
- **Interactive Charts**: Candlestick and baseline charts
- **Technical Analysis**: Professional technical indicators
- **Company Profile**: Business model and sector information
- **Financial Data**: Revenue, earnings, and key metrics

### **5. AI-Powered Email Digests**
Automated daily intelligence delivered to your inbox:
- **Personalized Content**: Based on your watchlist and preferences
- **AI Summarization**: Gemini AI processes market news
- **Timely Delivery**: Scheduled daily at 12:00 PM CET
- **Smart Curation**: Only relevant news and insights

---

## 🔧 Advanced Configuration

### **Database Setup**
The app uses MongoDB with Mongoose ODM. Test your connection:
```bash
npm run test:db
```

### **Background Jobs**
Inngest handles scheduled tasks:
```javascript
// Daily news summary at 12:00 PM CET
{ cron: 'TZ=Europe/Paris 0 12 * * *' }

// Welcome email on user signup
{ event: 'app/user.created' }
```

### **API Rate Limiting**
The app implements intelligent caching:
- **Stock Profiles**: 1-hour cache
- **Search Results**: 30-minute cache  
- **News Articles**: 5-minute cache
- **Real-time Data**: No cache for live prices

---

## 🎨 UI/UX Features

### **Design System**
- **Dark Theme**: Professional dark mode throughout
- **Responsive Layout**: Mobile-first responsive design
- **Micro-interactions**: Smooth transitions and hover states
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: Graceful error states and recovery

### **Accessibility**
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **High Contrast**: WCAG compliant color contrasts
- **Focus Management**: Logical tab order and focus indicators

---

## 📊 Performance Optimizations

### **React Compiler**
Automatic performance optimizations:
- **Memoization**: Intelligent component memoization
- **Dead Code Elimination**: Unused code removal
- **Bundle Optimization**: Tree-shaking and code splitting
- **Image Optimization**: Next.js automatic image optimization

### **Caching Strategy**
Multi-layer caching for optimal performance:
- **Browser Cache**: Static assets caching
- **CDN Cache**: Global content delivery
- **Server Cache**: API response caching
- **Database Cache**: Query result caching

---

## 🔒 Security Features

### **Authentication**
- **Secure Sessions**: HTTP-only secure cookies
- **Password Requirements**: Strong password policies
- **CSRF Protection**: Built-in CSRF tokens
- **Rate Limiting**: API request throttling

### **Data Protection**
- **Input Validation**: Server-side form validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy
- **Environment Variables**: Secure credential management


### **Code Standards**
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages


---

## 🙏 Acknowledgments

### **Tutorial Inspiration**
This project was developed following the excellent **JavaScript Mastery** tutorial on YouTube:
- **📺 [Build and Deploy a Modern Next.js 15 Stock Tracker App | Finnhub, MongoDB, Tailwind CSS, App Router](https://www.youtube.com/watch?v=gu4pafNCXng)**
- Special thanks to **JavaScript Mastery** for the comprehensive tutorial and best practices demonstrated

### **APIs & Services**
- **Finnhub**: Real-time market data API
- **TradingView**: Professional charting widgets
- **Better Auth**: Modern authentication framework
- **Inngest**: Background job processing
- **Google**: Gemini AI API for intelligent features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


<div align="center">
  <strong>🚀 Built with passion for the investment community</strong><br>
  <em>Empowering investors with intelligent market insights</em>
</div>
