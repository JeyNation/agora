import type { DataPoint } from '../../components/charts/LineChart';

// Sample stock price data for demonstration
export const SAMPLE_STOCK_DATA: DataPoint[] = [
    { x: new Date('2024-01-01T12:00:00Z'), y: 150.25 },
    { x: new Date('2024-01-02T12:00:00Z'), y: 152.80 },
    { x: new Date('2024-01-03T12:00:00Z'), y: 148.90 },
    { x: new Date('2024-01-04T12:00:00Z'), y: 155.20 },
    { x: new Date('2024-01-05T12:00:00Z'), y: 159.75 },
    { x: new Date('2024-01-06T12:00:00Z'), y: 159.75 },
    { x: new Date('2024-01-07T12:00:00Z'), y: 159.75 },
    { x: new Date('2024-01-08T12:00:00Z'), y: 162.30 },
    { x: new Date('2024-01-09T12:00:00Z'), y: 158.95 },
    { x: new Date('2024-01-10T12:00:00Z'), y: 164.50 },
    { x: new Date('2024-01-11T12:00:00Z'), y: 167.80 },
    { x: new Date('2024-01-12T12:00:00Z'), y: 169.95 },
    { x: new Date('2024-01-13T12:00:00Z'), y: 169.95 },
    { x: new Date('2024-01-14T12:00:00Z'), y: 169.95 },
    { x: new Date('2024-01-15T12:00:00Z'), y: 172.40 },
    { x: new Date('2024-01-16T12:00:00Z'), y: 175.25 },
    { x: new Date('2024-01-17T12:00:00Z'), y: 178.90 },
    { x: new Date('2024-01-18T12:00:00Z'), y: 181.30 },
    { x: new Date('2024-01-19T12:00:00Z'), y: 184.85 },
    { x: new Date('2024-01-20T12:00:00Z'), y: 188.40 },
    { x: new Date('2024-01-21T12:00:00Z'), y: 188.40 },
    { x: new Date('2024-01-22T12:00:00Z'), y: 192.20 },
    { x: new Date('2024-01-23T12:00:00Z'), y: 195.75 },
    { x: new Date('2024-01-24T12:00:00Z'), y: 197.60 },
    { x: new Date('2024-01-25T12:00:00Z'), y: 201.40 },
    { x: new Date('2024-01-26T12:00:00Z'), y: 205.90 },
    { x: new Date('2024-01-27T12:00:00Z'), y: 205.90 },
    { x: new Date('2024-01-28T12:00:00Z'), y: 205.90 },
    { x: new Date('2024-01-29T12:00:00Z'), y: 208.25 },
    { x: new Date('2024-01-30T12:00:00Z'), y: 212.25 },
    { x: new Date('2024-01-31T12:00:00Z'), y: 215.50 },
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
    const date = value instanceof Date ? value : new Date(value as string | number);
    
    // Use UTC methods to avoid timezone issues
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${monthNames[month]} ${day}`;
};