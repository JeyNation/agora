import type { DataPoint } from '../../components/charts/LineChart';

// Sample stock price data for demonstration
export const SAMPLE_STOCK_DATA: DataPoint[] = [
    { x: new Date('2024-01-01'), y: 150.25 },
    { x: new Date('2024-01-02'), y: 152.80 },
    { x: new Date('2024-01-03'), y: 148.90 },
    { x: new Date('2024-01-04'), y: 155.20 },
    { x: new Date('2024-01-05'), y: 159.75 },
    { x: new Date('2024-01-08'), y: 162.30 },
    { x: new Date('2024-01-09'), y: 158.95 },
    { x: new Date('2024-01-10'), y: 164.50 },
    { x: new Date('2024-01-11'), y: 167.80 },
    { x: new Date('2024-01-12'), y: 165.40 },
    { x: new Date('2024-01-16'), y: 169.25 },
    { x: new Date('2024-01-17'), y: 171.90 },
    { x: new Date('2024-01-18'), y: 174.30 },
    { x: new Date('2024-01-19'), y: 172.85 },
    { x: new Date('2024-01-22'), y: 178.20 },
    { x: new Date('2024-01-23'), y: 180.75 },
    { x: new Date('2024-01-24'), y: 177.60 },
    { x: new Date('2024-01-25'), y: 182.40 },
    { x: new Date('2024-01-26'), y: 185.90 },
    { x: new Date('2024-01-29'), y: 183.25 },
];

// Sample linear data
export const SAMPLE_LINEAR_DATA: DataPoint[] = [
    { x: 0, y: 10 },
    { x: 1, y: 15 },
    { x: 2, y: 12 },
    { x: 3, y: 18 },
    { x: 4, y: 22 },
    { x: 5, y: 20 },
    { x: 6, y: 25 },
    { x: 7, y: 28 },
    { x: 8, y: 26 },
    { x: 9, y: 32 },
];

// Sample categorical data
export const SAMPLE_CATEGORICAL_DATA: DataPoint[] = [
    { x: 'Jan', y: 65 },
    { x: 'Feb', y: 75 },
    { x: 'Mar', y: 80 },
    { x: 'Apr', y: 88 },
    { x: 'May', y: 92 },
    { x: 'Jun', y: 98 },
    { x: 'Jul', y: 105 },
    { x: 'Aug', y: 102 },
    { x: 'Sep', y: 95 },
    { x: 'Oct', y: 87 },
    { x: 'Nov', y: 78 },
    { x: 'Dec', y: 70 },
];

// Sample revenue data (in millions)
export const SAMPLE_REVENUE_DATA: DataPoint[] = [
    { x: 2020, y: 274515 },
    { x: 2021, y: 365817 },
    { x: 2022, y: 394328 },
    { x: 2023, y: 383285 },
    { x: 2024, y: 391035 },
];

// Formatters
export const currencyFormatter = (value: number): string => {
    return `$${value.toFixed(2)}`;
};

export const percentageFormatter = (value: number): string => {
    return `${value.toFixed(1)}%`;
};

export const millionsFormatter = (value: number): string => {
    return `$${(value / 1000000).toFixed(1)}M`;
};

export const dateFormatter = (value: unknown): string => {
    return new Date(value as string | number | Date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
};