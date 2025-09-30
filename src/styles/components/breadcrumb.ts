import { CSSProperties } from 'react';
import { SxProps, Theme } from '@mui/material';

export const breadcrumbStyles = {
    breadcrumbItem: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        display: 'flex',
        alignItems: 'center',
        height: '24px'
    } as SxProps<Theme>,
    
    link: {
        textDecoration: 'none'
    } as CSSProperties
};