'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import DeleteIcon from '@mui/icons-material/Delete';
import PushPinIcon from '@mui/icons-material/PushPin';
import type { ResearchHistoryItem } from '../../lib/types/research';
import { researchHistoryStyles } from '../../styles/components/research-history';

interface ResearchHistoryListProps {
    items: ResearchHistoryItem[];
    onTogglePin: (ticker: string) => void;
    onRemove: (ticker: string) => void;
    onClearUnpinned: () => void;
}

export default function ResearchHistoryList({ 
    items, 
    onTogglePin, 
    onRemove,
    onClearUnpinned
}: ResearchHistoryListProps) {
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
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    No research history yet. Search for a ticker to get started.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <GlobalStyles styles={researchHistoryStyles.globalStyles} />
            
            <Box sx={{ 
                mb: 2, 
                display: 'flex', 
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 2
            }}>
                <Typography variant="caption" color="text.secondary">
                    {items.length} item{items.length !== 1 ? 's' : ''}
                </Typography>
                {items.some(item => !item.isPinned) && (
                    <Button 
                        size="small" 
                        onClick={onClearUnpinned}
                    >
                        Clear Unpinned
                    </Button>
                )}
            </Box>

            <Paper variant="outlined">
                <List sx={{ p: 0 }}>
                    {items.map((item, index) => (
                        <React.Fragment key={item.ticker}>
                            {index > 0 && <Box sx={{ mx: 2 }}><Box sx={{ borderBottom: 1, borderColor: 'divider' }} /></Box>}
                            <ListItem 
                                component={Link}
                                href={`/research?ticker=${item.ticker}`}
                                className={
                                    movingItems[item.ticker] 
                                        ? `moving-${movingItems[item.ticker]}` 
                                        : ''
                                }
                                sx={researchHistoryStyles.listItem}
                            >
                                <ListItemText
                                    primary={item.ticker}
                                    secondary={format(item.timestamp, 'MMM d, yyyy h:mm a')}
                                />
                                <ListItemSecondaryAction>
                                    <Tooltip title={item.isPinned ? "Unpin" : "Pin"}>
                                        <IconButton 
                                            edge="end" 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onTogglePin(item.ticker);
                                            }}
                                            sx={{ 
                                                mr: 1,
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
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </Box>
    );
}