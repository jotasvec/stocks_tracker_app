'use client';

import WatchlistTable from "@/components/WatchlistTable";
import TradingViewWidget from "@/components/TradingViewWidget";
import TradingViewMarketSummary from "@/components/TradingViewMarketSummary";
import { SYMBOL_INFO_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG, POPULAR_STOCK_CATEGORIES } from "@/lib/constants";
import { useState, useEffect, useCallback } from "react";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { RefreshCw } from "lucide-react";

interface WatchlistTableClientProps {
  watchlistStocks: StockWithWatchlistStatus[];
}

const WatchlistTableClient = ({ watchlistStocks }: WatchlistTableClientProps) => {
  const scriptURL = "https://s3.tradingview.com/external-embedding/embed-widget-"
  const [selectedStock, setSelectedStock] = useState<string | null>(
    watchlistStocks.length > 0 ? watchlistStocks[0].symbol : null
  );
  const [viewMode, setViewMode] = useState<'my-stocks' | 'popular'>(
    watchlistStocks.length > 0 ? 'my-stocks' : 'popular'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('Tech Giants');
  const [popularStocks, setPopularStocks] = useState<StockWithWatchlistStatus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [myWatchlistStocks, setMyWatchlistStocks] = useState<StockWithWatchlistStatus[]>(watchlistStocks);

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
  };

  const loadCategoryStocks = useCallback( async (category: string) => {
    setIsLoading(true);
    try {
      const allStocks = await searchStocks();
      const categorySymbols = POPULAR_STOCK_CATEGORIES[category as keyof typeof POPULAR_STOCK_CATEGORIES] || [];

      const filteredStocks = allStocks
        .filter((stock: any) => categorySymbols.includes(stock.symbol))
        .map((stock: any) => ({ ...stock, isInWatchlist: false }));

      setPopularStocks(filteredStocks);

      if(filteredStocks.length > 0 && viewMode === 'popular') setSelectedStock(filteredStocks[0].symbol)
      /* const filteredStocks = allStocks
        .filter(stock => categorySymbols.includes(stock.symbol))
        .map(stock => ({ ...stock, isInWatchlist: false }));
      setPopularStocks(filteredStocks);
      if (filteredStocks.length > 0 && viewMode === 'popular') {
        setSelectedStock(filteredStocks[0].symbol);
      } */
    } catch (error) {
      console.error("Error loading category stocks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === 'popular' && watchlistStocks.length === 0) {
      loadCategoryStocks(selectedCategory);
    }
  }, [viewMode, selectedCategory, watchlistStocks.length, loadCategoryStocks]);

  const displayStocks = viewMode === 'my-stocks' ? myWatchlistStocks : popularStocks;

  // Debug displayStocks
  console.log('WatchlistTableClient - displayStocks:', {
    viewMode,
    displayStocksLength: displayStocks.length,
    myWatchlistStocksLength: myWatchlistStocks.length,
    popularStocksLength: popularStocks.length,
    displayStocksSample: displayStocks.slice(0, 2)
  });

  // Generate symbol sectors for TradingView Market Summary
  const getSymbolSectors = useCallback(() => {
    const sectors = [];
    
    if (viewMode === 'my-stocks' && myWatchlistStocks.length > 0) {
      // My Stocks section
      const myStocksSymbols = myWatchlistStocks.map(stock => {
        // Convert symbol to TradingView format (add exchange prefix if needed)
        const symbol = stock.symbol.toUpperCase();
        // Default to NASDAQ for common stocks, you can customize this
        return symbol.includes(':') ? symbol : `NASDAQ:${symbol}`;
      });
      
      sectors.push({
        sectionName: "My Stocks",
        symbols: myStocksSymbols
      });
    }
    
    if (viewMode === 'popular' && popularStocks.length > 0) {
      // Popular Stocks section
      const popularStocksSymbols = popularStocks.map(stock => {
        const symbol = stock.symbol.toUpperCase();
        return symbol.includes(':') ? symbol : `NASDAQ:${symbol}`;
      });
      
      sectors.push({
        sectionName: `${selectedCategory} Stocks`,
        symbols: popularStocksSymbols
      });
    }
    
    // Add default market sectors if no stocks are available
    if (sectors.length === 0) {
      sectors.push(
        {
          sectionName: "Stocks",
          symbols: ["NASDAQ:AAPL", "NASDAQ:ADBE", "NASDAQ:NVDA", "NASDAQ:TSLA"]
        },
        {
          sectionName: "Crypto", 
          symbols: ["BITSTAMP:BTCUSD", "BITSTAMP:ETHUSD", "CRYPTO:XRPUSD"]
        },
        {
          sectionName: "Indices",
          symbols: ["FOREXCOM:SPXUSD", "FOREXCOM:NSXUSD", "FOREXCOM:DJI", "FOREXCOM:UKXGBP"]
        }
      );
    }
    
    return sectors;
  }, [viewMode, myWatchlistStocks, popularStocks, selectedCategory]);

  const handleViewModeChange = (mode: 'my-stocks' | 'popular') => {
    setViewMode(mode);
    if (mode === 'popular' && popularStocks.length === 0) {
      loadCategoryStocks(selectedCategory);
    }
  };

  // Add function to refetch watchlist stocks (client-side only)
  const refetchWatchlistStocks = useCallback(async () => {
    try {
      console.log('Refetching watchlist stocks...');

      // Fetch fresh watchlist symbols
      const response = await fetch('/api/user/watchlist-symbols', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched watchlist symbols:', data.symbols);

        if (data.symbols && data.symbols.length > 0) {
          // Fetch stock data for these symbols
          const allStocks = await searchStocks();
          const updatedWatchlistStocks = allStocks
            .filter(stock => data.symbols.includes(stock.symbol))
            .map(stock => ({ ...stock, isInWatchlist: true }));

          console.log('Updated watchlist stocks:', updatedWatchlistStocks.length);
          setMyWatchlistStocks(updatedWatchlistStocks);

          // Update selected stock if needed
          if (updatedWatchlistStocks.length > 0 && !selectedStock) {
            setSelectedStock(updatedWatchlistStocks[0].symbol);
          }
        } else {
          console.log('No watchlist symbols found');
          setMyWatchlistStocks([]);
          setSelectedStock(null);
        }
      } else {
        console.error('Failed to fetch watchlist symbols');
        // Fallback to page reload
        window.location.reload();
      }
    } catch (error) {
      console.error('Error refreshing watchlist:', error);
      // Fallback to simple reload
      window.location.reload();
    }
  }, [selectedStock]);

  // Update local state when props change (for initial load)
  useEffect(() => {
    console.log('Setting myWatchlistStocks from props:', watchlistStocks.length);
    setMyWatchlistStocks(watchlistStocks);
    // Auto select the first stock if nothing is selected
    if( watchlistStocks.length > 0 && !selectedStock ) setSelectedStock(watchlistStocks[0].symbol);

  }, [watchlistStocks, selectedStock]);

  // Fetch fresh watchlist data when switching to my-stocks mode
  useEffect(() => {
    if (viewMode === 'my-stocks') {
      console.log('View mode changed to my-stocks, refetching data...');
      refetchWatchlistStocks();
    }
  }, [viewMode, refetchWatchlistStocks]);

  return (
    <>
      {/* Toggle Buttons */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => handleViewModeChange('my-stocks')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'my-stocks'
              ? 'bg-yellow-500 text-black'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          My Stocks
        </button>
        <button
          onClick={() => handleViewModeChange('popular')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'popular'
              ? 'bg-yellow-500 text-black'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Popular Stocks
        </button>
        
        {/* Refresh button for My Stocks */}
        {viewMode === 'my-stocks' && (
          <button
            onClick={refetchWatchlistStocks}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600 flex items-center gap-2"
            title="Refresh watchlist data"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        )}
      </div>

      {/* Two Column Layout Table Side */}
      <section className="flex flex-col lg:flex-row gap-6 mb-8" style={{ minHeight: '500px' }}>
        {/* Watchlist Table - 70% width */}
        <div className="w-full lg:w-[70%]">
          {/* Category Buttons for Popular View */}
          {viewMode === 'popular' && (
            <div className="mb-6 flex flex-wrap gap-2">
              {Object.keys(POPULAR_STOCK_CATEGORIES).map((category) => (
                <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  loadCategoryStocks(category);
                }}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory === category
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          <div>
            {isLoading && viewMode === 'popular' ? (
            <div className="bg-gray-800 rounded-lg border border-gray-600 p-8 text-center">
              <div className="text-gray-400 text-lg font-medium mb-2">
                Loading stocks...
              </div>
            </div>
          ) : displayStocks.length > 0 ? (
              <WatchlistTable 
                watchlistStocks={displayStocks} 
                onStockSelect={handleStockSelect}
              />
            ) : (
              <div className="bg-gray-800 rounded-lg border border-gray-600 p-8 text-center">
                <div className="text-gray-400 text-lg font-medium mb-2">
                  {viewMode === 'my-stocks' ? 'No stocks in your watchlist' : `No stocks in ${selectedCategory}`}
                </div>
                <div className="text-gray-500 text-sm">
                  {viewMode === 'my-stocks' 
                    ? 'Use the search to add stocks to your watchlist'
                    : `Try selecting a different category or search for stocks`
                  }
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TradingView Market Summary - 30% width */}
        <div className="w-full lg:w-[30%]">
          <h3 className="font-semibold text-xl text-gray-100 mb-4">
            {viewMode === 'my-stocks' ? 'My Stocks' : `${selectedCategory}`} Market Summary
          </h3>
          <TradingViewMarketSummary
            symbolSectors={getSymbolSectors()}
            showTimeRange={true}
            direction="vertical"
            itemSize="compact"
            mode="custom"
            className="bg-gray-800 rounded-lg border"
          />
        </div>
      </section>
      
      {/* Two Column Layout Below Table */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Left Column - Selected Stock Overview */}
        <div className="space-y-6">
          {selectedStock && !isLoading && (
            <TradingViewWidget
              title={`${selectedStock} Overview`}
              scriptURL={`${scriptURL}symbol-overview.js`}
              config={SYMBOL_INFO_WIDGET_CONFIG(selectedStock)}
              height={300}
            />
          )}
        </div>

        {/* Right Column - Latest News */}
        <div className="space-y-6">
          <TradingViewWidget
            title="Latest Market News"
            scriptURL={`${scriptURL}timeline.js`}
            config={TOP_STORIES_WIDGET_CONFIG}
            height={300}
            className="custom-chart"
          />
        </div>
      </section>
      {selectedStock && !isLoading && (
            <TradingViewWidget
              title={`Stocks Overview`}
              scriptURL={`${scriptURL}market-quotes.js`}
              config={TOP_STORIES_WIDGET_CONFIG}
              height={500}
            />
          )}
    </>
  );
};

export default WatchlistTableClient;