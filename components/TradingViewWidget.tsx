'use client';
import useTradingViewWidget from '@/hooks/useTradingViewWidget';
import { cn } from '@/lib/utils';

// TradingViewWidget.jsx
import { memo } from 'react';

interface TradingViewWidgetProps{
    title?: string;
    scriptURL?: string;
    config: Record<string, unknown>;
    height?: number; 
    className?: string; 
};   


function TradingViewWidget({ title, scriptURL, config, height=600, className }: TradingViewWidgetProps) {
  const finalScriptURL = scriptURL || 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
  const containerRef = useTradingViewWidget(finalScriptURL, config, height)

  return (
    <div className="w-full">
        { title &&  <h3 className="font-semibold text-2xl text-gray-100 mb-5 ">{title}</h3> }
        <div className={cn('tradingview-widget-container', className)} ref={containerRef} >
            <div className="tradingview-widget-container__widget" style={{ height, width: "100%" }}></div>
        </div>
    </div>
  );
}

export default memo(TradingViewWidget);
