'use client';

import {
  CommandDialog,
  CommandEmpty,
  /* CommandGroup, */
  CommandInput,
  /* CommandItem, */
  CommandList,
} from "@/components/ui/command"
import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Loader2, Search, TrendingUp, Star } from "lucide-react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { useDebounce } from "@/hooks/useDebounce";
import { addToWatchlist, removeFromWatchlist, getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { toast } from "sonner";
import { auth } from "@/lib/betterAuth/auth";



const SearchCommand = ({renderAs = "button", label ="Add Stock", initialStocks }: SearchCommandProps ) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks)
    const [updatingStock, setUpdatingStock] = useState<string | null>(null)
    const [userWatchlist, setUserWatchlist] = useState<string[]>([])

    const isSearchMode = !!searchTerm.trim();
    const displayStocks = isSearchMode ? stocks : stocks?.slice(0,10)

    // Function to fetch user's watchlist
    const fetchUserWatchlist = useCallback(async () => {
        try {
            // Try to get user email from a different approach
            // Since we're on client side, we need to make a server call
            const response = await fetch('/api/user/watchlist-symbols', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('SearchCommand - Fetched watchlist symbols:', data.symbols);
                setUserWatchlist(data.symbols || []);
                return data.symbols || [];
            } else {
                console.error('SearchCommand - Failed to fetch watchlist:', response.status);
            }
        } catch (error) {
            console.error('SearchCommand - Error fetching user watchlist:', error);
        }
        return [];
    }, [])

    // Update stocks with watchlist status
    const updateStocksWithWatchlist = useCallback((stockList: StockWithWatchlistStatus[], watchlistSymbols: string[]) => {
        return stockList.map(stock => ({
            ...stock,
            isInWatchlist: watchlistSymbols.includes(stock.symbol)
        }));
    }, [])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)

        }, []);

    // Fetch user's watchlist on component mount
    useEffect(() => {
        fetchUserWatchlist().then(watchlistSymbols => {
            if (stocks.length > 0) {
                const updatedStocks = updateStocksWithWatchlist(stocks, watchlistSymbols);
                setStocks(updatedStocks);
            }
        });
    }, [fetchUserWatchlist, updateStocksWithWatchlist, stocks.length]);
    const handleSearch = useCallback(async () => {
        if(!isSearchMode) {
            // When not searching, show initial stocks with updated watchlist status
            const updatedInitialStocks = updateStocksWithWatchlist(initialStocks, userWatchlist);
            return setStocks(updatedInitialStocks);
        }

        setLoading(true);
        try {
            const results = await searchStocks(searchTerm.trim());
            // Update search results with watchlist status
            const updatedResults = updateStocksWithWatchlist(results, userWatchlist);
            setStocks(updatedResults);
        } catch {
            setStocks([])
        } finally {
            setLoading(false)
        }
    }, [isSearchMode, initialStocks, searchTerm, updateStocksWithWatchlist, userWatchlist])

    const debounceSearch = useDebounce(handleSearch, 300);

    useEffect(() => {
        debounceSearch();
    }, [searchTerm, debounceSearch])

    const handleSelectedStock = () => {
        setOpen(false);
        setSearchTerm('');
        setStocks(initialStocks)
    }

    const handleToggleWatchlist = async (e: React.MouseEvent, stock: StockWithWatchlistStatus) => {
        e.preventDefault();
        e.stopPropagation();

        setUpdatingStock(stock.symbol);

        try {
            if (stock.isInWatchlist) {
                const result = await removeFromWatchlist(stock.symbol);
                if (result.success) {
                    // Update local state
                    setStocks(prev => prev.map(s =>
                        s.symbol === stock.symbol
                            ? { ...s, isInWatchlist: false }
                            : s
                    ));
                    // Update local watchlist
                    setUserWatchlist(prev => prev.filter(symbol => symbol !== stock.symbol));
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
            } else {
                const result = await addToWatchlist(stock.symbol, stock.name);
                if (result.success) {
                    // Update local state
                    setStocks(prev => prev.map(s =>
                        s.symbol === stock.symbol
                            ? { ...s, isInWatchlist: true }
                            : s
                    ));
                    // Update local watchlist
                    setUserWatchlist(prev => [...prev, stock.symbol]);
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
            }
        } catch (error) {
            console.error('Watchlist toggle error:', error);
            toast.error('Failed to update watchlist');
        } finally {
            setUpdatingStock(null);
        }
    }
    return (
        <>
            { renderAs === 'text' 
                ?( <span onClick={()=> setOpen(true)} className="search-text cursor-pointer hover:text-yellow-500 transition-colors inline-flex items-center gap-1">
                        { label }
                        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                            <span className="text-xs">⌘</span>k
                        </kbd>
                    </span> 
                ):( 
                    <Button onClick={()=> setOpen(true)} className="search-btn flex items-center gap-2"> 
                        <Search className="h-4 w-4" />
                        { label } 
                        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                            <span className="text-xs">⌘</span>k
                        </kbd>
                    </Button>
                ) 
            }
            <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
                <div className="search-field">
                    <CommandInput value={searchTerm} onValueChange={setSearchTerm} placeholder="Type a command or search..." />
                    { loading && <Loader2 className="search-loader" /> }
                </div>
                <CommandList className="search-list">
                    { loading 
                        ? ( <CommandEmpty>No results found.</CommandEmpty> ) 
                        : displayStocks?.length === 0 ? (
                            <div className="search-list-empty">
                                { isSearchMode ? 'No results found' : 'Not Stocks available' }
                            </div>
                        ):(
                            <ul>
                                <div className="search-count">
                                    { isSearchMode ? 'Search results' : 'Popular Stocks' }
                                    {` `}({displayStocks?.length || 0})
                                </div>
                                { displayStocks.map((stock, i )=> (
                                    <li key={i} className="search-item">
                                        <Link 
                                            href={`/stocks/${stock.symbol}`}
                                            onClick={handleSelectedStock}
                                            className="search-item-link"
                                        >

                                            <TrendingUp className="h-4 w-4 text-gray-500" />
                                            <div className="flex-1">
                                                <div className="search-item-name">
                                                    {stock.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {stock.symbol} | {stock.exchange} | {stock.type}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => handleToggleWatchlist(e, stock)}
                                                disabled={updatingStock === stock.symbol}
                                                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                                            >
                                                {updatingStock === stock.symbol ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : stock.isInWatchlist ? (
                                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                ) : (
                                                    <Star className="h-4 w-4 text-gray-400" />
                                                )}
                                            </button>
                                        </Link>
                                        
                                    </li>
                                )) }
                            </ul>
                        )
                        
                }
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default SearchCommand