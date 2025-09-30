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
        '&.Mui-selected': {
            backgroundColor: 'action.selected',
            '&:hover': {
                backgroundColor: 'action.selected',
            },
        },
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
		mt: 1,
		zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    } as const,

    hamburgerButton: {
        display: 'flex',
        alignItems: 'center',
		width: `${DRAWER_COLLAPSED_WIDTH}px`
    } as const,

	breadcrumbSection: {
		display: 'flex',
		position: 'absolute',
		left: `${DRAWER_COLLAPSED_WIDTH}px`,
		alignItems: 'center',
		px: 2,
		py: 2,
		transition: (theme: Theme) => theme.transitions.create('left', {
			easing: theme.transitions.easing.easeInOut,
			duration: TRANSITION_DURATION,
		}),
	} as const,

    searchSection: {
        display: 'flex',
		position: 'absolute',
		right: 0,
        alignItems: 'center',
		justifyContent: 'flex-end',
        px: 1,
        py: 1,
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
