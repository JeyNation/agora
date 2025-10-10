'use client';

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ResearchHistoryItem } from '../../lib/types/research';
import { researchStyles } from '../../styles/components';
import { Stack } from '@mui/material';

interface HistoryListItemProps {
    item: ResearchHistoryItem;
    isMoving?: 'up' | 'down' | null;
    onTogglePin: (ticker: string) => void;
    onRemove: (ticker: string) => void;
}

export default function HistoryListItem({
    item,
    isMoving,
    onTogglePin,
    onRemove
}: HistoryListItemProps) {
    return (
        <ListItem
            component={Link}
            href={`/research/${item.ticker.toLowerCase()}`}
            className={isMoving ? `moving-${isMoving}` : ''}
            sx={researchStyles.listItem}
        >
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				width="100%"
			>
				<ListItemText
					primary={item.ticker}
					secondary={format(item.timestamp, 'MMM d, yyyy h:mm a')}
				/>
					<Tooltip title={item.isPinned ? "Unpin" : "Pin"}>
						<IconButton 
							edge="end" 
							onClick={(e) => {
								e.preventDefault();
								onTogglePin(item.ticker);
							}}
							sx={{ 
								...researchStyles.listItemControl,
								color: item.isPinned ? 'primary.main' : 'inherit'
							}}
						>
							<PushPinIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Remove">
						<IconButton
							edge="end"
							onClick={(e) => {
								e.preventDefault();
								onRemove(item.ticker);
							}}
							sx={{
								...researchStyles.listItemControl,
								color: 'inherit',
								'&:hover': { color: 'error.main' },
							}}
						>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
			</Stack>
        </ListItem>
    );
}