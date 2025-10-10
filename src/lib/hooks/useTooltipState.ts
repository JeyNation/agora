import { useState, useCallback } from 'react';
import { type DataPoint } from '../utils';

export interface TooltipPosition {
    x: number;
    y: number;
}

export interface TooltipData {
    data: DataPoint;
    position: TooltipPosition;
}

export interface UseTooltipStateResult {
    tooltipData: TooltipData | null;
    showTooltip: (data: DataPoint, position: TooltipPosition) => void;
    hideTooltip: () => void;
    setTooltipData: (data: TooltipData | null) => void;
}

/**
 * Custom hook to manage tooltip state
 */
export function useTooltipState(): UseTooltipStateResult {
    const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

    const showTooltip = useCallback((data: DataPoint, position: TooltipPosition) => {
        setTooltipData({ data, position });
    }, []);

    const hideTooltip = useCallback(() => {
        setTooltipData(null);
    }, []);

    return {
        tooltipData,
        showTooltip,
        hideTooltip,
        setTooltipData
    };
}