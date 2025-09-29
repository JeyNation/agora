'use client';

import React from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import PushPinIcon from '@mui/icons-material/PushPin';
import type { ResearchHistoryItem } from '../../lib/types/research';

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
                                sx={{ 
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    }
                                }}
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