'use client';
import useTradingViewWidget from '@/hooks/useTradingViewWidget';
import { cn } from '@/lib/utils';
// TradingViewWidget.jsx
import React, { memo } from 'react';

interface TradingViewWidgetsProps{
    title?: string;
    scriptURL: string;
    config: Record<string, unknown>
    height?: number; 
    className?: string; 
};   


function TradingViewWidget({ title, scriptURL, config, height=600, className }: TradingViewWidgetsProps) {
  const containerRef = useTradingViewWidget(scriptURL, config, height)


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
