'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ResearchHistoryList from '../../components/research/ResearchHistoryList';
import { useResearchHistory } from '../../lib/hooks/useResearchHistory';

export default function ResearchPage() {
    const searchParams = useSearchParams();
    const ticker = searchParams.get('ticker')?.toUpperCase();
    const { 
        history,
        togglePin,
        removeFromHistory,
        clearUnpinnedHistory,
        addToHistory
    } = useResearchHistory();

    // Add to history when ticker is provided
    React.useEffect(() => {
        if (ticker) {
            addToHistory(ticker);
        }
    }, [ticker, addToHistory]);

    // If ticker is provided, show research details
    if (ticker) {
        return (
            <Container maxWidth="lg" sx={{ py: 3 }}>
                Research details for: {ticker}
                {/* TODO: Add research details components */}
            </Container>
        );
    }

    // Otherwise show research history
    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <ResearchHistoryList 
                items={history}
                onTogglePin={togglePin}
                onRemove={removeFromHistory}
                onClearUnpinned={clearUnpinnedHistory}
            />
        </Container>
    );
}