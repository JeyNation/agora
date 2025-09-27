import { alpha, Theme } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

interface SearchBarStyleProps {
    fullWidth?: boolean;
    minWidth?: number | string;
    maxWidth?: number | string;
}

/**
 * Search Bar Component Styles
 */
export const searchBar = {
    container: ({ minWidth, maxWidth }: SearchBarStyleProps): SxProps<Theme> => ({
        position: 'relative',
        borderRadius: 20,
        width: '100%',
        minWidth,
        maxWidth,
        border: '1px solid',
        borderColor: (theme: Theme) => alpha(theme.palette.text.primary, 0.12),
        backgroundColor: (theme: Theme) => alpha(theme.palette.background.paper, 0.8),
        '&:hover': {
            borderColor: (theme: Theme) => alpha(theme.palette.text.primary, 0.23),
            backgroundColor: (theme: Theme) => alpha(theme.palette.background.paper, 0.9),
        },
        transition: (theme: Theme) => theme.transitions.create([
            'background-color',
            'border-color',
            'box-shadow',
            'width',
        ]),
    }),

    searchIcon: {
        px: 2,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.secondary',
        right: 0,
        top: 0,
    } as const,

    inputBase: {
        width: '100%',
        '& .MuiInputBase-input': {
            py: 1,
            pl: 2,
            pr: 5,
            width: '100%',
            fontSize: '0.875rem',
            transition: (theme: Theme) => theme.transitions.create('width'),
            '&::placeholder': {
                color: 'text.disabled',
                opacity: 1,
            },
        },
    } as const,

    focused: {
        borderColor: (theme: Theme) => theme.palette.primary.main,
        boxShadow: (theme: Theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
} as const;