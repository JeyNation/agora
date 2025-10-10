'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { useTheme } from '@mui/material/styles';

export interface DataPoint {
    x: number | string | Date;
    y: number;
    [key: string]: unknown; // Allow additional properties
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
    showGrid?: boolean;
    animate?: boolean;
    animationDuration?: number;
    xAxisType?: 'linear' | 'time' | 'band';
    yAxisType?: 'linear' | 'log';
    formatX?: (value: unknown) => string;
    formatY?: (value: number) => string;
    onHover?: (data: DataPoint | null) => void;
    className?: string;
}

export default function LineChart({
    data,
    width = 800,
    height = 400,
    margin = { top: 20, right: 20, bottom: 50, left: 80 },
    xAxisLabel,
    yAxisLabel,
    lineColor,
    strokeWidth = 2,
    showDots = false,
    dotRadius = 4,
    showGrid = true,
    animate = true,
    animationDuration = 1000,
    xAxisType = 'linear',
    yAxisType = 'linear',
    formatX,
    formatY,
    onHover,
    className = '',
}: LineChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const [dimensions, setDimensions] = React.useState({ width: 800, height: 400 });
    
    // Use theme colors if not provided
    const defaultLineColor = lineColor || theme.palette.primary.main;
    const gridColor = theme.palette.divider;
    const textColor = theme.palette.text.secondary;

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
        if (!data || data.length === 0) {
            return { xScale: null, yScale: null };
        }

        let xScale: d3.ScaleLinear<number, number> | d3.ScaleTime<number, number> | d3.ScaleBand<string>;
        
        // Create X scale based on type
        if (xAxisType === 'time') {
            xScale = d3.scaleTime()
                .domain(d3.extent(data, d => new Date(d.x)) as [Date, Date])
                .range([0, chartWidth]);
        } else if (xAxisType === 'band') {
            xScale = d3.scaleBand()
                .domain(data.map(d => String(d.x)))
                .range([0, chartWidth])
                .padding(0.1);
        } else {
            xScale = d3.scaleLinear()
                .domain(d3.extent(data, d => Number(d.x)) as [number, number])
                .range([0, chartWidth]);
        }

        // Create Y scale
        let yScale: d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number>;
        
        if (yAxisType === 'log') {
            yScale = d3.scaleLog()
                .domain(d3.extent(data, d => d.y) as [number, number])
                .range([chartHeight, 0]);
        } else {
            yScale = d3.scaleLinear()
                .domain(d3.extent(data, d => d.y) as [number, number])
                .nice()
                .range([chartHeight, 0]);
        }

        return { xScale, yScale };
    }, [data, chartWidth, chartHeight, xAxisType, yAxisType]);

    // Line generator
    const line = useMemo(() => {
        if (!xScale || !yScale) return null;

        return d3.line<DataPoint>()
            .x(d => {
                if (xAxisType === 'time') {
                    return (xScale as d3.ScaleTime<number, number>)(new Date(d.x));
                } else if (xAxisType === 'band') {
                    return ((xScale as d3.ScaleBand<string>)(String(d.x)) || 0) + (xScale as d3.ScaleBand<string>).bandwidth() / 2;
                } else {
                    return (xScale as d3.ScaleLinear<number, number>)(Number(d.x));
                }
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

        // Create main group with margins
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add grid lines if enabled
        if (showGrid) {
            // X grid lines
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

            // Y grid lines
            if (xAxisType !== 'band') {
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
        }

        // Add the line path
        const path = g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", defaultLineColor)
            .attr("stroke-width", strokeWidth)
            .attr("d", line);

        // Animate the line drawing if enabled
        if (animate) {
            const totalLength = path.node()?.getTotalLength() || 0;
            path
                .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(animationDuration)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);
        }

        // Add dots if enabled
        if (showDots) {
            const dots = g.selectAll(".dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("cx", d => {
                    if (xAxisType === 'time') {
                        return (xScale as d3.ScaleTime<number, number>)(new Date(d.x));
                    } else if (xAxisType === 'band') {
                        return ((xScale as d3.ScaleBand<string>)(String(d.x)) || 0) + (xScale as d3.ScaleBand<string>).bandwidth() / 2;
                    } else {
                        return (xScale as d3.ScaleLinear<number, number>)(Number(d.x));
                    }
                })
                .attr("cy", d => (yScale as d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number>)(d.y))
                .attr("r", 0)
                .style("fill", defaultLineColor);

            if (animate) {
                dots.transition()
                    .delay((d, i) => (i / data.length) * animationDuration)
                    .duration(200)
                    .attr("r", dotRadius);
            } else {
                dots.attr("r", dotRadius);
            }

            // Add hover effects for dots
            if (onHover) {
                dots
                    .on("mouseenter", (event, d) => onHover(d))
                    .on("mouseleave", () => onHover(null))
                    .style("cursor", "pointer");
            }
        }

        // Create X axis
        const xAxis = d3.axisBottom(xScale as d3.AxisScale<d3.AxisDomain>);
        if (formatX) {
            xAxis.tickFormat(formatX);
        } else if (xAxisType === 'time') {
            xAxis.tickFormat((d: d3.AxisDomain) => d3.timeFormat("%m/%d")(d as Date));
        }

        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${chartHeight})`)
            .call(xAxis)
            .selectAll("text")
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
        showGrid, 
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
        xAxisType
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
            style={containerStyle}
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
        </div>
    );
}
