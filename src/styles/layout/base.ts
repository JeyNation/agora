import { Theme } from '@mui/material';
import { DRAWER_COLLAPSED_WIDTH, DRAWER_DEFAULT_WIDTH } from '../theme/constants';

/**
 * Common flex container styles
 */
export const flexCenter = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

export const flexColumn = {
    display: 'flex',
    flexDirection: 'column',
};

export const flexBetween = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

/**
 * Layout transitions for smooth animations
 */
export const smoothTransition = {
    transition: (theme: Theme) =>
        theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
};

/**
 * Drawer styles
 */
export const drawerStyles = {
    open: {
        width: DRAWER_DEFAULT_WIDTH,
        ...smoothTransition,
    },
    closed: {
        width: DRAWER_COLLAPSED_WIDTH,
        ...smoothTransition,
    },
};

/**
 * Content container styles
 */
export const mainContent = {
    flexGrow: 1,
    width: { sm: `calc(100% - ${DRAWER_COLLAPSED_WIDTH}px)` },
    marginLeft: { sm: `${DRAWER_COLLAPSED_WIDTH}px` },
};