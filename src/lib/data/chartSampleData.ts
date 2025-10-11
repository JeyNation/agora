import type { DataPoint } from '../../components/charts/LineChart';

// Static extended data ranges for dynamic loading
export const EXTENDED_STOCK_DATA = {
    // Data before main range (for panning left/backward) - Nov-Dec 2023
    before: [
        { x: new Date('2023-11-01T12:00:00Z'), y: 145.50 },
        { x: new Date('2023-11-02T12:00:00Z'), y: 147.25 },
        { x: new Date('2023-11-03T12:00:00Z'), y: 146.80 },
        { x: new Date('2023-11-04T12:00:00Z'), y: 146.80 },
        { x: new Date('2023-11-05T12:00:00Z'), y: 146.80 },
        { x: new Date('2023-11-06T12:00:00Z'), y: 148.90 },
        { x: new Date('2023-11-07T12:00:00Z'), y: 147.35 },
        { x: new Date('2023-11-08T12:00:00Z'), y: 149.60 },
        { x: new Date('2023-11-09T12:00:00Z'), y: 148.15 },
        { x: new Date('2023-11-10T12:00:00Z'), y: 150.40 },
        { x: new Date('2023-11-11T12:00:00Z'), y: 150.40 },
        { x: new Date('2023-11-12T12:00:00Z'), y: 150.40 },
        { x: new Date('2023-11-13T12:00:00Z'), y: 149.75 },
        { x: new Date('2023-11-14T12:00:00Z'), y: 151.20 },
        { x: new Date('2023-11-15T12:00:00Z'), y: 150.85 },
        { x: new Date('2023-11-16T12:00:00Z'), y: 152.30 },
        { x: new Date('2023-11-17T12:00:00Z'), y: 151.95 },
        { x: new Date('2023-11-18T12:00:00Z'), y: 151.95 },
        { x: new Date('2023-11-19T12:00:00Z'), y: 151.95 },
        { x: new Date('2023-11-20T12:00:00Z'), y: 153.10 },
        { x: new Date('2023-11-21T12:00:00Z'), y: 152.45 },
        { x: new Date('2023-11-22T12:00:00Z'), y: 154.80 },
        { x: new Date('2023-11-23T12:00:00Z'), y: 154.80 },
        { x: new Date('2023-11-24T12:00:00Z'), y: 154.80 },
        { x: new Date('2023-11-25T12:00:00Z'), y: 154.80 },
        { x: new Date('2023-11-26T12:00:00Z'), y: 154.80 },
        { x: new Date('2023-11-27T12:00:00Z'), y: 153.60 },
        { x: new Date('2023-11-28T12:00:00Z'), y: 155.25 },
        { x: new Date('2023-11-29T12:00:00Z'), y: 154.90 },
        { x: new Date('2023-11-30T12:00:00Z'), y: 156.75 },
        { x: new Date('2023-12-01T12:00:00Z'), y: 155.40 },
        { x: new Date('2023-12-02T12:00:00Z'), y: 155.40 },
        { x: new Date('2023-12-03T12:00:00Z'), y: 155.40 },
        { x: new Date('2023-12-04T12:00:00Z'), y: 157.20 },
        { x: new Date('2023-12-05T12:00:00Z'), y: 156.85 },
        { x: new Date('2023-12-06T12:00:00Z'), y: 158.50 },
        { x: new Date('2023-12-07T12:00:00Z'), y: 157.15 },
        { x: new Date('2023-12-08T12:00:00Z'), y: 159.80 },
        { x: new Date('2023-12-09T12:00:00Z'), y: 159.80 },
        { x: new Date('2023-12-10T12:00:00Z'), y: 159.80 },
        { x: new Date('2023-12-11T12:00:00Z'), y: 158.95 },
        { x: new Date('2023-12-12T12:00:00Z'), y: 160.40 },
        { x: new Date('2023-12-13T12:00:00Z'), y: 159.05 },
        { x: new Date('2023-12-14T12:00:00Z'), y: 161.70 },
        { x: new Date('2023-12-15T12:00:00Z'), y: 160.35 },
        { x: new Date('2023-12-16T12:00:00Z'), y: 160.35 },
        { x: new Date('2023-12-17T12:00:00Z'), y: 160.35 },
        { x: new Date('2023-12-18T12:00:00Z'), y: 162.00 },
        { x: new Date('2023-12-19T12:00:00Z'), y: 161.65 },
        { x: new Date('2023-12-20T12:00:00Z'), y: 163.30 },
        { x: new Date('2023-12-21T12:00:00Z'), y: 162.95 },
        { x: new Date('2023-12-22T12:00:00Z'), y: 164.60 },
        { x: new Date('2023-12-23T12:00:00Z'), y: 164.60 },
        { x: new Date('2023-12-24T12:00:00Z'), y: 164.60 },
        { x: new Date('2023-12-25T12:00:00Z'), y: 164.60 },
        { x: new Date('2023-12-26T12:00:00Z'), y: 163.25 },
        { x: new Date('2023-12-27T12:00:00Z'), y: 165.90 },
        { x: new Date('2023-12-28T12:00:00Z'), y: 164.55 },
        { x: new Date('2023-12-29T12:00:00Z'), y: 167.20 },
        { x: new Date('2023-12-30T12:00:00Z'), y: 167.20 },
        { x: new Date('2023-12-31T12:00:00Z'), y: 167.20 }
    ] as DataPoint[],
    
    // Main visible data range - January 2024
    main: [
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
        { x: new Date('2024-01-31T12:00:00Z'), y: 215.50 }
    ] as DataPoint[],
    
    // Data after main range (for panning right/forward) - Feb-Apr 2024
    after: [
        { x: new Date('2024-02-01T12:00:00Z'), y: 218.75 },
        { x: new Date('2024-02-02T12:00:00Z'), y: 222.30 },
        { x: new Date('2024-02-03T12:00:00Z'), y: 222.30 },
        { x: new Date('2024-02-04T12:00:00Z'), y: 222.30 },
        { x: new Date('2024-02-05T12:00:00Z'), y: 225.80 },
        { x: new Date('2024-02-06T12:00:00Z'), y: 229.45 },
        { x: new Date('2024-02-07T12:00:00Z'), y: 232.90 },
        { x: new Date('2024-02-08T12:00:00Z'), y: 236.15 },
        { x: new Date('2024-02-09T12:00:00Z'), y: 239.75 },
        { x: new Date('2024-02-10T12:00:00Z'), y: 243.20 },
        { x: new Date('2024-02-11T12:00:00Z'), y: 243.20 },
        { x: new Date('2024-02-12T12:00:00Z'), y: 246.85 },
        { x: new Date('2024-02-13T12:00:00Z'), y: 250.40 },
        { x: new Date('2024-02-14T12:00:00Z'), y: 254.10 },
        { x: new Date('2024-02-15T12:00:00Z'), y: 257.75 },
        { x: new Date('2024-02-16T12:00:00Z'), y: 261.30 },
        { x: new Date('2024-02-17T12:00:00Z'), y: 261.30 },
        { x: new Date('2024-02-18T12:00:00Z'), y: 261.30 },
        { x: new Date('2024-02-19T12:00:00Z'), y: 264.95 },
        { x: new Date('2024-02-20T12:00:00Z'), y: 268.50 },
        { x: new Date('2024-02-21T12:00:00Z'), y: 272.20 },
        { x: new Date('2024-02-22T12:00:00Z'), y: 275.85 },
        { x: new Date('2024-02-23T12:00:00Z'), y: 279.40 },
        { x: new Date('2024-02-24T12:00:00Z'), y: 283.15 },
        { x: new Date('2024-02-25T12:00:00Z'), y: 283.15 },
        { x: new Date('2024-02-26T12:00:00Z'), y: 286.75 },
        { x: new Date('2024-02-27T12:00:00Z'), y: 290.30 },
        { x: new Date('2024-02-28T12:00:00Z'), y: 294.05 },
        { x: new Date('2024-02-29T12:00:00Z'), y: 297.80 },
        { x: new Date('2024-03-01T12:00:00Z'), y: 301.25 },
        { x: new Date('2024-03-02T12:00:00Z'), y: 304.90 },
        { x: new Date('2024-03-03T12:00:00Z'), y: 304.90 },
        { x: new Date('2024-03-04T12:00:00Z'), y: 308.55 },
        { x: new Date('2024-03-05T12:00:00Z'), y: 312.20 },
        { x: new Date('2024-03-06T12:00:00Z'), y: 315.85 },
        { x: new Date('2024-03-07T12:00:00Z'), y: 319.50 },
        { x: new Date('2024-03-08T12:00:00Z'), y: 323.15 },
        { x: new Date('2024-03-09T12:00:00Z'), y: 323.15 },
        { x: new Date('2024-03-10T12:00:00Z'), y: 323.15 },
        { x: new Date('2024-03-11T12:00:00Z'), y: 326.80 },
        { x: new Date('2024-03-12T12:00:00Z'), y: 330.45 },
        { x: new Date('2024-03-13T12:00:00Z'), y: 334.10 },
        { x: new Date('2024-03-14T12:00:00Z'), y: 337.75 },
        { x: new Date('2024-03-15T12:00:00Z'), y: 341.40 },
        { x: new Date('2024-03-16T12:00:00Z'), y: 341.40 },
        { x: new Date('2024-03-17T12:00:00Z'), y: 341.40 },
        { x: new Date('2024-03-18T12:00:00Z'), y: 345.05 },
        { x: new Date('2024-03-19T12:00:00Z'), y: 348.70 },
        { x: new Date('2024-03-20T12:00:00Z'), y: 352.35 },
        { x: new Date('2024-03-21T12:00:00Z'), y: 356.00 },
        { x: new Date('2024-03-22T12:00:00Z'), y: 359.65 },
        { x: new Date('2024-03-23T12:00:00Z'), y: 359.65 },
        { x: new Date('2024-03-24T12:00:00Z'), y: 359.65 },
        { x: new Date('2024-03-25T12:00:00Z'), y: 363.30 },
        { x: new Date('2024-03-26T12:00:00Z'), y: 366.95 },
        { x: new Date('2024-03-27T12:00:00Z'), y: 370.60 },
        { x: new Date('2024-03-28T12:00:00Z'), y: 374.25 },
        { x: new Date('2024-03-29T12:00:00Z'), y: 377.90 },
        { x: new Date('2024-03-30T12:00:00Z'), y: 377.90 },
        { x: new Date('2024-03-31T12:00:00Z'), y: 377.90 },
        { x: new Date('2024-04-01T12:00:00Z'), y: 381.55 },
        { x: new Date('2024-04-02T12:00:00Z'), y: 385.20 },
        { x: new Date('2024-04-03T12:00:00Z'), y: 388.85 },
        { x: new Date('2024-04-04T12:00:00Z'), y: 392.50 },
        { x: new Date('2024-04-05T12:00:00Z'), y: 396.15 },
        { x: new Date('2024-04-06T12:00:00Z'), y: 396.15 },
        { x: new Date('2024-04-07T12:00:00Z'), y: 396.15 },
        { x: new Date('2024-04-08T12:00:00Z'), y: 399.80 },
        { x: new Date('2024-04-09T12:00:00Z'), y: 403.45 },
        { x: new Date('2024-04-10T12:00:00Z'), y: 407.10 },
        { x: new Date('2024-04-11T12:00:00Z'), y: 410.75 },
        { x: new Date('2024-04-12T12:00:00Z'), y: 414.40 },
        { x: new Date('2024-04-13T12:00:00Z'), y: 414.40 },
        { x: new Date('2024-04-14T12:00:00Z'), y: 414.40 },
        { x: new Date('2024-04-15T12:00:00Z'), y: 418.05 },
        { x: new Date('2024-04-16T12:00:00Z'), y: 421.70 },
        { x: new Date('2024-04-17T12:00:00Z'), y: 425.35 },
        { x: new Date('2024-04-18T12:00:00Z'), y: 429.00 },
        { x: new Date('2024-04-19T12:00:00Z'), y: 432.65 },
        { x: new Date('2024-04-20T12:00:00Z'), y: 432.65 },
        { x: new Date('2024-04-21T12:00:00Z'), y: 432.65 },
        { x: new Date('2024-04-22T12:00:00Z'), y: 436.30 },
        { x: new Date('2024-04-23T12:00:00Z'), y: 439.95 },
        { x: new Date('2024-04-24T12:00:00Z'), y: 443.60 },
        { x: new Date('2024-04-25T12:00:00Z'), y: 447.25 },
        { x: new Date('2024-04-26T12:00:00Z'), y: 450.90 },
        { x: new Date('2024-04-27T12:00:00Z'), y: 450.90 },
        { x: new Date('2024-04-28T12:00:00Z'), y: 450.90 },
        { x: new Date('2024-04-29T12:00:00Z'), y: 454.55 },
        { x: new Date('2024-04-30T12:00:00Z'), y: 458.20 }
    ] as DataPoint[]
};

// Combine all data for development/testing
export const ALL_STOCK_DATA: DataPoint[] = [
    ...EXTENDED_STOCK_DATA.before,
    ...EXTENDED_STOCK_DATA.main,
    ...EXTENDED_STOCK_DATA.after
];

// Original sample data for backward compatibility
export const SAMPLE_STOCK_DATA: DataPoint[] = EXTENDED_STOCK_DATA.main;

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
const MONTH_ABBREVIATIONS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const currencyFormatter = (value: number): string => {
    const absoluteValue = Math.abs(value);

    if (absoluteValue >= 1000) {
        const thousands = Math.ceil(absoluteValue / 1000);
        const sign = value < 0 ? '-' : '';
        return `${sign}${thousands}K`;
    }

    return `${value.toFixed(0)}`;
};

export const currencyFormatterFull = (value: number): string => {
    const absoluteValue = Math.abs(value);
	
    if (absoluteValue >= 1000) {
        const thousands = Math.ceil(absoluteValue / 1000);
        const sign = value < 0 ? '-' : '';
        return `$${sign}${thousands}K`;
    }

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
    
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    
    return `${month+1}/${day}`;
};

export const dateFormatterFull = (value: unknown): string => {
    const date = value instanceof Date ? value : new Date(value as string | number);
    
	const year = date.getUTCFullYear();
    const month = MONTH_ABBREVIATIONS[date.getUTCMonth()];
    const day = date.getUTCDate();
    
    return `${month} ${day}, ${year}`;
};