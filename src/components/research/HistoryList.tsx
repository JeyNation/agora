'use client';

import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import type { ResearchHistoryItem } from '../../lib/types/research';
import { researchStyles } from '../../styles/components';
import HistoryListItem from './HistoryListItem';
import ListDivider from '../common/ListDivider';

interface HistoryListProps {
    items: ResearchHistoryItem[];
    onTogglePin: (ticker: string) => void;
    onRemove: (ticker: string) => void;
    onClearUnpinned: () => void;
    hideControls?: boolean;
}

export default function HistoryList({ 
    items, 
    onTogglePin,
    onRemove,
}: HistoryListProps) {
    const [movingItems, setMovingItems] = useState<Record<string, 'up' | 'down' | null>>({});
    const prevItems = useRef(items);

    // Track item position changes
    useEffect(() => {
        const newMovingItems: Record<string, 'up' | 'down' | null> = {};
        
        items.forEach((item, index) => {
            const prevIndex = prevItems.current.findIndex(
                prevItem => prevItem.ticker === item.ticker
            );
            
            if (prevIndex !== -1 && prevIndex !== index) {
                // Item moved up in the list (towards pinned section)
                if (prevIndex > index) {
                    newMovingItems[item.ticker] = 'up';
                }
                // Item moved down in the list (towards unpinned section)
                else if (prevIndex < index) {
                    newMovingItems[item.ticker] = 'down';
                }
            }
        });

        if (Object.keys(newMovingItems).length > 0) {
            setMovingItems(newMovingItems);
            // Clear animation classes after animation completes
            setTimeout(() => {
                setMovingItems({});
            }, 300); // Match the animation duration
        }

        prevItems.current = items;
    }, [items]);

    if (items.length === 0) {
        return (
            <Box sx={researchStyles.emptyState}>
                <Typography color="text.secondary">
                    No research history yet. Search for a ticker to get started.
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <GlobalStyles styles={researchStyles.globalStyles} />
            <Paper variant="outlined">
                <List sx={researchStyles.list}>
                    {items.map((item, index) => (
                        <React.Fragment key={item.ticker}>
                            <ListDivider show={index > 0} />
                            <HistoryListItem 
                                item={item}
                                isMoving={movingItems[item.ticker]}
                                onTogglePin={onTogglePin}
                                onRemove={onRemove}
                            />
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </>
    );
}