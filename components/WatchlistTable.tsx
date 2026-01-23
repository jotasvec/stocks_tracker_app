'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WATCHLIST_TABLE_HEADER } from "@/lib/constants";
import Link from "next/link";
import WatchlistButton from "./WatchlistButton";
import { Button } from "./ui/button";
import { useState } from "react";

interface WatchlistTableProps {
  watchlistStocks?: StockWithWatchlistStatus[];
  onStockSelect?: (symbol: string) => void;
}

const WatchlistTable = ({ watchlistStocks = [], onStockSelect }: WatchlistTableProps) => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  
  const handleStockClick = (symbol: string) => {
    setSelectedStock(symbol);
    onStockSelect?.(symbol);
  };
  
  if (watchlistStocks.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-600 p-8 text-center">
        <div className="text-gray-400 text-lg font-medium">
          No stocks available
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {WATCHLIST_TABLE_HEADER.map((header, index) => (
              <TableHead key={index} className="text-left">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {watchlistStocks.map((stock) => (
            <TableRow 
              key={stock.symbol} 
              className={selectedStock === stock.symbol ? "bg-gray-800" : ""}
              onClick={() => handleStockClick(stock.symbol)}
            >
              <TableCell className="text-left font-medium">
                <Link 
                  href={`/stocks/${stock.symbol}`}
                  className="hover:text-yellow-500 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {stock.name}
                </Link>
              </TableCell>
              <TableCell className="text-left">
                <Link 
                  href={`/stocks/${stock.symbol}`}
                  className="hover:text-yellow-500 transition-colors font-mono"
                  onClick={(e) => e.stopPropagation()}
                >
                  {stock.symbol}
                </Link>
              </TableCell>
              <TableCell className="text-left">--</TableCell>
              <TableCell className="text-left">--</TableCell>
              <TableCell className="text-left">--</TableCell>
              <TableCell className="text-left">--</TableCell>
              <TableCell className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Alerts</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-3 px-2 text-xs text-yellow-500 hover:text-yellow-400 hover:bg-gray-800"
                  >
                    Create
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-left">
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Link 
                    href={`/stocks/${stock.symbol}`}
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors"
                  >
                    View
                  </Link>
                  <WatchlistButton 
                    symbol={stock.symbol}
                    isInWatchlist={true}
                    type={"icon"}
                    company={stock.name}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WatchlistTable;