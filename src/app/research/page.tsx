'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toast from '../../components/common/Toast';
import HistoryList from '../../components/research/HistoryList';
import { useResearchHistory } from '../../lib/hooks/useResearchHistory';
import { researchStyles } from '../../styles/components';
import { Tooltip, Typography } from '@mui/material';
import { searchStocks } from '../../lib/services/stock-search';

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
    const [error, setError] = React.useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    // Add to history when ticker is provided
	// Verify ticker exists in our data before adding to history
	React.useEffect(() => {
		if (!ticker) return;

		const results = searchStocks(ticker);
		if (results.length > 0) {
			setError(null);
			addToHistory(ticker);
		} else {
			const msg = `${ticker} not found`;
			setError(msg);
			setSnackbarOpen(true);
		}
	}, [ticker, addToHistory]);

	const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') return;
		setSnackbarOpen(false);
	};

    // If ticker is provided, show research details
    if (ticker) {
        return (
            <Box maxWidth="xl" sx={researchStyles.container}>
                <Typography variant="h6">
					{ticker}
				</Typography>
            </Box>
        );
    }

    return (
        <Box maxWidth="xl" sx={researchStyles.container}>
			<Box sx={researchStyles.panelLayout}>
				<Box sx={researchStyles.panel}>
					<Box sx={researchStyles.header}>
						{history.length > 0 && (
							<Tooltip title="Clear all unpinned history items">
								<Button
									size="small"
									onClick={clearUnpinnedHistory}
									disabled={!history.some(item => !item.isPinned)}
									sx={researchStyles.headerControl}
								>
									Clear
								</Button>
							</Tooltip>
						)}
					</Box>
					<HistoryList 
						items={history}
						onTogglePin={togglePin}
						onRemove={removeFromHistory}
						onClearUnpinned={clearUnpinnedHistory}
					/>
				</Box>
			</Box>
            <Toast open={snackbarOpen} message={error} onClose={handleCloseSnackbar} severity="error" />
        </Box>
    );
}