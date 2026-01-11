'use server';

import { Watchlist } from "@/database/models/watchlist.model";
import { connectToDatabase } from "@/database/mongoose";

/**
 * Return a user's watchlist symbols by their email.
 */

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if(!email) return [];
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if(!db) throw new Error("Mongoose connection failed");

        const user = await db.collection('users').findOne<{ _id?: unknown, id?: string, email?: string }>(
            { email: email.toLowerCase() },
            { projection: { _id: 1, id: 1, email: 1} } 
        );
        if(!user) return [];
        const userId = (user.id as string) || String(user._id || '');
        const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
        
        return items.map((i) => String(i.symbol).toUpperCase());


        
    } catch (error) {
        console.error('getWatchlistSymbolByEmail Error. ', error)
        return []
    }
}