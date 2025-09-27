import { SxProps, Theme } from '@mui/material/styles';
import { DRAWER_DEFAULT_WIDTH, DRAWER_COLLAPSED_WIDTH } from '../constants';

// Constants
const MOBILE_NAV_HEIGHT = 56;
const PAGE_HEADER_HEIGHT = 56;
const CONTENT_PADDING = 3;
const TRANSITION_DURATION = 200;

export const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
    } as const,

    desktopMain: (collapsed: boolean): SxProps<Theme> => ({
        flexGrow: 1,
        p: CONTENT_PADDING,
        ml: `${collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_DEFAULT_WIDTH}px`,
        mt: `${PAGE_HEADER_HEIGHT}px`,
        width: 'auto',
        transition: (theme: Theme) => theme.transitions.create(['margin-left'], {
            easing: theme.transitions.easing.easeInOut,
            duration: TRANSITION_DURATION,
        }),
    }),

    mobileMain: {
        flexGrow: 1,
        width: '100%',
        mt: `${MOBILE_NAV_HEIGHT}px`,
        p: CONTENT_PADDING,
    } as const,
} as const;