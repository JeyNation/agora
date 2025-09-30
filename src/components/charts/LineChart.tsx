"use client";

import React, { CSSProperties, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
// d3 is dynamically imported inside the effect to avoid adding it to the initial bundle
import { lineChart } from '../../styles/components/charts';

interface DataPoint {
    date: Date;
    value: number;
}

type TimeRange = 'day' | 'week' | 'month' | 'year';

interface LineChartProps {
    width?: number;
    height?: number;
    data?: DataPoint[];
    timeRange?: TimeRange;
}

// Utility function to get the date range based on timeRange (uses native Date math)
function getDateRange(timeRange: TimeRange): [Date, Date] {
    const now = new Date();
    const start = new Date(now);

    switch (timeRange) {
        case 'day':
            start.setDate(now.getDate() - 1);
            return [start, now];
        case 'week':
            start.setDate(now.getDate() - 7);
            return [start, now];
        case 'month':
            start.setMonth(now.getMonth() - 1);
            return [start, now];
        case 'year':
            // original used -10 years for 'year' range
            start.setFullYear(now.getFullYear() - 10);
            return [start, now];
        default:
            start.setDate(now.getDate() - 7);
            return [start, now];
    }
}

// Utility function to filter visible ticks
function filterTicks(timeRange: TimeRange): boolean {
    switch (timeRange) {
        case 'day':
            return true; // Show every hour
        case 'week':
            return true; // Show every day
        case 'month':
            return true; // Show every week
        case 'year':
            return true; // Show every month
        default:
            return true;
    }
}

const MARGIN = { top: 20, right: 20, bottom: 30, left: 40 };
const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 400;

export default function LineChart({ 
    width = DEFAULT_WIDTH, 
    height = DEFAULT_HEIGHT,
    data: propData,
    timeRange = 'day'
}: LineChartProps) {
    const theme = useTheme();
    const svgRef = useRef<SVGSVGElement>(null);
    const data = propData ?? generateDummyData(timeRange);

    useEffect(() => {
        if (!svgRef.current || !data.length) return;

        let mounted = true;

        (async () => {
            const d3 = await import('d3');

            if (!mounted || !svgRef.current) return;

            // Clear previous content
            const svg = d3.select(svgRef.current);
            svg.selectAll('*').remove();

            // Calculate dimensions
            const innerWidth = width - MARGIN.left - MARGIN.right;
            const innerHeight = height - MARGIN.top - MARGIN.bottom;

            // Create scales
            const xScale = d3.scaleTime()
                .domain(d3.extent(data, (d: DataPoint) => d.date) as [Date, Date])
                .range([0, innerWidth]);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data, (d: DataPoint) => d.value) as number])
                .range([innerHeight, 0]);

            // Create line generator
            const line = d3.line<DataPoint>()
                .x((d: DataPoint) => xScale(d.date))
                .y((d: DataPoint) => yScale(d.value));

            // Create container group
            const g = svg.append('g')
                .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

            // Set time range specific configurations
            const timeConfig = {
                day: {
                    format: d3.timeFormat('%I:%M%p'), // 1:00PM etc
                    interval: d3.timeHour,
                    tickCount: 24
                },
                week: {
                    format: d3.timeFormat('%a %b %d'), // Mon Sep 28
                    interval: d3.timeDay,
                    tickCount: 7
                },
                month: {
                    format: d3.timeFormat('%b %d'), // Sep 28
                    interval: d3.timeWeek,
                    tickCount: 4
                },
                year: {
                    format: d3.timeFormat('%b %Y'), // Sep 2025
                    interval: d3.timeMonth,
                    tickCount: 12
                }
            }[timeRange];

            // Set the domain based on the time range
            xScale.domain(getDateRange(timeRange));

            // Add x-axis with formatted ticks
            const xAxis = g.append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(0,${innerHeight})`)
                .call(
                    d3.axisBottom(xScale)
                        .ticks(timeConfig.interval, timeConfig.tickCount)
                        .tickFormat((d: Date | d3.NumberValue) => {
                            if (!(d instanceof Date)) return '';
                            return filterTicks(timeRange) ? timeConfig.format(d) : '';
                        })
                )
                .style('color', theme.palette.text.secondary);

            // Rotate labels if needed
            if (timeRange === 'day' || timeRange === 'week') {
                xAxis.selectAll('text')
                    .style('text-anchor', 'end')
                    .attr('dx', '-.8em')
                    .attr('dy', '.15em')
                    .attr('transform', 'rotate(-45)');
            }

            // Add y-axis
            g.append('g')
                .attr('class', 'y-axis')
                .call(d3.axisLeft(yScale))
                .style('color', theme.palette.text.secondary);

            // Add line path
            g.append('path')
                .datum(data)
                .attr('class', 'line')
                .attr('d', line)
                .style('stroke', theme.palette.primary.main)
                .style('fill', 'none')
                .style('stroke-width', 2);
        })();

        return () => {
            mounted = false;
        };

    }, [data, width, height, theme.palette, timeRange]);

    return (
        <Box sx={lineChart.container}>
            <svg 
                ref={svgRef}
                style={lineChart.svg as CSSProperties}
                width={width}
                height={height}
            />
        </Box>
    );
}

// Helper function to generate dummy data - TO BE REMOVED IN PRODUCTION
function generateDummyData(timeRange: TimeRange = 'day'): DataPoint[] {
    const [startDate, endDate] = getDateRange(timeRange);
    const data: DataPoint[] = [];

    // Define the interval for data points in milliseconds
    let stepMs: number;

    switch (timeRange) {
        case 'day':
            stepMs = 15 * 60 * 1000; // 15 minutes
            break;
        case 'week':
            stepMs = 6 * 60 * 60 * 1000; // 6 hours
            break;
        case 'month':
            stepMs = 24 * 60 * 60 * 1000; // 1 day
            break;
        case 'year':
            stepMs = 7 * 24 * 60 * 60 * 1000; // 1 week
            break;
        default:
            stepMs = 24 * 60 * 60 * 1000;
            break;
    }

    for (let t = startDate.getTime(); t <= endDate.getTime(); t += stepMs) {
        data.push({
            date: new Date(t),
            value: Math.random() * 100 + 50 // Random value between 50 and 150
        });
    }

    return data;
}