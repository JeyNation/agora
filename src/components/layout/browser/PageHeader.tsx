"use client";

import React from 'react';
import Box from '@mui/material/Box';
import SearchBar from '../../common/SearchBar';
import Breadcrumb from '../../common/Breadcrumb';
import { useBreadcrumbs } from '../../../lib/hooks/useBreadcrumbs';
import { SEARCH_BAR_PLACEHOLDER } from '../../../app/constants';
import { pageHeader } from '../../../styles/layout/page-header';

// Types
type Props = {
    onSearch?: (query: string) => void;
    collapsed?: boolean;
};

import { useRouter } from 'next/navigation';

export default function PageHeader({ onSearch, collapsed = false }: Props) {
    const router = useRouter();

    const breadcrumbItems = useBreadcrumbs();
    
    const handleSearch = React.useCallback((query: string) => {
        // Call the original onSearch handler if provided
        onSearch?.(query);
        
        // Navigate to research page with the ticker
        if (query.trim()) {
            router.push(`/research?ticker=${encodeURIComponent(query.trim())}`);
        }
    }, [onSearch, router]);

    return (
        <Box sx={pageHeader.container}>
            <Box sx={pageHeader.breadcrumbSection(collapsed)}>
                <Breadcrumb items={breadcrumbItems} />
            </Box>
			<Box sx={pageHeader.searchSection}>
				<SearchBar 
					onSearch={handleSearch}
					placeholder={SEARCH_BAR_PLACEHOLDER}
				/>
			</Box>
        </Box>
    );
}