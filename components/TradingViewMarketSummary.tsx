'use client';

import { useEffect, useRef } from 'react';

interface TradingViewMarketSummaryProps {
  symbolSectors: Array<{
    sectionName: string;
    symbols: string[];
  }>;
  showTimeRange?: boolean;
  direction?: 'vertical' | 'horizontal';
  itemSize?: 'compact' | 'default';
  mode?: 'default' | 'custom';
  className?: string;
  theme?: string;
}

const TradingViewMarketSummary = ({
  symbolSectors,
  showTimeRange = true,
  direction = 'vertical',
  itemSize = 'compact',
  mode = 'custom',
  className = '',
  theme='dark',
}: TradingViewMarketSummaryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = containerRef.current 
    if (!current) return;

    // Clear any existing content
    current.innerHTML = '';

    // Create the tv-market-summary element
    const marketSummaryElement = document.createElement('tv-market-summary');
    
    // Set attributes
    marketSummaryElement.setAttribute('symbol-sectors', JSON.stringify(symbolSectors));
    marketSummaryElement.setAttribute('show-time-range', showTimeRange.toString());
    marketSummaryElement.setAttribute('direction', direction);
    marketSummaryElement.setAttribute('item-size', itemSize);
    marketSummaryElement.setAttribute('mode', mode);
    marketSummaryElement.setAttribute('theme', theme);

    // Add the element to container
    current.appendChild(marketSummaryElement);

    // Load the TradingView script if not already loaded
    if (!document.querySelector('script[src*="tv-market-summary.js"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://widgets.tradingview-widget.com/w/en/tv-market-summary.js';
      document.head.appendChild(script);
    }


    return () => {
      if (current) {
        current.innerHTML = '';
      }
    };
  }, [symbolSectors, showTimeRange, direction, itemSize, mode, theme]);

  return (
    <div className={`tradingview-market-summary-container ${className}`}>
      <div ref={containerRef} style={{ width: '100%', minHeight: '300px' }}></div>
    </div>
  );
};

export default TradingViewMarketSummary;