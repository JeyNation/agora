"use client";

import React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import Dialog from '@mui/material/Dialog';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useBreadcrumbs } from '../../../lib/hooks/useBreadcrumbs';
import { mobileNav } from '../../../styles/components/navigation';

// Types
type Props = {
    isExpanded: boolean;
    onToggle: () => void;
    onSearch?: (query: string) => void;
};

import { useRouter } from 'next/navigation';
import ResearchBar from '@/components/research/ResearchBar';
import Breadcrumb from '@/components/common/Breadcrumb';
import SearchButton from '@/components/common/SearchButton';

export default function MobileNavHeader({ isExpanded, onToggle, onSearch }: Props) {
	const router = useRouter();
	const isSmall = useMediaQuery('(max-width:499px)');
	const [openSearch, setOpenSearch] = React.useState(false);

	const breadcrumbItems = useBreadcrumbs();
	
	const handleStockSelect = React.useCallback((ticker: string) => {
		// Call the original onSearch handler if provided
		onSearch?.(ticker);

        // Navigate to research page with the ticker
        router.push(`/research/${encodeURIComponent(ticker)}`);
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

			<Box sx={mobileNav.breadcrumbSection}>
				<Breadcrumb items={breadcrumbItems} />
			</Box>

			<Box sx={mobileNav.searchSection}>
				{isSmall ? (
					<SearchButton onSelect={() => setOpenSearch(true)} />
				) : (
					<ResearchBar onSelect={handleStockSelect} />
				)}
			</Box>

			{/* Full-screen search dialog for small screens */}
			<Dialog fullScreen open={openSearch} onClose={() => setOpenSearch(false)}>
				<ClickAwayListener onClickAway={() => setOpenSearch(false)}>
					<Box sx={mobileNav.searchDialog}>
						<ResearchBar onSelect={(ticker) => {
							setOpenSearch(false);
							handleStockSelect(ticker);
						}} fullWidth autoFocus />
					</Box>
				</ClickAwayListener>
			</Dialog>
		</Box>
	);
}