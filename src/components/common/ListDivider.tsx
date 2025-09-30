'use client';

import Box from '@mui/material/Box';
import { listStyles } from '../../styles/components';

interface ListDividerProps {
    /**
     * Whether to show the divider or not.
     * @default true
     */
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