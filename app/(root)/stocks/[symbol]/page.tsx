import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton  from "@/components/WatchlistButton";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";
import { auth } from "@/lib/betterAuth/auth";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { headers } from "next/headers";



const StockDetails = async ({ params }: StockDetailsPageProps) => {
  const { symbol } = await params;
  const session = await auth.api.getSession({
      headers: await headers(),
    })
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;
  
  let isInWatchlist = false;
  if (session?.user?.email) {
    const watchlistSymbols = await getWatchlistSymbolsByEmail(session.user.email);
    isInWatchlist = watchlistSymbols.includes(symbol.toUpperCase());
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Left Column */}
      <div className="space-y-6">
        <TradingViewWidget
            scriptURL={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            height={170}
          />

          <TradingViewWidget
            scriptURL={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />

          <TradingViewWidget
            scriptURL={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <WatchlistButton symbol={symbol.toUpperCase()} company={symbol.toUpperCase()} isInWatchlist={isInWatchlist} />
          </div>

          <TradingViewWidget
            scriptURL={`${scriptUrl}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
            height={400}
          />

          <TradingViewWidget
            scriptURL={`${scriptUrl}company-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
            height={440}
          />

          <TradingViewWidget
            scriptURL={`${scriptUrl}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
            height={464}
          />
        </div>
    </div>
  );
};

export default StockDetails;