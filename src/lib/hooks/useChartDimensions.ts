import { useEffect, useState, RefObject } from 'react';

export interface ChartDimensions {
    width: number;
    height: number;
}

export interface UseChartDimensionsResult {
    dimensions: ChartDimensions;
    actualWidth: number;
    actualHeight: number;
    chartWidth: number;
    chartHeight: number;
}

/**
 * Custom hook to handle responsive chart dimensions
 */
export function useChartDimensions(
    containerRef: RefObject<HTMLDivElement | null>,
    width: number | string = 800,
    height: number | string = 400,
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    } = { top: 20, right: 20, bottom: 30, left: 60 }
): UseChartDimensionsResult {
    const [dimensions, setDimensions] = useState<ChartDimensions>({ width: 800, height: 400 });

    // Handle responsive dimensions
    const actualWidth = typeof width === 'string' ? dimensions.width : (width as number);
    const actualHeight = typeof height === 'string' ? dimensions.height : (height as number);

    // Calculate chart dimensions (excluding margins)
    const chartWidth = actualWidth - margin.left - margin.right;
    const chartHeight = actualHeight - margin.top - margin.bottom;

    // ResizeObserver for responsive sizing
    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width: containerWidth, height: containerHeight } = entries[0].contentRect;
                setDimensions({
                    width: containerWidth || 800,
                    height: containerHeight || 400
                });
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [containerRef]);

    return {
        dimensions,
        actualWidth,
        actualHeight,
        chartWidth,
        chartHeight
    };
}