import { useMemo } from 'react';
import * as d3 from 'd3';
import { createScales, type XAxisType, type YAxisType } from '../utils/chart-scales';
import { type DataPoint } from '../utils';

export interface UseChartScalesOptions {
    xAxisType?: XAxisType;
    yAxisType?: YAxisType;
    xDomain?: [number | Date | string, number | Date | string];
    yDomain?: [number, number];
}

export interface UseChartScalesResult {
    xScale: d3.ScaleLinear<number, number> | d3.ScaleTime<number, number> | d3.ScaleBand<string> | null;
    yScale: d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number> | null;
}

/**
 * Custom hook to handle chart scale creation and memoization
 */
export function useChartScales(
    data: DataPoint[],
    chartWidth: number,
    chartHeight: number,
    options: UseChartScalesOptions = {}
): UseChartScalesResult {
    const { xAxisType = 'linear', yAxisType = 'linear', xDomain, yDomain } = options;

    // Memoize scales to prevent unnecessary recalculations
    const { xScale, yScale } = useMemo(() => {
        return createScales(data, chartWidth, chartHeight, {
            xAxisType,
            yAxisType,
            xDomain,
            yDomain
        });
    }, [data, chartWidth, chartHeight, xAxisType, yAxisType, xDomain, yDomain]);

    return { xScale, yScale };
}