import { Theme } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import { HEADER_HEIGHT } from '../theme/constants';

/**
 * Page Header styles
 */
export const pageHeader = {
    container: {
        position: 'fixed',
        right: 0,
        left: 0,
        height: HEADER_HEIGHT,
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    } as const,

    searchSection: {
        display: 'flex',
        position: 'absolute',
        right: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: 1,
        py: 1,
        width: '300px',
    } as const,
} as const;