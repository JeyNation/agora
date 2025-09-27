import { Theme } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
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

/**
 * Styles for the mobile navigation component
 */
export const mobileNav = {
    drawer: (isExpanded: boolean): SxProps<Theme> => ({
        '& .MuiDrawer-paper': {
            width: '100%',
            background: 'background.paper',
            borderTop: 0,
            height: '100%',
            maxHeight: isExpanded ? '100vh' : `${HEADER_HEIGHT}px`,
            overflow: 'hidden',
            transition: (theme: Theme) => theme.transitions.create(['max-height'], {
                easing: theme.transitions.easing.easeInOut,
                duration: TRANSITION_DURATION,
            }),
        },
    }),

    container: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        pl: 1,
        pr: 0,
        zIndex: 100,
        backgroundColor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    } as const,

    hamburgerButton: {
        display: 'flex',
        alignItems: 'center',
    } as const,

    searchSection: {
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        ml: 1,
        px: 1,
        py: 1,
        width: '100%',
        maxWidth: '300px',
    } as const,

    content: (isExpanded: boolean): SxProps<Theme> => ({
        opacity: isExpanded ? 1 : 0,
        transition: (theme: Theme) => theme.transitions.create(['opacity'], {
            easing: theme.transitions.easing.easeInOut,
            duration: TRANSITION_DURATION,
        }),
        overflow: 'hidden',
        flexGrow: 1,
        marginTop: `${HEADER_HEIGHT}px`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    }),

    emptySpace: {
        flexGrow: 1,
        cursor: 'pointer',
    },
} as const;
