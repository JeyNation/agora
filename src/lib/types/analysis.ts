export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface MetricsData {
  pe: number;
  marketCap: number;
  volume: number;
  avgVolume: number;
}

export interface AnalysisPageProps {
  symbol?: string;
}