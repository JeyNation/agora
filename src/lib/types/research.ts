export interface ResearchHistoryItem {
    ticker: string;
    timestamp: number;
    isPinned: boolean;
}

export interface ResearchHistory {
    items: ResearchHistoryItem[];
}