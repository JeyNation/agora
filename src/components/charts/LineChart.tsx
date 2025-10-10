'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { useTheme } from '@mui/material/styles';
import {
    drawGridLines,
    drawHighlightRanges,
    drawLinePath,
    drawDots,
    drawHoverAreas,
    drawXAxis,
    drawYAxis,
    drawAxisLabels,
    styleAxisElements,
    type DataPoint,
    type HighlightRange,
    type ChartDimensions,
    type ChartScales,
    type GridConfig,
    type AxisConfig,
    type LineConfig,
    type DotsConfig
} from '../../lib/utils';
import { type XAxisType, type YAxisType } from '../../lib/utils/chart-scales';
import ChartTooltip from './ChartTooltip';
import { useChartDimensions } from '../../lib/hooks/useChartDimensions';
import { useChartScales } from '../../lib/hooks/useChartScales';
import { useTooltipState } from '../../lib/hooks/useTooltipState';
import { processXHighlightRanges, processYHighlightRanges, validateChartData } from '../../lib/utils/chart-calculations';

// Re-export interfaces from utility for external use
export type { DataPoint, HighlightRange } from '../../lib/utils';

export interface ChartDimensionsConfig {
    width?: number | string;
    height?: number | string;
    margin?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
}

export interface ChartStylingConfig {
    lineColor?: string;
    strokeWidth?: number;
    className?: string;
    defaultHighlightColor?: string;
    defaultHighlightOpacity?: number;
}

export interface ChartInteractionConfig {
    showDots?: boolean;
    dotRadius?: number;
    onHover?: (data: DataPoint | null) => void;
    showTooltip?: boolean;
    tooltipColor?: string;
}

export interface ChartAxesConfig {
    xAxisType?: XAxisType;
    yAxisType?: YAxisType;
    xAxisLabel?: string;
    yAxisLabel?: string;
    xDomain?: [number | Date | string, number | Date | string];
    yDomain?: [number, number];
    formatX?: (value: unknown) => string;
    formatY?: (value: number) => string;
}

export interface ChartGridConfig {
    showXGrid?: boolean;
    showYGrid?: boolean;
}

export interface ChartAnimationConfig {
    animate?: boolean;
    animationDuration?: number;
}

export interface ChartErrorConfig {
    loading?: boolean;
    error?: Error | string | null;
    fallback?: React.ComponentType<{ error?: Error | string }>;
    onError?: (error: Error) => void;
}

export interface LineChartProps {
    data: DataPoint[];
    dimensions?: ChartDimensionsConfig;
    styling?: ChartStylingConfig;
    interaction?: ChartInteractionConfig;
    axes?: ChartAxesConfig;
    grid?: ChartGridConfig;
    animation?: ChartAnimationConfig;
    errorHandling?: ChartErrorConfig;
    xHighlightRanges?: HighlightRange[];
    yHighlightRanges?: HighlightRange[];
    
    // Legacy props for backward compatibility (will be deprecated)
    loading?: boolean;
    error?: Error | string | null;
    width?: number | string;
    height?: number | string;
    margin?: { top: number; right: number; bottom: number; left: number; };
    xAxisLabel?: string;
    yAxisLabel?: string;
    lineColor?: string;
    strokeWidth?: number;
    showDots?: boolean;
    dotRadius?: number;
    showXGrid?: boolean;
    showYGrid?: boolean;
    animate?: boolean;
    animationDuration?: number;
    xAxisType?: XAxisType;
    yAxisType?: YAxisType;
    xDomain?: [number | Date | string, number | Date | string];
    yDomain?: [number, number];
    defaultHighlightColor?: string;
    defaultHighlightOpacity?: number;
    formatX?: (value: unknown) => string;
    formatY?: (value: number) => string;
    onHover?: (data: DataPoint | null) => void;
    showTooltip?: boolean;
    tooltipColor?: string;
    className?: string;
}

function LineChart(props: LineChartProps) {
    const {
        data,
        dimensions,
        styling,
        interaction,
        axes,
        grid,
        animation,
        errorHandling,
        xHighlightRanges = [],
        yHighlightRanges = [],
        // Legacy props for backward compatibility
        loading: legacyLoading,
        error: legacyError,
        width: legacyWidth = 800,
        height: legacyHeight = 400,
        margin: legacyMargin = { top: 20, right: 20, bottom: 30, left: 60 },
        xAxisLabel: legacyXAxisLabel,
        yAxisLabel: legacyYAxisLabel,
        lineColor: legacyLineColor,
        strokeWidth: legacyStrokeWidth = 2,
        showDots: legacyShowDots = false,
        dotRadius: legacyDotRadius = 4,
        showXGrid: legacyShowXGrid,
        showYGrid: legacyShowYGrid,
        animate: legacyAnimate = true,
        animationDuration: legacyAnimationDuration = 1000,
        xAxisType: legacyXAxisType = 'linear',
        yAxisType: legacyYAxisType = 'linear',
        xDomain: legacyXDomain,
        yDomain: legacyYDomain,
        defaultHighlightColor: legacyDefaultHighlightColor,
        defaultHighlightOpacity: legacyDefaultHighlightOpacity = 0.15,
        formatX: legacyFormatX,
        formatY: legacyFormatY,
        onHover: legacyOnHover,
        showTooltip: legacyShowTooltip = false,
        tooltipColor: legacyTooltipColor,
        className: legacyClassName = '',
    } = props;

    // Merge grouped props with legacy props (grouped props take precedence)
    const width = dimensions?.width ?? legacyWidth;
    const height = dimensions?.height ?? legacyHeight;
    const margin = dimensions?.margin ?? legacyMargin;
    const lineColor = styling?.lineColor ?? legacyLineColor;
    const strokeWidth = styling?.strokeWidth ?? legacyStrokeWidth;
    const className = styling?.className ?? legacyClassName;
    const defaultHighlightColor = styling?.defaultHighlightColor ?? legacyDefaultHighlightColor;
    const defaultHighlightOpacity = styling?.defaultHighlightOpacity ?? legacyDefaultHighlightOpacity;
    const showDots = interaction?.showDots ?? legacyShowDots;
    const dotRadius = interaction?.dotRadius ?? legacyDotRadius;
    const onHover = interaction?.onHover ?? legacyOnHover;
    const showTooltip = interaction?.showTooltip ?? legacyShowTooltip;
    const tooltipColor = interaction?.tooltipColor ?? legacyTooltipColor;
    const xAxisType = axes?.xAxisType ?? legacyXAxisType;
    const yAxisType = axes?.yAxisType ?? legacyYAxisType;
    const xAxisLabel = axes?.xAxisLabel ?? legacyXAxisLabel;
    const yAxisLabel = axes?.yAxisLabel ?? legacyYAxisLabel;
    const xDomain = axes?.xDomain ?? legacyXDomain;
    const yDomain = axes?.yDomain ?? legacyYDomain;
    const formatX = axes?.formatX ?? legacyFormatX;
    const formatY = axes?.formatY ?? legacyFormatY;
    const showXGrid = grid?.showXGrid ?? legacyShowXGrid;
    const showYGrid = grid?.showYGrid ?? legacyShowYGrid;
    const animate = animation?.animate ?? legacyAnimate;
    const animationDuration = animation?.animationDuration ?? legacyAnimationDuration;
    const loading = errorHandling?.loading ?? legacyLoading ?? false;
    const error = errorHandling?.error ?? legacyError;
    const fallback = errorHandling?.fallback;
    const onError = errorHandling?.onError;
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();
    
    // Use custom hook for responsive dimensions
    const { actualWidth, actualHeight, chartWidth, chartHeight } = useChartDimensions(
        containerRef,
        width,
        height,
        margin
    );
    
    // Use theme colors if not provided
    const defaultLineColor = lineColor || theme.palette.primary.main;
    const gridColor = theme.palette.divider;
    const textColor = theme.palette.text.secondary;
    const defaultHighlightColorValue = defaultHighlightColor || theme.palette.action.hover;

    // Use custom hook for tooltip state
    const { tooltipData, setTooltipData } = useTooltipState();
    
    // Track if initial animation has completed to prevent re-animation on hover
    const hasAnimatedRef = React.useRef(false);

    // Reset animation flag when data actually changes
    useEffect(() => {
        hasAnimatedRef.current = false;
    }, [data]);

    // Use custom hook for scale creation and memoization
    const { xScale, yScale } = useChartScales(data, chartWidth, chartHeight, {
        xAxisType,
        yAxisType,
        xDomain,
        yDomain
    });

    // Process highlight ranges using pure functions
    const processedXHighlights = useMemo(() => {
        return processXHighlightRanges(
            xScale, 
            xHighlightRanges, 
            xAxisType, 
            chartWidth, 
            defaultHighlightColorValue, 
            defaultHighlightOpacity
        );
    }, [xScale, xHighlightRanges, xAxisType, chartWidth, defaultHighlightColorValue, defaultHighlightOpacity]);

    const processedYHighlights = useMemo(() => {
        return processYHighlightRanges(
            yScale, 
            yHighlightRanges, 
            chartHeight, 
            defaultHighlightColorValue, 
            defaultHighlightOpacity
        );
    }, [yScale, yHighlightRanges, chartHeight, defaultHighlightColorValue, defaultHighlightOpacity]);

    // Line generator
    const line = useMemo(() => {
        if (!xScale || !yScale) return null;

        return d3.line<DataPoint>()
            .x(d => {
                let baseX: number;
                if (xAxisType === 'time') {
                    baseX = (xScale as d3.ScaleTime<number, number>)(new Date(d.x));
                } else if (xAxisType === 'band') {
                    baseX = ((xScale as d3.ScaleBand<string>)(String(d.x)) || 0) + (xScale as d3.ScaleBand<string>).bandwidth() / 2;
                } else {
                    baseX = (xScale as d3.ScaleLinear<number, number>)(Number(d.x));
                }
                return baseX;
            })
            .y(d => (yScale as d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number>)(d.y))
            .curve(d3.curveMonotoneX);
    }, [xScale, yScale, xAxisType]);

    // Handle grid visibility with backward compatibility
    const shouldShowXGrid = showXGrid !== undefined ? showXGrid : false;
    const shouldShowYGrid = showYGrid !== undefined ? showYGrid : false;

    // Memoized configuration objects for drawing functions
    const chartConfigs = useMemo(() => {
        // Return null if scales are not ready
        if (!xScale || !yScale) {
            return null;
        }

        const dimensions: ChartDimensions = {
            width: actualWidth,
            height: actualHeight,
            margin
        };

        const scales: ChartScales = {
            xScale,
            yScale
        };

        const gridConfig: GridConfig = {
            showXGrid: shouldShowXGrid,
            showYGrid: shouldShowYGrid,
            gridColor,
            xAxisType
        };

        const axisConfig: AxisConfig = {
            xAxisLabel,
            yAxisLabel,
            formatX,
            formatY,
            textColor,
            xAxisType
        };

        const lineConfig: LineConfig = {
            data,
            lineColor: defaultLineColor,
            strokeWidth,
            animate,
            animationDuration,
            hasAnimatedRef,
            xAxisType
        };

        const dotsConfig: DotsConfig = {
            data,
            showDots,
            dotRadius,
            dotColor: defaultLineColor,
            animate,
            animationDuration,
            hasAnimatedRef,
            xAxisType,
            onHover,
            showTooltip,
            setTooltipData
        };

        return {
            dimensions,
            scales,
            gridConfig,
            axisConfig,
            lineConfig,
            dotsConfig
        };
    }, [
        actualWidth,
        actualHeight,
        margin,
        xScale,
        yScale,
        shouldShowXGrid,
        shouldShowYGrid,
        gridColor,
        xAxisType,
        xAxisLabel,
        yAxisLabel,
        formatX,
        formatY,
        textColor,
        data,
        defaultLineColor,
        strokeWidth,
        animate,
        animationDuration,
        hasAnimatedRef,
        showDots,
        dotRadius,
        onHover,
        showTooltip,
        setTooltipData
    ]);

    useEffect(() => {
        if (!svgRef.current || !data || data.length === 0 || !xScale || !yScale || !line || !chartConfigs) {
            return;
        }

        const svg = d3.select(svgRef.current);
        
        // Clear previous chart
        svg.selectAll("*").remove();

        // Add mouseleave handler to SVG as backup to clear tooltip
        if (showTooltip) {
            svg.on("mouseleave", () => {
                setTooltipData(null);
                if (onHover) onHover(null);
            });
        }

        // Create main group with margins
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Use memoized configuration objects
        const { dimensions, scales, gridConfig, axisConfig, lineConfig, dotsConfig } = chartConfigs;

        // draw frames for the chart
        drawGridLines(g, scales, dimensions, gridConfig);
        drawHighlightRanges(g, processedXHighlights, processedYHighlights, chartWidth, chartHeight);
        drawXAxis(g, xScale, chartHeight, axisConfig);
        drawYAxis(g, yScale, axisConfig);
        drawAxisLabels(g, dimensions, axisConfig);
        styleAxisElements(svg, textColor);

		// plot data point
        drawLinePath(g, line, lineConfig);
        drawDots(g, scales, dotsConfig);
        if (showTooltip && !showDots) {
            drawHoverAreas(g, scales, data, xAxisType, onHover, setTooltipData);
        }
    }, [
        chartConfigs,
        line,
        processedXHighlights,
        processedYHighlights,
        chartWidth,
        chartHeight,
        xScale,
        yScale,
        data,
        xAxisType,
        onHover,
        setTooltipData,
        showTooltip,
        showDots,
        margin.left,
        margin.top,
        textColor
    ]);

    // Error boundary logic
    useEffect(() => {
        if (error && onError && typeof error !== 'string') {
            onError(error);
        }
    }, [error, onError]);

    // Error state rendering
    if (error) {
        if (fallback) {
            return React.createElement(fallback, { 
                error: typeof error === 'string' ? new Error(error) : error 
            });
        }
        
        return (
            <div 
                style={{
                    width: typeof width === 'string' ? width : width + 'px',
                    height: typeof height === 'string' ? height : height + 'px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    color: '#d32f2f',
                    fontSize: '14px',
                    padding: '20px'
                }}
                className={className}
            >
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                        Chart Error
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                        {typeof error === 'string' ? error : error.message || 'An unexpected error occurred'}
                    </div>
                </div>
            </div>
        );
    }

    // Loading state rendering
    if (loading) {
        return (
            <div 
                style={{
                    width: typeof width === 'string' ? width : width + 'px',
                    height: typeof height === 'string' ? height : height + 'px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    color: '#757575',
                    fontSize: '14px'
                }}
                className={className}
            >
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '8px' }}>Loading chart...</div>
                    <div 
                        style={{
                            width: '20px',
                            height: '20px',
                            border: '2px solid #e0e0e0',
                            borderTop: '2px solid #1976d2',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }}
                    />
                </div>
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Validate data using pure function
    const dataValidationError = validateChartData(data);
    if (dataValidationError) {
        const errorObj = new Error(`Chart data validation failed: ${dataValidationError}`);
        
        if (onError) {
            onError(errorObj);
        }
        
        if (fallback) {
            return React.createElement(fallback, { error: errorObj });
        }
        
        return (
            <div 
                style={{
                    width: typeof width === 'string' ? width : width + 'px',
                    height: typeof height === 'string' ? height : height + 'px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    color: '#d32f2f',
                    fontSize: '14px'
                }}
                className={className}
            >
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Invalid Data</div>
                    <div style={{ fontSize: '12px' }}>{dataValidationError}</div>
                </div>
            </div>
        );
    }

    // Determine container style based on width/height props
    const containerStyle: React.CSSProperties = {
        width: typeof width === 'string' ? width : undefined,
        height: typeof height === 'string' ? height : undefined,
        minHeight: typeof height === 'string' ? '200px' : undefined,
        minWidth: typeof width === 'string' ? '300px' : undefined,
    };

    return (
        <div 
            ref={containerRef}
            className={className}
            style={{ ...containerStyle, position: 'relative' }}
            onMouseLeave={() => {
                if (showTooltip) {
                    setTooltipData(null);
                }
                if (onHover) onHover(null);
            }}
        >
            <svg
                ref={svgRef}
                width={actualWidth}
                height={actualHeight}
                style={{ 
                    display: 'block',
                    overflow: 'visible',
                    width: '100%',
                    height: '100%'
                }}
            />
            <ChartTooltip 
                tooltipData={tooltipData}
                actualWidth={actualWidth}
                actualHeight={actualHeight}
                margin={margin}
                formatX={formatX}
                formatY={formatY}
                tooltipColor={tooltipColor}
                gridColor={gridColor}
            />
        </div>
    );
}

// Performance optimizations with React.memo and custom comparison
export default React.memo(LineChart, (prevProps, nextProps) => {
    // Fast reference checks for performance-critical props
    if (prevProps.data !== nextProps.data) return false;
    if (prevProps.width !== nextProps.width) return false;
    if (prevProps.height !== nextProps.height) return false;
    
    // Check grouped props objects
    if (prevProps.dimensions !== nextProps.dimensions) return false;
    if (prevProps.styling !== nextProps.styling) return false;
    if (prevProps.interaction !== nextProps.interaction) return false;
    if (prevProps.axes !== nextProps.axes) return false;
    if (prevProps.grid !== nextProps.grid) return false;
    if (prevProps.animation !== nextProps.animation) return false;
    
    // Check arrays
    if (prevProps.xHighlightRanges !== nextProps.xHighlightRanges) return false;
    if (prevProps.yHighlightRanges !== nextProps.yHighlightRanges) return false;
    
    // Legacy props for backward compatibility
    if (prevProps.margin !== nextProps.margin) return false;
    if (prevProps.lineColor !== nextProps.lineColor) return false;
    if (prevProps.strokeWidth !== nextProps.strokeWidth) return false;
    if (prevProps.showDots !== nextProps.showDots) return false;
    if (prevProps.dotRadius !== nextProps.dotRadius) return false;
    if (prevProps.showXGrid !== nextProps.showXGrid) return false;
    if (prevProps.showYGrid !== nextProps.showYGrid) return false;
    if (prevProps.animate !== nextProps.animate) return false;
    if (prevProps.animationDuration !== nextProps.animationDuration) return false;
    if (prevProps.xAxisType !== nextProps.xAxisType) return false;
    if (prevProps.yAxisType !== nextProps.yAxisType) return false;
    if (prevProps.xAxisLabel !== nextProps.xAxisLabel) return false;
    if (prevProps.yAxisLabel !== nextProps.yAxisLabel) return false;
    if (prevProps.className !== nextProps.className) return false;

    return true; // Props are equal, skip re-render
});
