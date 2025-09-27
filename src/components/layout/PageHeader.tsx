"use client";

import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SearchBar from '../common/SearchBar';
import { HEADER_HEIGHT, SEARCH_BAR_PLACEHOLDER } from '../../app/constants';

// Types
type Props = {
    onSearch?: (query: string) => void;
};

// Styles
const containerStyles: SxProps<Theme> = {
    position: 'fixed',
    right: 0,
    left: 0,
    height: HEADER_HEIGHT,
    borderBottom: 1,
    borderColor: 'divider',
};

const searchSectionStyles: SxProps<Theme> = {
    display: 'flex',
	position: 'absolute',
	right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    px: 1,
	py: 1,
	width: '300px',
};

export default function PageHeader({ onSearch }: Props) {
    const handleSearch = React.useCallback((query: string) => {
        onSearch?.(query);
    }, [onSearch]);

    return (
        <Box sx={containerStyles}>
			<Box sx={searchSectionStyles}>
				<SearchBar 
					onSearch={handleSearch}
					placeholder={SEARCH_BAR_PLACEHOLDER}
				/>
			</Box>
        </Box>
    );
}