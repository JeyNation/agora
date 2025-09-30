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
        display: 'flex',
        alignItems: 'center',
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
        pl: 2,
		pr: 0,
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        color: 'text.secondary',
    } as const,

    autocomplete: {
        flexGrow: 1,
        '& .MuiInput-root': {
            padding: '4px 8px',
        },
        '& .MuiAutocomplete-input': {
            padding: '4px 0 !important',
            fontSize: '0.875rem',
            '&::placeholder': {
                color: 'text.disabled',
                opacity: 1,
            },
        },
        '& .MuiAutocomplete-endAdornment': {
            right: 8,
        },
    } as const,

    focused: {
        borderColor: (theme: Theme) => theme.palette.primary.main,
        boxShadow: (theme: Theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
} as const;