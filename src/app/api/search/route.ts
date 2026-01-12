import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '6', 10);

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await searchProducts(query, limit);
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ products: [], error: 'Search failed' }, { status: 500 });
  }
}
