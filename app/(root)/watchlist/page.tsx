//import TradingViewWidget from "@/components/TradingViewWidget";
import { searchStocks } from "@/lib/actions/finnhub.actions";
// import { SYMBOL_INFO_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from "@/lib/constants";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { auth } from "@/lib/betterAuth/auth";
import { redirect } from "next/navigation";
import WatchlistTableClient from "@/components/WatchlistTableClient";
import { headers } from "next/headers";

const WatchlistPage = async () => {
  const session = await auth.api.getSession({
      headers: await headers(),
    })
  if(!session?.session) redirect('/sign-in')

  const userEmail = session.user.email;
  const watchlistSymbols = await getWatchlistSymbolsByEmail(userEmail);

  // Get stock data for watchlist symbols
  let watchlistStocks: StockWithWatchlistStatus[] = [];
  if (watchlistSymbols.length > 0) {
    try {
      const allStocks = await searchStocks();
      watchlistStocks = allStocks
        .filter(stock => watchlistSymbols.includes(stock.symbol))
        .map(stock => ({
          ...stock,
          isInWatchlist: true
        }));
    } catch (error) {
      console.error("Error fetching watchlist stocks:", error);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">My Watchlist</h1>
        <p className="text-gray-400">
          Monitor your favorite stocks and market trends
        </p>
      </div>

      <WatchlistTableClient watchlistStocks={watchlistStocks} />
    </div>
  );
};

export default WatchlistPage;