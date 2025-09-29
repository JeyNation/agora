import { Theme } from '@mui/material/styles';
import { HEADER_HEIGHT } from '../theme/constants';
import { 
    DRAWER_DEFAULT_WIDTH, 
    DRAWER_COLLAPSED_WIDTH,
    TRANSITION_DURATION 
} from '../../app/constants/navigation.constants';

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

    breadcrumbSection: (collapsed: boolean) => ({
        display: 'flex',
        position: 'absolute',
        left: (theme: Theme) => ({ 
            xs: 0, // Mobile: no offset
            sm: collapsed ? `${DRAWER_COLLAPSED_WIDTH}px` : `${DRAWER_DEFAULT_WIDTH}px`, // Tablet & Desktop: based on drawer state
        }),
        alignItems: 'center',
        px: 3,
        py: 2,
        transition: (theme: Theme) => theme.transitions.create('left', {
            easing: theme.transitions.easing.easeInOut,
            duration: TRANSITION_DURATION,
        }),
    } as const),

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