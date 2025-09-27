import { Theme } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import { NAV_ITEM_HEIGHT, HEADER_HEIGHT, TRANSITION_DURATION } from '../theme/constants';

/**
 * Navigation item styles
 */
export const navItem = {
    root: {
        height: NAV_ITEM_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textDecoration: 'none',
        color: 'inherit',
        width: '100%',
    },
    icon: {
        minWidth: 0,
        marginRight: 3,
        justifyContent: 'center',
        color: (theme: Theme) => theme.palette.text.secondary,
    },
    label: {
        marginLeft: 2,
    },
};

/**
 * Mobile navigation styles
 */
export const mobileNav = {
    drawer: {
        '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: '100%',
            height: '90vh',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
        },
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1199,
    },
};

/**
 * Side navigation styles
 */
export const sideNav = {
    drawer: (theme: Theme) => ({
        width: '100%',
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
            width: '100%',
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            overflow: 'hidden',
        },
    }),
    list: {
        padding: 0,
    },
};

/**
 * Mobile navigation content styles
 */
export const mobileNavContent = {
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