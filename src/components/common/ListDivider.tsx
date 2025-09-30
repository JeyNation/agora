'use client';

import Box from '@mui/material/Box';
import { listStyles } from '../../styles/components';

interface ListDividerProps {
    show?: boolean;
}

export default function ListDivider({ show = true }: ListDividerProps) {
    if (!show) return null;
    
    return (
        <Box sx={listStyles.divider}>
            <Box sx={listStyles.dividerLine} />
        </Box>
    );
}