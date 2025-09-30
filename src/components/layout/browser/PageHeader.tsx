"use client";

import React from 'react';
import Box from '@mui/material/Box';
import Breadcrumb from '../../common/Breadcrumb';
import { useBreadcrumbs } from '../../../lib/hooks/useBreadcrumbs';
import { pageHeader } from '../../../styles/layout/page-header';

// Types
type Props = {
    onSearch?: (query: string) => void;
    collapsed?: boolean;
};

import { useRouter } from 'next/navigation';
import ResearchBar from '@/components/research/ResearchBar';

export default function PageHeader({ onSearch, collapsed = false }: Props) {
    const router = useRouter();

    const breadcrumbItems = useBreadcrumbs();
    
    const handleStockSelect = React.useCallback((ticker: string) => {
        // Call the original onSearch handler if provided
        onSearch?.(ticker);
        
        // Navigate to research page with the ticker
        router.push(`/research?ticker=${encodeURIComponent(ticker)}`);
    }, [onSearch, router]);

    return (
        <Box sx={pageHeader.container}>
            <Box sx={pageHeader.breadcrumbSection(collapsed)}>
                <Breadcrumb items={breadcrumbItems} />
            </Box>
            <Box sx={pageHeader.searchSection}>
				<ResearchBar onSelect={handleStockSelect} />
            </Box>
        </Box>
    );
}