import { Theme } from '@mui/material/styles';

export const lineChart = {
    container: {
        width: '100%',
        height: '400px',
        position: 'relative',
    } as const,

    svg: {
        width: '100%',
        height: '100%',
        overflow: 'visible',
    } as const,

    axis: {
        color: (theme: Theme) => theme.palette.text.secondary,
        '& .domain': {
            stroke: 'currentColor',
        },
        '& .tick line': {
            stroke: 'currentColor',
            opacity: 0.1,
        },
        '& .tick text': {
            fill: 'currentColor',
            fontSize: '0.75rem',
        },
    } as const,

    line: {
        fill: 'none',
        strokeWidth: 2,
    } as const,
} as const;