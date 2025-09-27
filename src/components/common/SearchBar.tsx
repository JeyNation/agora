"use client";

import React from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import { searchBar } from '../../styles/components/search-bar';

// Types
type Props = {
    onSearch?: (query: string) => void;
    placeholder?: string;
    fullWidth?: boolean;
    minWidth?: number | string;
    maxWidth?: number | string;
    className?: string;
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
                ...searchBar.container({ fullWidth, minWidth, maxWidth }),
                ...(isFocused && searchBar.focused),
            }}
            elevation={0}
            onSubmit={handleSubmit}
        >
            <InputBase
                sx={searchBar.inputBase}
                placeholder={placeholder}
                inputProps={{ 
                    'aria-label': 'search ticker',
                    onFocus: handleFocus,
                    onBlur: handleBlur,
                }}
                value={value}
                onChange={handleChange}
            />
            <Box sx={searchBar.searchIcon}>
                <SearchIcon fontSize="small" />
            </Box>
        </Paper>
    );
}