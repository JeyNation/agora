"use client";

import React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import SearchBar from '../../common/SearchBar';
import { SEARCH_BAR_PLACEHOLDER } from '../../../app/constants';
import { mobileNav } from '../../../styles/components/navigation';

// Types
type Props = {
    isExpanded: boolean;
    onToggle: () => void;
    onSearch?: (query: string) => void;
};

export default function MobileNavHeader({ isExpanded, onToggle, onSearch }: Props) {
	const handleSearch = React.useCallback((query: string) => {
		onSearch?.(query);
	}, [onSearch]);

	return (
		<Box sx={mobileNav.container}>
			<Box sx={mobileNav.hamburgerButton}>
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
			<Box sx={mobileNav.searchSection}>
				<SearchBar 
					onSearch={handleSearch}
					placeholder={SEARCH_BAR_PLACEHOLDER}
				/>
			</Box>
		</Box>
	);
}