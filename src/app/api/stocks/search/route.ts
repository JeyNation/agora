import { NextResponse } from 'next/server';
import { searchStocks } from '@/lib/services/stock-search';
import type { SearchResponse } from '@/lib/types/stock';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 200));

    const results = searchStocks(query);
    
    const response: SearchResponse = {
        results,
        query
    };

    return NextResponse.json(response);
}