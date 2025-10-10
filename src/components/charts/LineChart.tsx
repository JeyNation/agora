'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { useTheme } from '@mui/material/styles';

export interface DataPoint {
    x: number | string | Date;
    y: number;
    [key: string]: unknown; // Allow additional properties
}

export interface HighlightRange {
    start: number | Date | string;
    end: number | Date | string;
    color?: string;
    opacity?: number;
}

export interface LineChartProps {
    data: DataPoint[];
    width?: number | string;
    height?: number | string;
    margin?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
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
    xAxisType?: 'linear' | 'time' | 'band';
    yAxisType?: 'linear' | 'log';
    xDomain?: [number | Date | string, number | Date | string];
    yDomain?: [number, number];
    xHighlightRanges?: HighlightRange[];
    yHighlightRanges?: HighlightRange[];
    defaultHighlightColor?: string;
    defaultHighlightOpacity?: number;
    formatX?: (value: unknown) => string;
    formatY?: (value: number) => string;
    onHover?: (data: DataPoint | null) => void;
    showTooltip?: boolean;
    tooltipColor?: string;
    className?: string;
}

export default function LineChart({
    data,
    width = 800,
    height = 400,
    margin = { top: 20, right: 20, bottom: 30, left: 60 },
    xAxisLabel,
    yAxisLabel,
    lineColor,
    strokeWidth = 2,
    showDots = false,
    dotRadius = 4,
    showXGrid,
    showYGrid,
    animate = true,
    animationDuration = 1000,
    xAxisType = 'linear',
    yAxisType = 'linear',
    xDomain,
    yDomain,
    xHighlightRanges = [],
    yHighlightRanges = [],
    defaultHighlightColor,
    defaultHighlightOpacity = 0.15,
    formatX,
    formatY,
    onHover,
    showTooltip = false,
    tooltipColor,
    className = '',
}: LineChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const [dimensions, setDimensions] = React.useState({ width: 800, height: 400 });
    
    // Use theme colors if not provided
    const defaultLineColor = lineColor || theme.palette.primary.main;
    const gridColor = theme.palette.divider;
    const textColor = theme.palette.text.secondary;
    const defaultHighlightColorValue = defaultHighlightColor || theme.palette.action.hover;
    const defaultTooltipColor = tooltipColor || theme.palette.background.paper;

    // State for tooltip only (to minimize re-renders)
    const [tooltipData, setTooltipData] = React.useState<{ data: DataPoint; position: { x: number; y: number } } | null>(null);
    
    // Track if initial animation has completed to prevent re-animation on hover
    const hasAnimatedRef = React.useRef(false);
    
    // Reset animation flag when data actually changes
    React.useEffect(() => {
        hasAnimatedRef.current = false;
    }, [data]);

    // Handle grid visibility with backward compatibility
    const shouldShowXGrid = showXGrid !== undefined ? showXGrid : false;
    const shouldShowYGrid = showYGrid !== undefined ? showYGrid : false;

    // Handle responsive dimensions
    const actualWidth = typeof width === 'string' ? dimensions.width : (width as number);
    const actualHeight = typeof height === 'string' ? dimensions.height : (height as number);

    // Calculate chart dimensions
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
    }, []);

    // Memoize scales to prevent unnecessary recalculations
    const { xScale, yScale } = useMemo(() => {
        // Always create scales, even if data is empty (when custom domains are provided)
        if ((!data || data.length === 0) && !xDomain && !yDomain) {
            return { xScale: null, yScale: null };
        }

        let xScale: d3.ScaleLinear<number, number> | d3.ScaleTime<number, number> | d3.ScaleBand<string>;
        
        // Create X scale based on type
        if (xAxisType === 'time') {
            let domain: [Date, Date];
            if (xDomain) {
                domain = [new Date(xDomain[0]), new Date(xDomain[1])];
            } else if (data && data.length > 0) {
                domain = d3.extent(data, d => new Date(d.x)) as [Date, Date];
            } else {
                domain = [new Date(), new Date()]; // Default fallback
            }
            
            xScale = d3.scaleTime()
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
            
            xScale = d3.scaleBand()
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
            
            xScale = d3.scaleLinear()
                .domain(domain)
                .range([0, chartWidth]);
        }

        // Create Y scale
        let yScale: d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number>;
        
        let yDomainValues: [number, number];
        if (yDomain) {
            yDomainValues = yDomain;
        } else if (data && data.length > 0) {
            yDomainValues = d3.extent(data, d => d.y) as [number, number];
        } else {
            yDomainValues = [0, 1]; // Default fallback
        }
        
        if (yAxisType === 'log') {
            yScale = d3.scaleLog()
                .domain(yDomainValues)
                .range([chartHeight, 0]);
        } else {
            yScale = d3.scaleLinear()
                .domain(yDomainValues)
                .range([chartHeight, 0]);
            
            // Only apply nice() if no custom domain is provided
            if (!yDomain) {
                yScale.nice();
            }
        }

        return { xScale, yScale };
    }, [data, chartWidth, chartHeight, xAxisType, yAxisType, xDomain, yDomain]);

    // Process X highlight ranges
    const processedXHighlights = useMemo(() => {
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
                color: range.color || defaultHighlightColorValue,
                opacity: range.opacity || defaultHighlightOpacity
            };
        });
    }, [xScale, xHighlightRanges, xAxisType, chartWidth, defaultHighlightColorValue, defaultHighlightOpacity]);

    // Process Y highlight ranges
    const processedYHighlights = useMemo(() => {
        if (!yScale || !yHighlightRanges || yHighlightRanges.length === 0) return [];
        
        return yHighlightRanges.map(range => {
            const scale = yScale as d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number>;
            const startPos = scale(Number(range.start));
            const endPos = scale(Number(range.end));
            
            return {
                y: Math.max(0, Math.min(startPos, endPos)),
                height: Math.min(chartHeight, Math.abs(startPos - endPos)),
                color: range.color || defaultHighlightColorValue,
                opacity: range.opacity || defaultHighlightOpacity
            };
        });
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

    useEffect(() => {
        if (!svgRef.current || !data || data.length === 0 || !xScale || !yScale || !line) {
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

        // Add grid lines if enabled
        // X grid lines (horizontal lines)
        if (shouldShowXGrid) {
            g.selectAll(".grid-x")
                .data(yScale.ticks())
                .enter()
                .append("line")
                .attr("class", "grid-x")
                .attr("x1", 0)
                .attr("x2", chartWidth)
                .attr("y1", d => (yScale as d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number>)(d))
                .attr("y2", d => (yScale as d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number>)(d))
                .style("stroke", gridColor)
                .style("stroke-width", 1)
                .style("opacity", 0.3);
        }

        // Y grid lines (vertical lines)
        if (shouldShowYGrid && xAxisType !== 'band') {
            if (xAxisType === 'time') {
                const timeScale = xScale as d3.ScaleTime<number, number>;
                g.selectAll(".grid-y")
                    .data(timeScale.ticks())
                    .enter()
                    .append("line")
                    .attr("class", "grid-y")
                    .attr("x1", d => timeScale(d))
                    .attr("x2", d => timeScale(d))
                    .attr("y1", 0)
                    .attr("y2", chartHeight)
                    .style("stroke", gridColor)
                    .style("stroke-width", 1)
                    .style("opacity", 0.3);
            } else {
                const linearScale = xScale as d3.ScaleLinear<number, number>;
                g.selectAll(".grid-y")
                    .data(linearScale.ticks())
                    .enter()
                    .append("line")
                    .attr("class", "grid-y")
                    .attr("x1", d => linearScale(d))
                    .attr("x2", d => linearScale(d))
                    .attr("y1", 0)
                    .attr("y2", chartHeight)
                    .style("stroke", gridColor)
                    .style("stroke-width", 1)
                    .style("opacity", 0.3);
            }
        }

        // Add X-axis highlight ranges
        if (processedXHighlights.length > 0) {
            g.selectAll(".x-highlight")
                .data(processedXHighlights)
                .enter()
                .append("rect")
                .attr("class", "x-highlight")
                .attr("x", d => d.x)
                .attr("y", 0)
                .attr("width", d => d.width)
                .attr("height", chartHeight)
                .style("fill", d => d.color)
                .style("opacity", d => d.opacity)
                .style("pointer-events", "none");
        }

        // Add Y-axis highlight ranges
        if (processedYHighlights.length > 0) {
            g.selectAll(".y-highlight")
                .data(processedYHighlights)
                .enter()
                .append("rect")
                .attr("class", "y-highlight")
                .attr("x", 0)
                .attr("y", d => d.y)
                .attr("width", chartWidth)
                .attr("height", d => d.height)
                .style("fill", d => d.color)
                .style("opacity", d => d.opacity)
                .style("pointer-events", "none");
        }

        // Add the line path
        const path = g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", defaultLineColor)
            .attr("stroke-width", strokeWidth)
            .attr("d", line);

        // Animate the line drawing if enabled (only on first render)
        if (animate && !hasAnimatedRef.current) {
            const totalLength = path.node()?.getTotalLength() || 0;
            path
                .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(animationDuration)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0)
                .on("end", () => {
                    hasAnimatedRef.current = true;
                });
        }

        // Add dots if enabled
        if (showDots) {
            const dots = g.selectAll(".dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("cx", d => {
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
                .attr("cy", d => (yScale as d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number>)(d.y))
                .attr("r", 0)
                .style("fill", defaultLineColor);

            if (animate && !hasAnimatedRef.current) {
                dots.transition()
                    .delay((d, i) => (i / data.length) * animationDuration)
                    .duration(200)
                    .attr("r", dotRadius);
            } else {
                dots.attr("r", dotRadius);
            }

            // Add hover effects for dots
            if (onHover || showTooltip) {
                dots
                    .on("mouseenter", (event, d) => {
                        // Call onHover callback if provided
                        if (onHover) onHover(d);
                        
                        // Show tooltip if enabled
                        if (showTooltip) {
                            const xPos = parseFloat(d3.select(event.currentTarget).attr("cx"));
                            const yPos = parseFloat(d3.select(event.currentTarget).attr("cy"));
                            setTooltipData({ 
                                data: d, 
                                position: { x: xPos, y: yPos } 
                            });
                        }
                    })
                    .on("mouseleave", () => {
                        // Clear onHover callback
                        if (onHover) onHover(null);
                        
                        // Clear tooltip
                        if (showTooltip) {
                            setTooltipData(null);
                        }
                    })
                    .style("cursor", "pointer");
            }
        }

        // Add invisible hover areas for tooltips (when dots are not shown)
        if (showTooltip && !showDots) {
            const hoverAreas = g.selectAll(".hover-area")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "hover-area")
                .attr("cx", d => {
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
                .attr("cy", d => (yScale as d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number>)(d.y))
                .attr("r", 8) // Larger hover area than visible dots
                .style("fill", "transparent")
                .style("cursor", "pointer")
                .on("mouseenter", (event, d) => {
                    // Call onHover callback if provided
                    if (onHover) onHover(d);
                    
                    // Show tooltip
                    const xPos = parseFloat(d3.select(event.currentTarget).attr("cx"));
                    const yPos = parseFloat(d3.select(event.currentTarget).attr("cy"));
                    setTooltipData({ 
                        data: d, 
                        position: { x: xPos, y: yPos } 
                    });
                })
                .on("mouseleave", () => {
                    // Clear onHover callback
                    if (onHover) onHover(null);
                    
                    // Clear tooltip
                    setTooltipData(null);
                });
        }

        // Create X axis
        const xAxis = d3.axisBottom(xScale as d3.AxisScale<d3.AxisDomain>);
        
        // For band scales, we need to adjust tick positioning to center them
        if (xAxisType === 'band') {
            const bandScale = xScale as d3.ScaleBand<string>;
            xAxis
                .tickSizeOuter(0)
                .tickFormat((d: d3.AxisDomain) => {
                    if (formatX) {
                        return formatX(d);
                    }
                    return String(d);
                });
        } else if (formatX) {
            xAxis.tickFormat(formatX);
        } else if (xAxisType === 'time') {
            xAxis.tickFormat((d: d3.AxisDomain) => d3.timeFormat("%m/%d")(d as Date));
        }

        const xAxisGroup = g.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${chartHeight})`)
            .call(xAxis);

        // For band scales, manually position the ticks at band centers
        if (xAxisType === 'band') {
            const bandScale = xScale as d3.ScaleBand<string>;
            xAxisGroup.selectAll(".tick")
                .attr("transform", (d: unknown) => {
                    const bandStart = bandScale(String(d)) || 0;
                    const bandCenter = bandStart + bandScale.bandwidth() / 2;
                    return `translate(${bandCenter}, 0)`;
                });
        }

        xAxisGroup.selectAll("text")
            .style("fill", textColor);

        // Create Y axis
        const yAxis = d3.axisLeft(yScale as d3.AxisScale<d3.AxisDomain>);
        if (formatY) {
            yAxis.tickFormat((d: d3.AxisDomain) => formatY(Number(d)));
        }

        g.append("g")
            .attr("class", "y-axis")
            .call(yAxis)
            .selectAll("text")
            .style("fill", textColor);

        // Add axis labels
        if (xAxisLabel) {
            g.append("text")
                .attr("class", "x-label")
                .attr("text-anchor", "middle")
                .attr("x", chartWidth / 2)
                .attr("y", chartHeight + margin.bottom - 10)
                .style("fill", textColor)
                .style("font-size", "12px")
                .text(xAxisLabel);
        }

        if (yAxisLabel) {
            g.append("text")
                .attr("class", "y-label")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -chartHeight / 2)
                .attr("y", -margin.left + 20)
                .style("fill", textColor)
                .style("font-size", "12px")
                .text(yAxisLabel);
        }





        // Style axis lines
        svg.selectAll(".domain")
            .style("stroke", textColor);
        
        svg.selectAll(".tick line")
            .style("stroke", textColor);

    }, [
        data, 
        actualWidth, 
        actualHeight, 
        margin, 
        xScale, 
        yScale, 
        line, 
        defaultLineColor, 
        strokeWidth, 
        showDots, 
        dotRadius, 
        shouldShowXGrid,
        shouldShowYGrid, 
        animate, 
        animationDuration, 
        xAxisLabel, 
        yAxisLabel, 
        formatX, 
        formatY, 
        onHover, 
        gridColor, 
        textColor,
        chartWidth,
        chartHeight,
        xAxisType,
        processedXHighlights,
        processedYHighlights,
        showTooltip
    ]);

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
{showTooltip && tooltipData && (() => {
                // Get actual tooltip dimensions if available, otherwise use estimates
                const tooltipElement = tooltipRef.current;
                const tooltipWidth = tooltipElement?.offsetWidth || 120;
                const tooltipHeight = tooltipElement?.offsetHeight || 60;
                const padding = 10;
                
                // Get the data point position relative to the chart area
                const dataPointX = tooltipData.position.x;
                const dataPointY = tooltipData.position.y;
                
                // Calculate chart boundaries (excluding margins)
                const chartLeft = margin.left;
                const chartRight = actualWidth - margin.right;
                const chartTop = margin.top;
                const chartBottom = actualHeight - margin.bottom;
                
                const arrowSize = 8;
                const dataPointScreenX = dataPointX + margin.left;
                const dataPointScreenY = dataPointY + margin.top;
                
                // Calculate available space in each direction
                const spaceAbove = dataPointScreenY - chartTop - padding;
                const spaceBelow = chartBottom - dataPointScreenY - padding;
                const spaceLeft = dataPointScreenX - chartLeft - padding;
                const spaceRight = chartRight - dataPointScreenX - padding;
                
                // Determine optimal tooltip position (8 possible positions)
                let tooltipLeft: number;
                let tooltipTop: number;
                let tooltipPosition: string;
                let showArrow: boolean = true;
                let arrowLeft: string = '';
                let arrowTop: string = '';
                
                // Helper function to check if position fits
                const fitsVertically = (space: number) => space >= tooltipHeight + arrowSize + 4;
                const fitsHorizontally = (space: number) => space >= tooltipWidth + arrowSize + 4;
                
                // Primary positions (with arrows) - Priority order: top, bottom, right, left
                if (fitsVertically(spaceAbove) && spaceLeft >= tooltipWidth / 2 && spaceRight >= tooltipWidth / 2) {
                    // TOP - centered above data point
                    tooltipPosition = 'top';
                    tooltipTop = dataPointScreenY - tooltipHeight - arrowSize - 2;
                    tooltipLeft = dataPointScreenX - tooltipWidth / 2;
                    arrowLeft = '50%';
                    
                } else if (fitsVertically(spaceBelow) && spaceLeft >= tooltipWidth / 2 && spaceRight >= tooltipWidth / 2) {
                    // BOTTOM - centered below data point
                    tooltipPosition = 'bottom';
                    tooltipTop = dataPointScreenY + arrowSize + 2;
                    tooltipLeft = dataPointScreenX - tooltipWidth / 2;
                    arrowLeft = '50%';
                    
                } else if (fitsHorizontally(spaceRight) && spaceAbove >= tooltipHeight / 2 && spaceBelow >= tooltipHeight / 2) {
                    // RIGHT - centered right of data point
                    tooltipPosition = 'right';
                    tooltipLeft = dataPointScreenX + arrowSize + 2;
                    tooltipTop = dataPointScreenY - tooltipHeight / 2;
                    arrowTop = '50%';
                    
                } else if (fitsHorizontally(spaceLeft) && spaceAbove >= tooltipHeight / 2 && spaceBelow >= tooltipHeight / 2) {
                    // LEFT - centered left of data point
                    tooltipPosition = 'left';
                    tooltipLeft = dataPointScreenX - tooltipWidth - arrowSize - 2;
                    tooltipTop = dataPointScreenY - tooltipHeight / 2;
                    arrowTop = '50%';
                    
                } else {
                    // Secondary positions (corner positions without arrows)
                    showArrow = false;
                    
                    if (fitsVertically(spaceAbove) && spaceRight >= tooltipWidth) {
                        // TOP-LEFT (tooltip above-left, no arrow)
                        tooltipPosition = 'top-left';
                        tooltipTop = dataPointScreenY - tooltipHeight - padding;
                        tooltipLeft = dataPointScreenX + padding;
                        
                    } else if (fitsVertically(spaceAbove) && spaceLeft >= tooltipWidth) {
                        // TOP-RIGHT (tooltip above-right, no arrow)
                        tooltipPosition = 'top-right';
                        tooltipTop = dataPointScreenY - tooltipHeight - padding;
                        tooltipLeft = dataPointScreenX - tooltipWidth - padding;
                        
                    } else if (fitsVertically(spaceBelow) && spaceRight >= tooltipWidth) {
                        // BOTTOM-LEFT (tooltip below-left, no arrow)
                        tooltipPosition = 'bottom-left';
                        tooltipTop = dataPointScreenY + padding;
                        tooltipLeft = dataPointScreenX + padding;
                        
                    } else if (fitsVertically(spaceBelow) && spaceLeft >= tooltipWidth) {
                        // BOTTOM-RIGHT (tooltip below-right, no arrow)
                        tooltipPosition = 'bottom-right';
                        tooltipTop = dataPointScreenY + padding;
                        tooltipLeft = dataPointScreenX - tooltipWidth - padding;
                        
                    } else {
                        // Fallback: position with most available space (no arrow)
                        const maxSpace = Math.max(spaceAbove, spaceBelow, spaceLeft, spaceRight);
                        
                        if (maxSpace === spaceAbove) {
                            tooltipPosition = 'top-fallback';
                            tooltipTop = chartTop + padding;
                            tooltipLeft = Math.max(chartLeft + padding, Math.min(dataPointScreenX - tooltipWidth / 2, chartRight - tooltipWidth - padding));
                        } else if (maxSpace === spaceBelow) {
                            tooltipPosition = 'bottom-fallback';
                            tooltipTop = chartBottom - tooltipHeight - padding;
                            tooltipLeft = Math.max(chartLeft + padding, Math.min(dataPointScreenX - tooltipWidth / 2, chartRight - tooltipWidth - padding));
                        } else if (maxSpace === spaceRight) {
                            tooltipPosition = 'right-fallback';
                            tooltipLeft = chartRight - tooltipWidth - padding;
                            tooltipTop = Math.max(chartTop + padding, Math.min(dataPointScreenY - tooltipHeight / 2, chartBottom - tooltipHeight - padding));
                        } else {
                            tooltipPosition = 'left-fallback';
                            tooltipLeft = chartLeft + padding;
                            tooltipTop = Math.max(chartTop + padding, Math.min(dataPointScreenY - tooltipHeight / 2, chartBottom - tooltipHeight - padding));
                        }
                    }
                }
                
                // Ensure tooltip stays within chart bounds
                tooltipLeft = Math.max(chartLeft + padding, Math.min(tooltipLeft, chartRight - tooltipWidth - padding));
                tooltipTop = Math.max(chartTop + padding, Math.min(tooltipTop, chartBottom - tooltipHeight - padding));
                
                return (
                    <div
                        ref={tooltipRef}
                        style={{
                            position: 'absolute',
                            left: tooltipLeft,
                            top: tooltipTop,
                            backgroundColor: defaultTooltipColor,
                            border: `1px solid ${gridColor}`,
                            borderRadius: '8px',
                            padding: '10px 12px',
                            fontSize: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            pointerEvents: 'none',
                            zIndex: 1000,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {/* Arrow */}
                        {showArrow && tooltipPosition === 'top' && (
                            <>
                                {/* Arrow border */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: arrowLeft,
                                        bottom: '-9px',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 0,
                                        borderLeft: `${arrowSize + 1}px solid transparent`,
                                        borderRight: `${arrowSize + 1}px solid transparent`,
                                        borderTop: `${arrowSize + 1}px solid ${gridColor}`,
                                    }}
                                />
                                {/* Arrow fill */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: arrowLeft,
                                        bottom: '-8px',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 0,
                                        borderLeft: `${arrowSize}px solid transparent`,
                                        borderRight: `${arrowSize}px solid transparent`,
                                        borderTop: `${arrowSize}px solid ${defaultTooltipColor}`,
                                    }}
                                />
                            </>
                        )}
                        {showArrow && tooltipPosition === 'bottom' && (
                            <>
                                {/* Arrow border */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: arrowLeft,
                                        top: '-9px',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 0,
                                        borderLeft: `${arrowSize + 1}px solid transparent`,
                                        borderRight: `${arrowSize + 1}px solid transparent`,
                                        borderBottom: `${arrowSize + 1}px solid ${gridColor}`,
                                    }}
                                />
                                {/* Arrow fill */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: arrowLeft,
                                        top: '-8px',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 0,
                                        borderLeft: `${arrowSize}px solid transparent`,
                                        borderRight: `${arrowSize}px solid transparent`,
                                        borderBottom: `${arrowSize}px solid ${defaultTooltipColor}`,
                                    }}
                                />
                            </>
                        )}
                        {showArrow && tooltipPosition === 'right' && (
                            <>
                                {/* Arrow border */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: '-9px',
                                        top: arrowTop,
                                        transform: 'translateY(-50%)',
                                        width: 0,
                                        height: 0,
                                        borderTop: `${arrowSize + 1}px solid transparent`,
                                        borderBottom: `${arrowSize + 1}px solid transparent`,
                                        borderRight: `${arrowSize + 1}px solid ${gridColor}`,
                                    }}
                                />
                                {/* Arrow fill */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: '-8px',
                                        top: arrowTop,
                                        transform: 'translateY(-50%)',
                                        width: 0,
                                        height: 0,
                                        borderTop: `${arrowSize}px solid transparent`,
                                        borderBottom: `${arrowSize}px solid transparent`,
                                        borderRight: `${arrowSize}px solid ${defaultTooltipColor}`,
                                    }}
                                />
                            </>
                        )}
                        {showArrow && tooltipPosition === 'left' && (
                            <>
                                {/* Arrow border */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: '-9px',
                                        top: arrowTop,
                                        transform: 'translateY(-50%)',
                                        width: 0,
                                        height: 0,
                                        borderTop: `${arrowSize + 1}px solid transparent`,
                                        borderBottom: `${arrowSize + 1}px solid transparent`,
                                        borderLeft: `${arrowSize + 1}px solid ${gridColor}`,
                                    }}
                                />
                                {/* Arrow fill */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: '-8px',
                                        top: arrowTop,
                                        transform: 'translateY(-50%)',
                                        width: 0,
                                        height: 0,
                                        borderTop: `${arrowSize}px solid transparent`,
                                        borderBottom: `${arrowSize}px solid transparent`,
                                        borderLeft: `${arrowSize}px solid ${defaultTooltipColor}`,
                                    }}
                                />
                            </>
                        )}
                        
                        <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                            {formatX ? formatX(tooltipData.data.x) : String(tooltipData.data.x)}
                        </div>
                        <div style={{ color: theme.palette.text.secondary }}>
                            {formatY ? formatY(tooltipData.data.y) : String(tooltipData.data.y)}
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
