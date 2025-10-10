'use client';

import React from 'react';
import { useTheme } from '@mui/material/styles';
import { DataPoint } from '../../lib/utils';

export interface TooltipPosition {
    x: number;
    y: number;
}

export interface TooltipData {
    data: DataPoint;
    position: TooltipPosition;
}

export interface ChartTooltipProps {
    tooltipData: TooltipData | null;
    actualWidth: number;
    actualHeight: number;
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    formatX?: (value: unknown) => string;
    formatY?: (value: number) => string;
    tooltipColor?: string;
    gridColor?: string;
}

export default function ChartTooltip({
    tooltipData,
    actualWidth,
    actualHeight,
    margin,
    formatX,
    formatY,
    tooltipColor,
    gridColor
}: ChartTooltipProps) {
    const theme = useTheme();
    const tooltipRef = React.useRef<HTMLDivElement>(null);

    if (!tooltipData) return null;

    // Use theme colors if not provided
    const defaultTooltipColor = tooltipColor || theme.palette.background.paper;
    const defaultGridColor = gridColor || theme.palette.divider;

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
                border: `1px solid ${defaultGridColor}`,
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
                            borderTop: `${arrowSize + 1}px solid ${defaultGridColor}`,
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
                            borderBottom: `${arrowSize + 1}px solid ${defaultGridColor}`,
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
                            borderRight: `${arrowSize + 1}px solid ${defaultGridColor}`,
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
                            borderLeft: `${arrowSize + 1}px solid ${defaultGridColor}`,
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
}