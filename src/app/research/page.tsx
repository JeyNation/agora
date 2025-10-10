'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HistoryList from '../../components/research/HistoryList';
import { useResearchHistory } from '../../lib/hooks/useResearchHistory';
import { researchStyles } from '../../styles/components';
import { Tooltip } from '@mui/material';

export default function ResearchPage() {

    const { 
        history,
        togglePin,
        removeFromHistory,
        clearUnpinnedHistory,
    } = useResearchHistory();

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
        </Box>
    );
}