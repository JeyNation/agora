import { alpha, Theme } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

interface SearchBarStyleProps {
    fullWidth?: boolean;
    minWidth?: number | string;
    maxWidth?: number | string;
}

/**
 * Search Bar Component Styles
 * Used by: SearchInput, SuggestionList, and ResearchBar components
 */
export const searchBar = {
    // SearchInput Component Styles
    inputContainer: ({ minWidth, maxWidth }: SearchBarStyleProps): SxProps<Theme> => ({
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
        '&:focus-within': {
            borderColor: (theme: Theme) => theme.palette.primary.main,
            boxShadow: (theme: Theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
        },
        transition: (theme: Theme) => theme.transitions.create([
            'background-color',
            'border-color',
            'box-shadow',
        ]),
    }),

    input: {
        width: '100%',
        padding: '4px 12px',
        fontSize: '0.875rem',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        color: 'text.primary',
        '&::placeholder': {
            color: 'text.disabled',
            opacity: 1,
        },
        '&:disabled': {
            color: 'text.disabled',
            cursor: 'not-allowed',
        },
    } as const,

    icon: {
        color: 'text.secondary',
        fontSize: '1.25rem',
        mr: 1,
    } as const,

    // SuggestionList Component Styles
    suggestionPaper: {
        borderRadius: '12px',
        overflow: 'hidden',
        zIndex: (theme: Theme) => theme.zIndex.modal + 10,
    } as const,

    suggestionList: {
        listStyle: 'none',
        m: 0,
        p: 0,
    } as const,

    suggestionItem: {
        px: 2,
        py: 1,
        cursor: 'pointer',
        transition: (theme: Theme) => theme.transitions.create(['background-color']),
        '&:hover': { bgcolor: 'action.hover' },
    } as const,

    suggestionItemActive: {
        bgcolor: 'action.selected',
        '&:hover': { bgcolor: 'action.selected' },
    } as const,
} as const;