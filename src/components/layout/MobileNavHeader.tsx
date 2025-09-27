"use client";

import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import SearchBar from '../common/SearchBar';

import { HEADER_HEIGHT, SEARCH_BAR_PLACEHOLDER } from './constants';

// Types
type Props = {
    isExpanded: boolean;
    onToggle: () => void;
    onSearch?: (query: string) => void;
};

// Styles
const containerStyles: SxProps<Theme> = {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 100,
    height: HEADER_HEIGHT,
    backgroundColor: 'background.paper',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: 1,
};

const hamburgerButtonStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
};

const searchSectionStyles: SxProps<Theme> = (theme) => ({
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    ml: 1,
    width: {
        xs: '100%',
        sm: 'auto'
    },
    maxWidth: {
        xs: '100%',
        sm: '300px'
    },
});

export default function MobileNavHeader({ isExpanded, onToggle, onSearch }: Props) {
	const handleSearch = React.useCallback((query: string) => {
		onSearch?.(query);
	}, [onSearch]);

	return (
		<Box sx={containerStyles}>
			<Box sx={hamburgerButtonStyles}>
				<IconButton
					onClick={onToggle}
					size="medium"
					color="inherit"
					aria-label={isExpanded ? 'collapse menu' : 'expand menu'}
					aria-expanded={isExpanded}
				>
					<MenuIcon />
				</IconButton>
			</Box>
			<Box sx={searchSectionStyles}>
				<SearchBar 
					fullWidth
					minWidth="120px"
					onSearch={handleSearch}
					placeholder={SEARCH_BAR_PLACEHOLDER}
				/>
			</Box>
		</Box>
	);
}