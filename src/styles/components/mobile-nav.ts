import { SxProps, Theme } from '@mui/material/styles';
import { HEADER_HEIGHT, TRANSITION_DURATION } from '../theme/constants';

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
} as const;