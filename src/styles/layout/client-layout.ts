import { SxProps, Theme } from '@mui/material/styles';
import { 
    DRAWER_DEFAULT_WIDTH, 
    DRAWER_COLLAPSED_WIDTH, 
    HEADER_HEIGHT,
    TRANSITION_DURATION, 
    SPACING 
} from '../theme/constants';

/**
 * Layout styles for the client layout component
 */
export const clientLayout = {
    container: {
        display: 'flex',
        minHeight: '100vh',
    } as const,

    desktopMain: (collapsed: boolean): SxProps<Theme> => ({
        flexGrow: 1,
        p: SPACING.MD / SPACING.UNIT, // Convert to MUI spacing units
        ml: `${collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_DEFAULT_WIDTH}px`,
        mt: `${HEADER_HEIGHT}px`,
        width: 'auto',
        transition: (theme: Theme) => theme.transitions.create(['margin-left'], {
            easing: theme.transitions.easing.easeInOut,
            duration: TRANSITION_DURATION,
        }),
    }),

    mobileMain: {
        flexGrow: 1,
        width: '100%',
        mt: `${HEADER_HEIGHT}px`,
        p: SPACING.MD / SPACING.UNIT, // Convert to MUI spacing units
    } as const,
} as const;