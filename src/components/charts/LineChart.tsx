'use client';

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import * as d3 from 'd3';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
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
    createClipPath,
    type DataPoint,
    type HighlightRange,
    type ChartDimensions,
    type ChartScales,
    type GridConfig,
    type AxisConfig,
    type LineConfig,
    type DotsConfig
} from '../../lib/utils';
import { type XAxisType, type YAxisType } from '../../lib/utils/chartScales';
import ChartTooltip from './ChartTooltip';
import { useChartDimensions } from '../../lib/hooks/useChartDimensions';
import { useChartScales } from '../../lib/hooks/useChartScales';
import { useTooltipState } from '../../lib/hooks/useTooltipState';
import { useAnimatedDomain } from '../../lib/hooks/useAnimatedDomain';
import { processXHighlightRanges, processYHighlightRanges, validateChartData } from '../../lib/utils/chartCalculations';
import { lineChartStyles } from '../../styles/components/charts';

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
    defaultHighlightColor?: string;
    defaultHighlightOpacity?: number;
}

export interface ChartInteractionConfig {
    showDots?: boolean;
    dotRadius?: number;
    onHover?: (data: DataPoint | null) => void;
    showTooltip?: boolean;
    tooltipColor?: string;
    enablePanning?: boolean;
    onPan?: (newDomain: [Date, Date]) => void;
    onDataNeeded?: (direction: 'before' | 'after', currentRange: [Date, Date], dataRange: [Date, Date]) => void;
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
    xTickCount?: number;
    yTickCount?: number;
	tooltipFormatX?: (value: unknown) => string;
    tooltipFormatY?: (value: number) => string;
}

export interface ChartGridConfig {
    showXGrid?: boolean;
    showYGrid?: boolean;
}

export interface ChartAnimationConfig {
    animate?: boolean;
    animationDuration?: number;
    animateOnDataChange?: boolean;
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
    className?: string;
}

const DEFAULT_MARGIN: NonNullable<ChartDimensionsConfig['margin']> = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

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
        className: providedClassName = ''
    } = props;

    const width = dimensions?.width ?? 800;
    const height = dimensions?.height ?? 400;
    const margin = dimensions?.margin ?? DEFAULT_MARGIN;

    const lineColor = styling?.lineColor;
    const strokeWidth = styling?.strokeWidth ?? 2;
    const defaultHighlightColor = styling?.defaultHighlightColor;
    const defaultHighlightOpacity = styling?.defaultHighlightOpacity ?? 0.15;

    const className = providedClassName;

    const showDots = interaction?.showDots ?? false;
    const dotRadius = interaction?.dotRadius ?? 4;
    const onHover = interaction?.onHover;
    const showTooltip = interaction?.showTooltip ?? false;
    const tooltipColor = interaction?.tooltipColor;
    const enablePanning = interaction?.enablePanning ?? false;
    const onPan = interaction?.onPan;
    const onDataNeeded = interaction?.onDataNeeded;

    const xAxisType = axes?.xAxisType ?? 'linear';
    const yAxisType = axes?.yAxisType ?? 'linear';
    const xAxisLabel = axes?.xAxisLabel;
    const yAxisLabel = axes?.yAxisLabel;
    const xDomain = axes?.xDomain;
    const yDomain = axes?.yDomain;
    const formatX = axes?.formatX;
    const formatY = axes?.formatY;
	const tooltipFormatX = axes?.tooltipFormatX;
    const tooltipFormatY = axes?.tooltipFormatY;
    const xTickCount = axes?.xTickCount ?? 6;
    const yTickCount = axes?.yTickCount ?? 5;

    const showXGrid = grid?.showXGrid ?? false;
    const showYGrid = grid?.showYGrid ?? false;

    const animate = animation?.animate ?? true;
    const animationDuration = animation?.animationDuration ?? 1000;
    const animateOnDataChange = animation?.animateOnDataChange ?? true;

    const loading = errorHandling?.loading ?? false;
    const error = errorHandling?.error ?? null;
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

    // Panning state management
    const [isPanning, setIsPanning] = useState(false);
    const [panStartX, setPanStartX] = useState<number>(0);
    const [currentXDomain, setCurrentXDomain] = useState<[Date, Date] | null>(null);

    // Use custom hook for tooltip state
    const { tooltipData, setTooltipData } = useTooltipState();
    
    // Track if initial animation has completed to prevent re-animation on hover
    const hasAnimatedRef = React.useRef(false);
    const prevDataRef = useRef<DataPoint[] | null>(null);
    const [shouldAnimateTransitions, setShouldAnimateTransitions] = useState<boolean>(() => animate);

    // Reset animation flag when data actually changes
    useEffect(() => {
        const prevData = prevDataRef.current;
        prevDataRef.current = data;

        if (!animate) {
            if (shouldAnimateTransitions) {
                setShouldAnimateTransitions(false);
            }
            return;
        }

        const shouldAnimateNow = !prevData || animateOnDataChange;

        if (shouldAnimateNow) {
            hasAnimatedRef.current = false;
        }

        if (shouldAnimateTransitions !== shouldAnimateNow) {
            setShouldAnimateTransitions(shouldAnimateNow);
        }
    }, [data, animate, animateOnDataChange, shouldAnimateTransitions]);

    const effectiveAnimate = animate && shouldAnimateTransitions;

    // Calculate effective x-domain (original or panned)
    const effectiveXDomain = currentXDomain || xDomain;
    
    const visibleData = useMemo(() => {
        if (!data || data.length === 0) {
            return [] as DataPoint[];
        }

        if (xAxisType === 'time' && effectiveXDomain) {
            const [start, end] = effectiveXDomain as [Date, Date];
            return data.filter(point => {
                const value = point.x instanceof Date ? point.x : new Date(point.x as string | number | Date);
                return value >= start && value <= end;
            });
        }

        return data;
    }, [data, effectiveXDomain, xAxisType]);

    const computeAutoYDomain = useCallback((points: DataPoint[]): [number, number] | null => {
        if (!points || points.length === 0) {
            return null;
        }

        const extent = d3.extent(points, p => p.y) as [number | undefined, number | undefined];
        const minY = extent[0];
        const maxY = extent[1];

        if (minY === undefined || maxY === undefined || !Number.isFinite(minY) || !Number.isFinite(maxY)) {
            return null;
        }

        let lower = minY;
        let upper = maxY;

        if (lower === upper) {
            const paddingBase = Math.abs(lower) || 1;
            const padding = paddingBase * 0.1;
            lower -= padding;
            upper += padding;
        } else {
            const padding = (upper - lower) * 0.1;
            lower -= padding;
            upper += padding;
        }

        if (lower >= 0 && upper >= 0) {
            lower = Math.max(0, lower);
        }

        const niceScale = d3.scaleLinear().domain([lower, upper]).nice();
        const niceDomain = niceScale.domain() as [number, number];
        return niceDomain;
    }, []);

    const autoCalculatedYDomain = useMemo(() => {
        if (yDomain) {
            return null;
        }

        return computeAutoYDomain(visibleData);
    }, [computeAutoYDomain, visibleData, yDomain]);

    const targetYDomain = yDomain ?? autoCalculatedYDomain;

    const [animatedYDomain] = useAnimatedDomain(targetYDomain, {
        duration: effectiveAnimate ? (isPanning ? 0 : animationDuration) : 0,
        enabled: effectiveAnimate
    });

    const resolvedYDomain = animatedYDomain ?? targetYDomain ?? undefined;

    // Use custom hook for scale creation and memoization
    const { xScale, yScale } = useChartScales(data, chartWidth, chartHeight, {
        xAxisType,
        yAxisType,
        xDomain: effectiveXDomain,
        yDomain: resolvedYDomain
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

    // Y-axis control functions (defined after scales are available)
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
            xAxisType,
            xTickCount,
            yTickCount
        };

        const lineConfig: LineConfig = {
            data,
            lineColor: defaultLineColor,
            strokeWidth,
            animate: effectiveAnimate,
            animationDuration,
            hasAnimatedRef,
            xAxisType
        };

        const dotsConfig: DotsConfig = {
            data,
            showDots,
            dotRadius,
            dotColor: defaultLineColor,
            animate: effectiveAnimate,
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
        effectiveAnimate,
        animationDuration,
        hasAnimatedRef,
        showDots,
        dotRadius,
        onHover,
        showTooltip,
        setTooltipData,
        xTickCount,
        yTickCount
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

        // Create clipping path for panning (masks content outside chart area)
        const clipPathUrl = createClipPath(svg, {
            width: actualWidth,
            height: actualHeight,
            margin
        });

        // Use memoized configuration objects
        const { dimensions, scales, gridConfig, axisConfig, lineConfig, dotsConfig } = chartConfigs;

        // draw frames for the chart
        drawGridLines(g, scales, dimensions, gridConfig);
        drawHighlightRanges(g, processedXHighlights, processedYHighlights, chartWidth, chartHeight, clipPathUrl);
        drawXAxis(g, xScale, chartHeight, axisConfig);
        drawYAxis(g, yScale, axisConfig);
        drawAxisLabels(g, dimensions, axisConfig);
        styleAxisElements(svg, textColor);

		// plot data point with clipping
        drawLinePath(g, line, lineConfig, clipPathUrl);
        drawDots(g, scales, dotsConfig, clipPathUrl);
        if (showTooltip && !showDots) {
            drawHoverAreas(g, scales, data, xAxisType, onHover, setTooltipData);
        }

        // Add panning functionality if enabled
        if (enablePanning && xAxisType === 'time' && xScale) {
            const timeScale = xScale as d3.ScaleTime<number, number>;
            
            const handleMouseDown = (event: MouseEvent) => {
                event.preventDefault();
                setIsPanning(true);
                setPanStartX(event.clientX);
                svg.style("cursor", "grabbing");
            };

            const handleMouseMove = (event: MouseEvent) => {
                if (!isPanning) return;
                
                const deltaX = event.clientX - panStartX;
                const scaleRange = timeScale.range();
                const scaleDomain = timeScale.domain();
                
                // Calculate the time difference based on pixel movement
                const pixelToTime = (scaleRange[1] - scaleRange[0]) / (scaleDomain[1].getTime() - scaleDomain[0].getTime());
                const timeDelta = deltaX / pixelToTime;
                
                // Create new domain by shifting both start and end
                const newStart = new Date(scaleDomain[0].getTime() - timeDelta);
                const newEnd = new Date(scaleDomain[1].getTime() - timeDelta);
                
                setCurrentXDomain([newStart, newEnd]);
                setPanStartX(event.clientX);
            };

            const handleMouseUp = () => {
                if (isPanning) {
                    setIsPanning(false);
                    svg.style("cursor", "grab");
                    
                    // Call onPan callback if provided
                    if (onPan && currentXDomain) {
                        onPan(currentXDomain);
                    }
                    
                    // Check if we need additional data
                    if (onDataNeeded && currentXDomain && xAxisType === 'time') {
                        const dataRange = d3.extent(data, d => d.x as Date) as [Date, Date];
                        if (dataRange[0] && dataRange[1]) {
                            const [currentStart, currentEnd] = currentXDomain;
                            
                            // Check if we've panned beyond the beginning of the data
                            if (currentStart < dataRange[0]) {
                                onDataNeeded('before', currentXDomain, dataRange);
                            }
                            
                            // Check if we've panned beyond the end of the data  
                            if (currentEnd > dataRange[1]) {
                                onDataNeeded('after', currentXDomain, dataRange);
                            }
                        }
                    }

                }
            };

            // Add event listeners to SVG
            svg
                .style("cursor", "grab")
                .on("mousedown", handleMouseDown);

            // Add document listeners for mouse move and up (to handle dragging outside SVG)
            d3.select(document)
                .on("mousemove.pan", handleMouseMove)
                .on("mouseup.pan", handleMouseUp);
        }
    }, [
        chartConfigs,
        line,
        processedXHighlights,
        processedYHighlights,
		chartWidth,
		chartHeight,
		actualWidth,
		actualHeight,
        xScale,
        yScale,
        data,
        xAxisType,
        onHover,
        setTooltipData,
        showTooltip,
        showDots,
    	margin,
        textColor,
        enablePanning,
        isPanning,
        panStartX,
        currentXDomain,
        onPan,
        onDataNeeded
    ]);

    // Cleanup panning event listeners
    useEffect(() => {
        return () => {
            // Cleanup document event listeners
            d3.select(document)
                .on("mousemove.pan", null)
                .on("mouseup.pan", null);
        };
    }, []);

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
            <Box
                className={className}
                sx={{
                    ...lineChartStyles.stateRoot(theme, width, height),
                    ...lineChartStyles.stateError(theme)
                }}
            >
                <Typography variant="subtitle2" sx={lineChartStyles.stateTitle(theme)}>
                    Chart Error
                </Typography>
                <Typography variant="caption" sx={lineChartStyles.stateMessage(theme)}>
                    {typeof error === 'string' ? error : error.message || 'An unexpected error occurred'}
                </Typography>
            </Box>
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
            <Box
                className={className}
                sx={{
                    ...lineChartStyles.stateRoot(theme, width, height),
                    ...lineChartStyles.stateError(theme)
                }}
            >
                <Typography variant="subtitle2" sx={lineChartStyles.stateTitle(theme)}>
                    Invalid Data
                </Typography>
                <Typography variant="caption" sx={lineChartStyles.stateMessage(theme)}>
                    {dataValidationError}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            ref={containerRef}
            className={className}
            sx={lineChartStyles.container(width, height)}
            onMouseLeave={() => {
                if (showTooltip) {
                    setTooltipData(null);
                }
                if (onHover) onHover(null);
            }}
			onMouseDown={() => {
				if (showTooltip) {
					setTooltipData(null);
				}
				if (onHover) onHover(null);
			}}
        >
            <Box
                component="svg"
                ref={svgRef}
                width={actualWidth}
                height={actualHeight}
                sx={lineChartStyles.svg()}
            />
            <ChartTooltip 
                tooltipData={tooltipData}
                actualWidth={actualWidth}
                actualHeight={actualHeight}
                margin={margin}
                formatX={tooltipFormatX ?? formatX}
                formatY={tooltipFormatY ?? formatY}
                tooltipColor={tooltipColor}
                gridColor={gridColor}
            />
            {loading && (
                <Box sx={lineChartStyles.overlay(theme)}>
                    <CircularProgress size={28} thickness={4} />
                    <Typography variant="caption" sx={lineChartStyles.overlayLabel(theme)}>
                        Loading data…
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

// Performance optimizations with React.memo and custom comparison
export default React.memo(LineChart, (prevProps, nextProps) => {
    // Fast reference checks for performance-critical props
    if (prevProps.data !== nextProps.data) return false;
    if (prevProps.className !== nextProps.className) return false;
    
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

    return true; // Props are equal, skip re-render
});
