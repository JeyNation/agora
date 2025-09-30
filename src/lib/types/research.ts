export interface ResearchHistoryItem {
    ticker: string;
    timestamp: number;
    isPinned: boolean;
}

export interface ResearchHistory {
    items: ResearchHistoryItem[];
}

export type SortDirection = 'asc' | 'desc';
export type SortField = 'ticker' | 'addedAt' | 'priority';