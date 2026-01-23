"use client";
import { useEffect, useMemo, useState } from "react";
import { addToWatchlist, removeFromWatchlist } from '@/lib/actions/watchlist.actions';
import { toast } from 'sonner';
import { authClient } from "@/lib/betterAuth/auth-client";

// WatchlistButton component with server action integration
// Handles adding/removing stocks from user's watchlist with proper error handling

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) => {
  
  const { data: session, isPending } = authClient.useSession();

  const [added, setAdded] = useState<boolean>(!!isInWatchlist);
  const [isLoading, setIsLoading] = useState(false);

  const label = useMemo(() => {
    if (type === "icon") return added ? "" : "";
    return isLoading ? "Loading..." : added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type, isLoading]);

  const handleClick = async () => {

    // Check if the user is authenticated
    if (!session) {
      toast.error("Sign in required", {
        description: "Please log in to manage your watchlist.",
        action: {
          label: "Login",
          onClick: () => window.location.href = "/login"
        }, 
        position: 'top-center',
      });
      return;
    }

    if (isLoading || isPending) return;
    
    setIsLoading(true);
    try {
      if (added) {
        const result = await removeFromWatchlist(symbol);
        if (result.success) {
          setAdded(false);
          onWatchlistChange?.(symbol, false);
          toast.success(result.message);
        } else {
          toast.error(result.message, {
            position: 'top-center'
          });
        }
      } else {
        const result = await addToWatchlist(symbol, company || '');
        if (result.success) {
          setAdded(true);
          onWatchlistChange?.(symbol, true);
          toast.success(result.message);
        } else {
          toast.error(result.message, {
            position: 'top-center'
          });
        }
      }
    } catch (error) {
      console.error('Watchlist toggle error:', error);
      toast.error('Failed to update watchlist');
    } finally {
      setIsLoading(false);
    }
  };

  // Sync local state if the parent prop changes (e.g., after revalidatePath)
  useEffect(() => {
    setAdded(!!isInWatchlist);
  }, [isInWatchlist]);

  if (type === "icon") {
    return (
      <button
        title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="animate-spin h-2 w-2 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={added ? "#FACC15" : "none"}
            stroke="#FACC15"
            strokeWidth="1.5"
            className="watchlist-star"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
            />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button className={`watchlist-btn ${added ? "watchlist-remove" : ""}`} onClick={handleClick} disabled={isLoading}>
      {showTrashIcon && added ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6" />
        </svg>
      ) : null}
      <span>{label}</span>
    </button>
  );
};

export default WatchlistButton;