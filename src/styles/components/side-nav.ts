import { SxProps, Theme } from '@mui/material/styles';
import { 
    DRAWER_DEFAULT_WIDTH, 
    DRAWER_COLLAPSED_WIDTH, 
    TRANSITION_DURATION, 
    HEADER_HEIGHT,
    SPACING 
} from '../theme/constants';

/**
 * Styles for the side navigation component
 */
export const sideNav = {
    drawer: (collapsed: boolean): SxProps<Theme> => ({
        boxSizing: 'border-box',
        width: `${collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_DEFAULT_WIDTH}px`,
        transition: (theme: Theme) => 
            theme.transitions.create('width', {
                easing: theme.transitions.easing.easeInOut,
                duration: TRANSITION_DURATION,
            }),
        overflowX: 'hidden',
    }),

    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: SPACING.XS / SPACING.UNIT,
        py: SPACING.XS / SPACING.UNIT,
        height: HEADER_HEIGHT,
        borderBottom: 1,
        borderColor: 'divider',
        transition: (theme: Theme) => theme.transitions.create(['padding'], {
            easing: theme.transitions.easing.easeInOut,
            duration: TRANSITION_DURATION,
        }),
    },

    brandText: {
        fontWeight: 'medium',
        fontSize: '1.125rem',
        letterSpacing: '-0.025em',
        px: SPACING.SM / SPACING.UNIT,
    },

    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    } as const,

    list: (bottomAlign?: boolean): SxProps<Theme> => ({
        borderColor: 'divider',
        ...(bottomAlign && { mt: 'auto' }),
    }),

    itemButton: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        py: SPACING.SM / SPACING.UNIT,
    } as const,

    itemIcon: {
        minWidth: 0,
        width: '42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
    } as const,

    itemText: {
        ml: 0,
        margin: 0,
    } as const,

    typography: {
        lineHeight: 1,
        whiteSpace: 'nowrap',
        fontSize: '0.9rem',
        margin: 0,
    } as const,
} as const;