import type { SxProps, Theme } from '@mui/material/styles';

export const researchStyles = {
    // Page Layout
    container: {

    } as SxProps<Theme>,

    panelLayout: {
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
		gap: 3,
    } as SxProps<Theme>,

    panel: {
        flex: 1,
    } as SxProps<Theme>,

    emptyState: {
        py: 4, 
        textAlign: 'center'
    } as SxProps<Theme>,

    header: {
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        justifyContent: 'space-between',
    } as SxProps<Theme>,

	headerControl: {
		marginLeft: 'auto',
	} as SxProps<Theme>,

    list: {
        p: 0,
    } as SxProps<Theme>,

	listItem: {
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.3s ease, background-color 0.2s ease',
        '&:hover': {
            backgroundColor: 'action.hover',
        },
        '&.moving-up': {
            animation: 'moveUp 0.3s ease-in-out'
        },
        '&.moving-down': {
            animation: 'moveDown 0.3s ease-in-out'
        }
	} as SxProps<Theme>,

	listItemContent: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center'
	} as SxProps<Theme>,

	listItemControl: {
		mr: 1,
	} as SxProps<Theme>,

	pagination: {
		mt: 2,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		display: 'flex',
	} as SxProps<Theme>,

    // Shared
    globalStyles: `
        @keyframes moveUp {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            50% {
                transform: translateY(-10px);
                opacity: 0.7;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes moveDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            50% {
                transform: translateY(10px);
                opacity: 0.7;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `
} as const;