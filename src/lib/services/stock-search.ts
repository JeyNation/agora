import { StockInfo } from '../types/stock';
import { MOCK_STOCKS } from '../data/mock-stocks';

export function searchStocks(query: string): StockInfo[] {
    if (!query) return [];
    
    const normalizedQuery = query.toUpperCase();
    
    return MOCK_STOCKS.filter(stock => 
        stock.ticker.includes(normalizedQuery) || 
        stock.companyName.toUpperCase().includes(normalizedQuery)
    );
}