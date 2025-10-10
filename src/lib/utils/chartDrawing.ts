import * as d3 from 'd3';

export interface DataPoint {
    x: number | string | Date;
    y: number;
    [key: string]: unknown;
}

export interface HighlightRange {
    start: number | Date | string;
    end: number | Date | string;
    color?: string;
    opacity?: number;
}

export interface ProcessedHighlight {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    color: string;
    opacity: number;
}

export interface ChartDimensions {
    width: number;
    height: number;
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
}

export interface ChartScales {
    xScale: d3.ScaleLinear<number, number> | d3.ScaleTime<number, number> | d3.ScaleBand<string>;
    yScale: d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number>;
}

export interface GridConfig {
    showXGrid: boolean;
    showYGrid: boolean;
    gridColor: string;
    xAxisType: 'linear' | 'time' | 'band';
}

export interface AxisConfig {
    xAxisLabel?: string;
    yAxisLabel?: string;
    formatX?: (value: unknown) => string;
    formatY?: (value: number) => string;
    textColor: string;
    xAxisType: 'linear' | 'time' | 'band';
}

export interface LineConfig {
    data: DataPoint[];
    lineColor: string;
    strokeWidth: number;
    animate: boolean;
    animationDuration: number;
    hasAnimatedRef: React.MutableRefObject<boolean>;
    xAxisType: 'linear' | 'time' | 'band';
}

export interface DotsConfig {
    data: DataPoint[];
    showDots: boolean;
    dotRadius: number;
    dotColor: string;
    animate: boolean;
    animationDuration: number;
    hasAnimatedRef: React.MutableRefObject<boolean>;
    xAxisType: 'linear' | 'time' | 'band';
    onHover?: (data: DataPoint | null) => void;
    showTooltip: boolean;
    setTooltipData?: (data: { data: DataPoint; position: { x: number; y: number } } | null) => void;
}

/**
 * Calculate X position for a data point based on axis type
 */
export function calculateXPosition(
    dataPoint: DataPoint,
    xScale: ChartScales['xScale'],
    xAxisType: 'linear' | 'time' | 'band'
): number {
    if (xAxisType === 'time') {
        return (xScale as d3.ScaleTime<number, number>)(new Date(dataPoint.x));
    } else if (xAxisType === 'band') {
        const bandScale = xScale as d3.ScaleBand<string>;
        const bandStart = bandScale(String(dataPoint.x)) || 0;
        return bandStart + bandScale.bandwidth() / 2;
    } else {
        return (xScale as d3.ScaleLinear<number, number>)(Number(dataPoint.x));
    }
}

/**
 * Calculate Y position for a data point
 */
export function calculateYPosition(
    dataPoint: DataPoint,
    yScale: ChartScales['yScale']
): number {
    return yScale(dataPoint.y);
}

/**
 * Draw grid lines on the chart
 */
export function drawGridLines(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    scales: ChartScales,
    dimensions: ChartDimensions,
    config: GridConfig
): void {
    const { xScale, yScale } = scales;
    const chartWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    const chartHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    // X grid lines (horizontal lines)
    if (config.showXGrid) {
        container.selectAll(".grid-x")
            .data(yScale.ticks())
            .enter()
            .append("line")
            .attr("class", "grid-x")
            .attr("x1", 0)
            .attr("x2", chartWidth)
            .attr("y1", d => yScale(d))
            .attr("y2", d => yScale(d))
            .style("stroke", config.gridColor)
            .style("stroke-width", 1)
            .style("opacity", 0.3);
    }

    // Y grid lines (vertical lines)
    if (config.showYGrid && config.xAxisType !== 'band') {
        if (config.xAxisType === 'time') {
            const timeScale = xScale as d3.ScaleTime<number, number>;
            container.selectAll(".grid-y")
                .data(timeScale.ticks())
                .enter()
                .append("line")
                .attr("class", "grid-y")
                .attr("x1", d => timeScale(d))
                .attr("x2", d => timeScale(d))
                .attr("y1", 0)
                .attr("y2", chartHeight)
                .style("stroke", config.gridColor)
                .style("stroke-width", 1)
                .style("opacity", 0.3);
        } else {
            const linearScale = xScale as d3.ScaleLinear<number, number>;
            container.selectAll(".grid-y")
                .data(linearScale.ticks())
                .enter()
                .append("line")
                .attr("class", "grid-y")
                .attr("x1", d => linearScale(d))
                .attr("x2", d => linearScale(d))
                .attr("y1", 0)
                .attr("y2", chartHeight)
                .style("stroke", config.gridColor)
                .style("stroke-width", 1)
                .style("opacity", 0.3);
        }
    }
}

/**
 * Draw highlight ranges on the chart
 */
export function drawHighlightRanges(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    xHighlights: ProcessedHighlight[],
    yHighlights: ProcessedHighlight[],
    chartWidth: number,
    chartHeight: number
): void {
    // X-axis highlight ranges
    if (xHighlights.length > 0) {
        container.selectAll(".x-highlight")
            .data(xHighlights)
            .enter()
            .append("rect")
            .attr("class", "x-highlight")
            .attr("x", d => d.x || 0)
            .attr("y", 0)
            .attr("width", d => d.width || 0)
            .attr("height", chartHeight)
            .style("fill", d => d.color)
            .style("opacity", d => d.opacity)
            .style("pointer-events", "none");
    }

    // Y-axis highlight ranges
    if (yHighlights.length > 0) {
        container.selectAll(".y-highlight")
            .data(yHighlights)
            .enter()
            .append("rect")
            .attr("class", "y-highlight")
            .attr("x", 0)
            .attr("y", d => d.y || 0)
            .attr("width", chartWidth)
            .attr("height", d => d.height || 0)
            .style("fill", d => d.color)
            .style("opacity", d => d.opacity)
            .style("pointer-events", "none");
    }
}

/**
 * Draw the main line path
 */
export function drawLinePath(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    line: d3.Line<DataPoint>,
    config: LineConfig
): d3.Selection<SVGPathElement, DataPoint[], null, undefined> {
    const path = container.append("path")
        .datum(config.data)
        .attr("class", "line-path")
        .attr("fill", "none")
        .attr("stroke", config.lineColor)
        .attr("stroke-width", config.strokeWidth)
        .attr("d", line);

    // Animate the line drawing if enabled (only on first render)
    if (config.animate && !config.hasAnimatedRef.current) {
        const totalLength = path.node()?.getTotalLength() || 0;
        path
            .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(config.animationDuration)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
            .on("end", () => {
                config.hasAnimatedRef.current = true;
            });
    }

    return path;
}

/**
 * Draw dots on the chart
 */
export function drawDots(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    scales: ChartScales,
    config: DotsConfig
): d3.Selection<SVGCircleElement, DataPoint, SVGGElement, unknown> | null {
    if (!config.showDots) return null;

    const dots = container.selectAll(".dot")
        .data(config.data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => calculateXPosition(d, scales.xScale, config.xAxisType))
        .attr("cy", d => calculateYPosition(d, scales.yScale))
        .attr("r", 0)
        .style("fill", config.dotColor);

    // Animate dots appearance
    if (config.animate && !config.hasAnimatedRef.current) {
        dots.transition()
            .delay((d, i) => (i / config.data.length) * config.animationDuration)
            .duration(200)
            .attr("r", config.dotRadius);
    } else {
        dots.attr("r", config.dotRadius);
    }

    // Add hover effects for dots
    if (config.onHover || config.showTooltip) {
        dots
            .on("mouseenter", (event, d) => {
                // Call onHover callback if provided
                if (config.onHover) config.onHover(d);
                
                // Show tooltip if enabled
                if (config.showTooltip && config.setTooltipData) {
                    const xPos = parseFloat(d3.select(event.currentTarget).attr("cx"));
                    const yPos = parseFloat(d3.select(event.currentTarget).attr("cy"));
                    config.setTooltipData({ 
                        data: d, 
                        position: { x: xPos, y: yPos } 
                    });
                }
            })
            .on("mouseleave", () => {
                // Clear onHover callback
                if (config.onHover) config.onHover(null);
                
                // Clear tooltip
                if (config.showTooltip && config.setTooltipData) {
                    config.setTooltipData(null);
                }
            })
            .style("cursor", "pointer");
    }

    return dots;
}

/**
 * Draw invisible hover areas for tooltips (when dots are not shown)
 */
export function drawHoverAreas(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    scales: ChartScales,
    data: DataPoint[],
    xAxisType: 'linear' | 'time' | 'band',
    onHover?: (data: DataPoint | null) => void,
    setTooltipData?: (data: { data: DataPoint; position: { x: number; y: number } } | null) => void
): d3.Selection<SVGCircleElement, DataPoint, SVGGElement, unknown> {
    return container.selectAll(".hover-area")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "hover-area")
        .attr("cx", d => calculateXPosition(d, scales.xScale, xAxisType))
        .attr("cy", d => calculateYPosition(d, scales.yScale))
        .attr("r", 8) // Larger hover area than visible dots
        .style("fill", "transparent")
        .style("cursor", "pointer")
        .on("mouseenter", (event, d) => {
            // Call onHover callback if provided
            if (onHover) onHover(d);
            
            // Show tooltip
            if (setTooltipData) {
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
            if (setTooltipData) {
                setTooltipData(null);
            }
        });
}

/**
 * Draw X axis
 */
export function drawXAxis(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    xScale: ChartScales['xScale'],
    chartHeight: number,
    config: AxisConfig
): void {
    const xAxis = d3.axisBottom(xScale as d3.AxisScale<d3.AxisDomain>);
    
    // Configure axis based on type
    if (config.xAxisType === 'band') {
        xAxis
            .tickSizeOuter(0)
            .tickFormat((d: d3.AxisDomain) => {
                if (config.formatX) {
                    return config.formatX(d);
                }
                return String(d);
            });
    } else if (config.formatX) {
        xAxis.tickFormat(config.formatX);
    } else if (config.xAxisType === 'time') {
        xAxis.tickFormat((d: d3.AxisDomain) => d3.timeFormat("%m/%d")(d as Date));
    }

    const xAxisGroup = container.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(xAxis);

    // For band scales, manually position the ticks at band centers
    if (config.xAxisType === 'band') {
        const bandScale = xScale as d3.ScaleBand<string>;
        xAxisGroup.selectAll(".tick")
            .attr("transform", (d: unknown) => {
                const bandStart = bandScale(String(d)) || 0;
                const bandCenter = bandStart + bandScale.bandwidth() / 2;
                return `translate(${bandCenter}, 0)`;
            });
    }

    xAxisGroup.selectAll("text")
        .style("fill", config.textColor);
}

/**
 * Draw Y axis
 */
export function drawYAxis(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    yScale: ChartScales['yScale'],
    config: AxisConfig
): void {
    const yAxis = d3.axisLeft(yScale as d3.AxisScale<d3.AxisDomain>);
    if (config.formatY) {
        yAxis.tickFormat((d: d3.AxisDomain) => config.formatY!(Number(d)));
    }

    container.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        .selectAll("text")
        .style("fill", config.textColor);
}

/**
 * Draw axis labels
 */
export function drawAxisLabels(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    dimensions: ChartDimensions,
    config: AxisConfig
): void {
    const chartWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    const chartHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    if (config.xAxisLabel) {
        container.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", chartWidth / 2)
            .attr("y", chartHeight + dimensions.margin.bottom - 10)
            .style("fill", config.textColor)
            .style("font-size", "12px")
            .text(config.xAxisLabel);
    }

    if (config.yAxisLabel) {
        container.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -chartHeight / 2)
            .attr("y", -dimensions.margin.left + 20)
            .style("fill", config.textColor)
            .style("font-size", "12px")
            .text(config.yAxisLabel);
    }
}

/**
 * Style axis lines and ticks
 */
export function styleAxisElements(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    textColor: string
): void {
    svg.selectAll(".domain")
        .style("stroke", textColor);
    
    svg.selectAll(".tick line")
        .style("stroke", textColor);
}