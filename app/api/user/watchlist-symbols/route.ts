import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/betterAuth/auth';
import { headers } from 'next/headers';
import { getWatchlistSymbolsByUserId } from '@/lib/actions/watchlist.actions';

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log('API watchlist-symbols - Session:', session?.user);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - no user ID', symbols: [] },
        { status: 401 }
      );
    }

    // Get watchlist symbols for the user using userId (more reliable)
    const symbols = await getWatchlistSymbolsByUserId(session.user.id);

    console.log('API watchlist-symbols - Returning symbols:', symbols);

    return NextResponse.json({
      symbols,
      userId: session.user.id,
      email: session.user.email
    });

  } catch (error) {
    console.error('API Error fetching watchlist symbols:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watchlist', symbols: [] },
      { status: 500 }
    );
  }
}