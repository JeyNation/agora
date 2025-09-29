import { SxProps, Theme } from '@mui/material';

export const researchHistoryStyles = {
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
};