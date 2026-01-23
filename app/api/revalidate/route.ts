import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Path parameter required' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}