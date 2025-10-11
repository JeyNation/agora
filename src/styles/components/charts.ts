import type { Theme } from '@mui/material/styles';

const toDimension = (value?: number | string): string | undefined => {
    if (typeof value === 'number') {
        return `${value}px`;
    }
    return value;
};

type ChartStyle = Record<string, unknown>;

const buildStateDimensions = (width?: number | string, height?: number | string): ChartStyle => ({
    width: toDimension(width) ?? '100%',
    height: toDimension(height) ?? '100%',
});

export const lineChartStyles = {
    container: (width?: number | string, height?: number | string): ChartStyle => ({
        width: typeof width === 'string' ? width : undefined,
        height: typeof height === 'string' ? height : undefined,
        minHeight: typeof height === 'string' ? '200px' : undefined,
        minWidth: typeof width === 'string' ? '300px' : undefined,
        position: 'relative',
    }),

    stateRoot: (theme: Theme, width?: number | string, height?: number | string): ChartStyle => ({
        ...buildStateDimensions(width, height),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(0.5),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.text.secondary,
        textAlign: 'center',
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
    }),

    stateError: (theme: Theme): ChartStyle => ({
        borderColor: theme.palette.error.light,
        color: theme.palette.error.main,
    }),

    stateTitle: (theme: Theme): ChartStyle => ({
        fontWeight: theme.typography.fontWeightBold,
    }),

    stateMessage: (theme: Theme): ChartStyle => ({
        fontSize: theme.typography.pxToRem(12),
        opacity: 0.8,
    }),

    overlay: (theme: Theme): ChartStyle => ({
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(1),
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(2px)',
        pointerEvents: 'auto',
        zIndex: 2,
        color: theme.palette.text.secondary,
    }),

    overlayLabel: (theme: Theme): ChartStyle => ({
        fontSize: theme.typography.pxToRem(12),
        fontWeight: theme.typography.fontWeightMedium,
    }),

    svg: (): ChartStyle => ({
        display: 'block',
        overflow: 'visible',
        width: '100%',
        height: '100%',
    }),
};