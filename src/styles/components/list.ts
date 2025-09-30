import type { SxProps, Theme } from '@mui/material/styles';

export const listStyles = {
    divider: {
        mx: { xs: 2, md: 3 }
    } as SxProps<Theme>,

    dividerLine: {
        borderBottom: 1, 
        borderColor: 'divider'
    } as SxProps<Theme>,
} as const;