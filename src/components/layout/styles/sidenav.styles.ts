import { SxProps, Theme } from '@mui/material/styles';
import { DRAWER_DEFAULT_WIDTH, DRAWER_COLLAPSED_WIDTH, TRANSITION_DURATION, HEADER_HEIGHT } from '../constants';

export const styles = {
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
        px: 1,
        py: 1,
		height: HEADER_HEIGHT,
		borderBottom: 1,
		borderColor: 'divider',
    } as const,

    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    } as const,

    list: (bottomAlign?: boolean): SxProps<Theme> => ({
        borderColor: 'divider',
        ...(bottomAlign && { mt: 'auto' }),
    }),
} as const;