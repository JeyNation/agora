import * as d3 from 'd3';
import { DataPoint } from './chart-drawing';

export type XAxisType = 'linear' | 'time' | 'band';
export type YAxisType = 'linear' | 'log';

export interface ScaleOptions {
    xAxisType?: XAxisType;
    yAxisType?: YAxisType;
    xDomain?: [number | Date | string, number | Date | string];
    yDomain?: [number, number];
}

/**
 * Creates X scale based on axis type and data
 */
export function createXScale(
    data: DataPoint[],
    chartWidth: number,
    xAxisType: XAxisType = 'linear',
    xDomain?: [number | Date | string, number | Date | string]
): d3.ScaleLinear<number, number> | d3.ScaleTime<number, number> | d3.ScaleBand<string> {
    if (xAxisType === 'time') {
        let domain: [Date, Date];
        if (xDomain) {
            domain = [new Date(xDomain[0]), new Date(xDomain[1])];
        } else if (data && data.length > 0) {
            domain = d3.extent(data, d => new Date(d.x)) as [Date, Date];
        } else {
            domain = [new Date(), new Date()]; // Default fallback
        }
        
        return d3.scaleTime()
            .domain(domain)
            .range([0, chartWidth]);
    } else if (xAxisType === 'band') {
        let domain: string[];
        if (xDomain) {
            domain = [String(xDomain[0]), String(xDomain[1])];
        } else if (data && data.length > 0) {
            domain = data.map(d => String(d.x));
        } else {
            domain = ['0', '1']; // Default fallback
        }
        
        return d3.scaleBand()
            .domain(domain)
            .range([0, chartWidth])
            .padding(0.1);
    } else {
        let domain: [number, number];
        if (xDomain) {
            domain = [Number(xDomain[0]), Number(xDomain[1])];
        } else if (data && data.length > 0) {
            domain = d3.extent(data, d => Number(d.x)) as [number, number];
        } else {
            domain = [0, 1]; // Default fallback
        }
        
        return d3.scaleLinear()
            .domain(domain)
            .range([0, chartWidth]);
    }
}

/**
 * Creates Y scale based on axis type and data
 */
export function createYScale(
    data: DataPoint[],
    chartHeight: number,
    yAxisType: YAxisType = 'linear',
    yDomain?: [number, number]
): d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number> {
    let yDomainValues: [number, number];
    if (yDomain) {
        yDomainValues = yDomain;
    } else if (data && data.length > 0) {
        yDomainValues = d3.extent(data, d => d.y) as [number, number];
    } else {
        yDomainValues = [0, 1]; // Default fallback
    }
    
    if (yAxisType === 'log') {
        return d3.scaleLog()
            .domain(yDomainValues)
            .range([chartHeight, 0]);
    } else {
        const scale = d3.scaleLinear()
            .domain(yDomainValues)
            .range([chartHeight, 0]);
        
        // Only apply nice() if no custom domain is provided
        if (!yDomain) {
            scale.nice();
        }
        
        return scale;
    }
}

/**
 * Creates both X and Y scales
 */
export function createScales(
    data: DataPoint[],
    chartWidth: number,
    chartHeight: number,
    options: ScaleOptions = {}
): {
    xScale: d3.ScaleLinear<number, number> | d3.ScaleTime<number, number> | d3.ScaleBand<string> | null;
    yScale: d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number> | null;
} {
    const { xAxisType = 'linear', yAxisType = 'linear', xDomain, yDomain } = options;
    
    // Return null scales if no data and no custom domains
    if ((!data || data.length === 0) && !xDomain && !yDomain) {
        return { xScale: null, yScale: null };
    }
    
    const xScale = createXScale(data, chartWidth, xAxisType, xDomain);
    const yScale = createYScale(data, chartHeight, yAxisType, yDomain);
    
    return { xScale, yScale };
}