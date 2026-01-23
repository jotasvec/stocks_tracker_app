'use server';

import { Watchlist } from "@/database/models/watchlist.model";
import { connectToDatabase } from "@/database/mongoose";
import { auth } from "@/lib/betterAuth/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

/**
 * Return a user's watchlist symbols by their email.
 */

interface MongoError {
    code: number;
}

// Get watchlist symbols by user ID (more reliable than email lookup)
export async function getWatchlistSymbolsByUserId(userId: string): Promise<string[]> {
    if(!userId) return [];
    try {
        console.log('getWatchlistSymbolsByUserId - Looking for userId:', userId);

        const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
        console.log('getWatchlistSymbolsByUserId - Found items:', items.length, items.map(i => i.symbol));

        return items.map((i) => String(i.symbol).toUpperCase());
    } catch (error) {
        console.error('getWatchlistSymbolsByUserId Error:', error)
        return []
    }
}

// Keep the old function for backward compatibility, but use userId internally
export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if(!email) return [];
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if(!db) throw new Error("Mongoose connection failed");

        console.log('getWatchlistSymbolsByEmail - Looking for email:', email.toLowerCase());

        // Find user by email first
        const user = await db.collection('users').findOne(
            { email: email.toLowerCase() },
            { projection: { _id: 1, id: 1, email: 1} }
        );

        if(!user) {
            console.log('getWatchlistSymbolsByEmail - User not found for email:', email);
            // Try to find user by other email variations
            const users = await db.collection('users').find(
                { email: { $regex: email, $options: 'i' } },
                { projection: { _id: 1, id: 1, email: 1} }
            ).limit(3).toArray();
            console.log('getWatchlistSymbolsByEmail - Similar emails found:', users);

            if (users.length === 0) {
                console.log('getWatchlistSymbolsByEmail - No users found at all');
                return [];
            }

            // Use the first matching user
            const foundUser = users[0];
            console.log('getWatchlistSymbolsByEmail - Using first matching user:', foundUser);
            const userId = (foundUser.id as string) || String(foundUser._id || '');
            return await getWatchlistSymbolsByUserId(userId);
        }

        // Use the same userId logic as addToWatchlist
        const userId = (user.id as string) || String(user._id || '');
        console.log('getWatchlistSymbolsByEmail - Found user, using userId:', userId);

        return await getWatchlistSymbolsByUserId(userId);
    } catch (error) {
        console.error('getWatchlistSymbolByEmail Error:', error)
        return []
    }
}

/**
 * Add a stock to the user's watchlist
 */
/* export async function addToWatchlist(symbol: string, company: string): Promise<{ success: boolean; message: string }> {
    try {
        console.log('🔍 addToWatchlist called with:', { symbol, company });
        
        const session = await auth.api.getSession({
            headers: await headers(),
        })
        
        console.log('🔍 Session:', session);
        
        if (!session?.session) {
            console.log('❌ No user session');
            return { success: false, message: "You must be logged in to add stocks to your watchlist" };
        }
        
        if (!session.user?.email) {
            console.log('❌ No user email in session');
            return { success: false, message: "You must be logged in to add stocks to your watchlist" };
        }

        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error("Mongoose connection failed");

        const user = await db.collection('users').findOne<{ _id?: unknown, id?: string, email?: string }>(
            { email: session.user.email.toLowerCase() },
            { projection: { _id: 1, id: 1, email: 1 } }
        );

        if (!user) {
            return { success: false, message: "User not found" };
        }

        const userId = (user.id as string) || String(user._id || '');

        // Check if already in watchlist
        const existingItem = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() });
        if (existingItem) {
            return { success: false, message: "Stock is already in your watchlist" };
        }

        // Add to watchlist
        await Watchlist.create({
            userId,
            symbol: symbol.toUpperCase(),
            company
        });

        revalidatePath('/watchlist');
        revalidatePath('/');

        return { success: true, message: "Stock added to watchlist" };

    } catch (error) {
        console.error('addToWatchlist Error:', error);
        return { success: false, message: "Failed to add stock to watchlist" };
    }
} */
export async function addToWatchlist(symbol: string, company: string): Promise<{ success: boolean; message: string }> {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        // Better-Auth typically puts the user ID in session.user.id
        const userId = session?.user?.id;
        console.log('addToWatchlist - Session user:', session?.user);
        console.log('addToWatchlist - Using userId:', userId, 'for symbol:', symbol);

        if (!userId) return { success: false, message: "Unauthorized - must be logged for adding the stock to the Watchlist" };

        await connectToDatabase();

        // Use try-catch specifically for the duplicate key error
        try {
            await Watchlist.create({
                userId,
                symbol: symbol.toUpperCase(),
                company
            });
        } catch (err) {
            const mongoError = err as MongoError;
            if (mongoError.code === 11000) {
                return { success: false, message: "Stock is already in your watchlist" };
            }
            throw err;
        }

        revalidatePath('/watchlist');
        return { success: true, message: "Stock added to watchlist" };
    } catch (error) {
        console.error('addToWatchlist Error:', error);
        return { success: false, message: "Failed to add stock" };
    }
}
/**
 * Remove a stock from the user's watchlist
 */
export async function removeFromWatchlist(symbol: string): Promise<{ success: boolean; message: string }> {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.email) {
            return { success: false, message: "You must be logged in to remove stocks from your watchlist" };
        }

        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error("Mongoose connection failed");

        const user = await db.collection('users').findOne<{ _id?: unknown, id?: string, email?: string }>(
            { email: session.user.email.toLowerCase() },
            { projection: { _id: 1, id: 1, email: 1 } }
        );

        if (!user) {
            return { success: false, message: "User not found" };
        }

        const userId = (user.id as string) || String(user._id || '');

        const result = await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });

        if (result.deletedCount === 0) {
            return { success: false, message: "Stock not found in watchlist" };
        }

        revalidatePath('/watchlist');
        revalidatePath('/');

        return { success: true, message: "Stock removed from watchlist" };

    } catch (error) {
        console.error('removeFromWatchlist Error:', error);
        return { success: false, message: "Failed to remove stock from watchlist" };
    }
}

/**
 * Get full watchlist with stock data
 */
export async function getWatchlistWithData(email: string): Promise<StockWithData[]> {
    if (!email) return [];
    
    try {
        const mongoose = await connectToDatabase();
        const session = await auth.api.getSession({ headers: await headers() });
        const userId = session?.user?.id;
        if (!userId) return [];
        
        const db = mongoose.connection.db;
        if (!db) throw new Error("Mongoose connection failed");

        const user = await db.collection('users').findOne<{ _id?: unknown, id?: string, email?: string }>(
            { email: email.toLowerCase() },
            { projection: { _id: 1, id: 1, email: 1 } }
        );

        if (!user) return [];
        
        const items = await Watchlist.find({ userId }).lean();
        
        /*  return items.map(item => ({
            ...JSON.parse(JSON.stringify(item)),
            _id: item._id.toString(),
            currentPrice: undefined,
            changePercent: undefined,
            priceFormatted: '--',
            changeFormatted: '--',
            marketCap: '--',
            peRatio: '--'
        })); */
        return items.map(item => ({
            ...item,
            symbol: String(item.symbol).toUpperCase(),
            company: item.company || String(item.symbol),
            currentPrice: undefined,
            changePercent: undefined,
            exchange: 'US', // Finnhub default
            type: 'Common Stock',
            isInWatchlist: true,
            _id: String(item._id) // Convert ObjectId to string
        }));

    } catch (error) {
        console.error('getWatchlistWithData Error:', error);
        return [];
    }
}