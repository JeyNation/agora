export interface StockInfo {
    ticker: string;
    companyName: string;
}

export interface SearchResponse {
    results: StockInfo[];
    query: string;
}