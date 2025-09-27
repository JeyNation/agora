"use client";

import React from 'react';
import { SxProps, Theme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';

// Types
type Props = {
    onSearch?: (query: string) => void;
    placeholder?: string;
    fullWidth?: boolean;
    minWidth?: number | string;
    maxWidth?: number | string;
    className?: string;
};

// Styles
const containerStyles = ({ minWidth, maxWidth }: Partial<Props>): SxProps<Theme> => ({
    position: 'relative',
    borderRadius: 20,
    width: '100%',
    minWidth,
    maxWidth,
    border: '1px solid',
    borderColor: theme => alpha(theme.palette.text.primary, 0.12),
    backgroundColor: theme => alpha(theme.palette.background.paper, 0.8),
    '&:hover': {
        borderColor: theme => alpha(theme.palette.text.primary, 0.23),
        backgroundColor: theme => alpha(theme.palette.background.paper, 0.9),
    },
    transition: theme => theme.transitions.create([
        'background-color',
        'border-color',
        'box-shadow',
        'width',
    ]),
});

const searchIconStyles: SxProps<Theme> = {
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
};

const inputBaseStyles: SxProps<Theme> = {
    width: '100%',
    '& .MuiInputBase-input': {
        py: 1,
        pl: 2,
        pr: 5,
        width: '100%',
        fontSize: '0.875rem',
        transition: theme => theme.transitions.create('width'),
        '&::placeholder': {
            color: 'text.disabled',
            opacity: 1,
        },
    },
};

export default function SearchBar({ 
    onSearch, 
    placeholder = "Search...",
    fullWidth,
    minWidth,
    maxWidth,
    className
}: Props) {
    const [mounted, setMounted] = React.useState(false);
    const [value, setValue] = React.useState('');
    const [isFocused, setIsFocused] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSearch?.(value);
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
        <Paper
            component="form"
            className={className}
            sx={{
                ...containerStyles({ fullWidth, minWidth, maxWidth }),
                ...(isFocused && {
                    borderColor: theme => theme.palette.primary.main,
                    boxShadow: theme => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                }),
            }}
            elevation={0}
            onSubmit={handleSubmit}
        >
            <InputBase
                sx={inputBaseStyles}
                placeholder={placeholder}
                inputProps={{ 
                    'aria-label': 'search ticker',
                    onFocus: handleFocus,
                    onBlur: handleBlur,
                }}
                value={value}
                onChange={handleChange}
            />
            <Box sx={searchIconStyles}>
                <SearchIcon fontSize="small" />
            </Box>
        </Paper>
    );
}