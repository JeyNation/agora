import * as d3 from 'd3';
import { DataPoint, HighlightRange } from './chartDrawing';
import { XAxisType } from './chartScales';

/**
 * Process X highlight ranges into renderable format
 */
export function processXHighlightRanges(
    xScale: d3.ScaleLinear<number, number> | d3.ScaleTime<number, number> | d3.ScaleBand<string> | null,
    xHighlightRanges: HighlightRange[],
    xAxisType: XAxisType,
    chartWidth: number,
    defaultHighlightColor: string,
    defaultHighlightOpacity: number
): Array<{x: number; width: number; color: string; opacity: number}> {
    if (!xScale || !xHighlightRanges || xHighlightRanges.length === 0) return [];
    
    return xHighlightRanges.map(range => {
        let startPos: number, endPos: number;
        
        if (xAxisType === 'time') {
            const timeScale = xScale as d3.ScaleTime<number, number>;
            startPos = timeScale(new Date(range.start));
            endPos = timeScale(new Date(range.end));
        } else if (xAxisType === 'band') {
            const bandScale = xScale as d3.ScaleBand<string>;
            const startBand = bandScale(String(range.start)) || 0;
            const endBand = bandScale(String(range.end)) || 0;
            startPos = startBand;
            endPos = endBand + bandScale.bandwidth();
        } else {
            const linearScale = xScale as d3.ScaleLinear<number, number>;
            startPos = linearScale(Number(range.start));
            endPos = linearScale(Number(range.end));
        }
        
        return {
            x: Math.max(0, Math.min(startPos, endPos)),
            width: Math.min(chartWidth, Math.abs(endPos - startPos)),
            color: range.color || defaultHighlightColor,
            opacity: range.opacity || defaultHighlightOpacity
        };
    });
}

/**
 * Process Y highlight ranges into renderable format
 */
export function processYHighlightRanges(
    yScale: d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number> | null,
    yHighlightRanges: HighlightRange[],
    chartHeight: number,
    defaultHighlightColor: string,
    defaultHighlightOpacity: number
): Array<{y: number; height: number; color: string; opacity: number}> {
    if (!yScale || !yHighlightRanges || yHighlightRanges.length === 0) return [];
    
    return yHighlightRanges.map(range => {
        const scale = yScale as d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number>;
        const startPos = scale(Number(range.start));
        const endPos = scale(Number(range.end));
        
        return {
            y: Math.max(0, Math.min(startPos, endPos)),
            height: Math.min(chartHeight, Math.abs(startPos - endPos)),
            color: range.color || defaultHighlightColor,
            opacity: range.opacity || defaultHighlightOpacity
        };
    });
}

/**
 * Calculate the optimal tooltip position given available space
 */
export interface TooltipPositionOptions {
    dataPointX: number;
    dataPointY: number;
    tooltipWidth: number;
    tooltipHeight: number;
    chartLeft: number;
    chartRight: number;
    chartTop: number;
    chartBottom: number;
    padding: number;
    arrowSize: number;
}

export interface TooltipPositionResult {
    left: number;
    top: number;
    position: string;
    showArrow: boolean;
    arrowLeft?: string;
    arrowTop?: string;
}

export function calculateTooltipPosition(options: TooltipPositionOptions): TooltipPositionResult {
    const {
        dataPointX,
        dataPointY,
        tooltipWidth,
        tooltipHeight,
        chartLeft,
        chartRight,
        chartTop,
        chartBottom,
        padding,
        arrowSize
    } = options;

    // Calculate available space in each direction
    const spaceAbove = dataPointY - chartTop - padding;
    const spaceBelow = chartBottom - dataPointY - padding;
    const spaceLeft = dataPointX - chartLeft - padding;
    const spaceRight = chartRight - dataPointX - padding;
    
    // Helper functions
    const fitsVertically = (space: number) => space >= tooltipHeight + arrowSize + 4;
    const fitsHorizontally = (space: number) => space >= tooltipWidth + arrowSize + 4;
    
    // Try primary positions with arrows
    if (fitsVertically(spaceAbove) && spaceLeft >= tooltipWidth / 2 && spaceRight >= tooltipWidth / 2) {
        // TOP - centered above data point
        return {
            left: dataPointX - tooltipWidth / 2,
            top: dataPointY - tooltipHeight - arrowSize - 2,
            position: 'top',
            showArrow: true,
            arrowLeft: '50%'
        };
    }
    
    if (fitsVertically(spaceBelow) && spaceLeft >= tooltipWidth / 2 && spaceRight >= tooltipWidth / 2) {
        // BOTTOM - centered below data point
        return {
            left: dataPointX - tooltipWidth / 2,
            top: dataPointY + arrowSize + 2,
            position: 'bottom',
            showArrow: true,
            arrowLeft: '50%'
        };
    }
    
    if (fitsHorizontally(spaceRight) && spaceAbove >= tooltipHeight / 2 && spaceBelow >= tooltipHeight / 2) {
        // RIGHT - centered right of data point
        return {
            left: dataPointX + arrowSize + 2,
            top: dataPointY - tooltipHeight / 2,
            position: 'right',
            showArrow: true,
            arrowTop: '50%'
        };
    }
    
    if (fitsHorizontally(spaceLeft) && spaceAbove >= tooltipHeight / 2 && spaceBelow >= tooltipHeight / 2) {
        // LEFT - centered left of data point
        return {
            left: dataPointX - tooltipWidth - arrowSize - 2,
            top: dataPointY - tooltipHeight / 2,
            position: 'left',
            showArrow: true,
            arrowTop: '50%'
        };
    }

    // Try corner positions without arrows
    if (fitsVertically(spaceAbove) && spaceRight >= tooltipWidth) {
        return {
            left: dataPointX + padding,
            top: dataPointY - tooltipHeight - padding,
            position: 'top-left',
            showArrow: false
        };
    }
    
    if (fitsVertically(spaceAbove) && spaceLeft >= tooltipWidth) {
        return {
            left: dataPointX - tooltipWidth - padding,
            top: dataPointY - tooltipHeight - padding,
            position: 'top-right',
            showArrow: false
        };
    }
    
    if (fitsVertically(spaceBelow) && spaceRight >= tooltipWidth) {
        return {
            left: dataPointX + padding,
            top: dataPointY + padding,
            position: 'bottom-left',
            showArrow: false
        };
    }
    
    if (fitsVertically(spaceBelow) && spaceLeft >= tooltipWidth) {
        return {
            left: dataPointX - tooltipWidth - padding,
            top: dataPointY + padding,
            position: 'bottom-right',
            showArrow: false
        };
    }

    // Fallback: position with most available space
    const maxSpace = Math.max(spaceAbove, spaceBelow, spaceLeft, spaceRight);
    
    if (maxSpace === spaceAbove) {
        return {
            left: Math.max(chartLeft + padding, Math.min(dataPointX - tooltipWidth / 2, chartRight - tooltipWidth - padding)),
            top: chartTop + padding,
            position: 'top-fallback',
            showArrow: false
        };
    }
    
    if (maxSpace === spaceBelow) {
        return {
            left: Math.max(chartLeft + padding, Math.min(dataPointX - tooltipWidth / 2, chartRight - tooltipWidth - padding)),
            top: chartBottom - tooltipHeight - padding,
            position: 'bottom-fallback',
            showArrow: false
        };
    }
    
    if (maxSpace === spaceRight) {
        return {
            left: chartRight - tooltipWidth - padding,
            top: Math.max(chartTop + padding, Math.min(dataPointY - tooltipHeight / 2, chartBottom - tooltipHeight - padding)),
            position: 'right-fallback',
            showArrow: false
        };
    }
    
    // Default to left fallback
    return {
        left: chartLeft + padding,
        top: Math.max(chartTop + padding, Math.min(dataPointY - tooltipHeight / 2, chartBottom - tooltipHeight - padding)),
        position: 'left-fallback',
        showArrow: false
    };
}

/**
 * Validate chart data and return error message if invalid
 */
export function validateChartData(data: DataPoint[]): string | null {
    if (!Array.isArray(data)) {
        return 'Data must be an array';
    }
    
    if (data.length === 0) {
        return 'Data array cannot be empty';
    }
    
    for (let i = 0; i < data.length; i++) {
        const point = data[i];
        if (!point || typeof point !== 'object') {
            return `Data point at index ${i} must be an object`;
        }
        
        if (point.x === undefined || point.x === null) {
            return `Data point at index ${i} is missing x value`;
        }
        
        if (point.y === undefined || point.y === null) {
            return `Data point at index ${i} is missing y value`;
        }
        
        if (typeof point.y !== 'number' || isNaN(point.y)) {
            return `Data point at index ${i} has invalid y value (must be a number)`;
        }
    }
    
    return null;
}

/**
 * Calculate optimal chart dimensions based on container and constraints
 */
export function calculateChartDimensions(
    containerWidth: number,
    containerHeight: number,
    minWidth: number = 300,
    minHeight: number = 200,
    maxWidth?: number,
    maxHeight?: number
): { width: number; height: number } {
    let width = Math.max(containerWidth, minWidth);
    let height = Math.max(containerHeight, minHeight);
    
    if (maxWidth && width > maxWidth) {
        width = maxWidth;
    }
    
    if (maxHeight && height > maxHeight) {
        height = maxHeight;
    }
    
    return { width, height };
}