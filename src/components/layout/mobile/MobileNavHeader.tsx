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

import { useRouter } from 'next/navigation';

export default function MobileNavHeader({ isExpanded, onToggle, onSearch }: Props) {
    const router = useRouter();

	const handleSearch = React.useCallback((query: string) => {
		// Call the original onSearch handler if provided
		onSearch?.(query);

        // Navigate to research page with the ticker
        if (query.trim()) {
            router.push(`/research?ticker=${encodeURIComponent(query.trim())}`);
        }
	}, [onSearch, router]);

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