"use client";

import React from 'react';
import Box from '@mui/material/Box';
import SearchBar from '../common/SearchBar';
import { SEARCH_BAR_PLACEHOLDER } from '../../app/constants';
import { pageHeader } from '../../styles/layout/page-header';

// Types
type Props = {
    onSearch?: (query: string) => void;
};

export default function PageHeader({ onSearch }: Props) {
    const handleSearch = React.useCallback((query: string) => {
        onSearch?.(query);
    }, [onSearch]);

    return (
        <Box sx={pageHeader.container}>
			<Box sx={pageHeader.searchSection}>
				<SearchBar 
					onSearch={handleSearch}
					placeholder={SEARCH_BAR_PLACEHOLDER}
				/>
			</Box>
        </Box>
    );
}