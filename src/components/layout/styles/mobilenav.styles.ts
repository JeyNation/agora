import { SxProps, Theme } from '@mui/material/styles';
import { HEADER_HEIGHT, TRANSITION_DURATION } from '../constants';

export const styles = {
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
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
    } as const,
} as const;