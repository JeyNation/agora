"use client";

import React, { useEffect, useRef } from 'react';
import { Paper, List, ListItem, ListItemText, Typography } from '@mui/material';
import { searchBar } from '../../styles/components';

export interface SuggestionItem {
  id: string | number;
  label: string;
  value: string;
  description?: string;
}

interface SuggestionListProps {
  suggestions: SuggestionItem[];
  isOpen: boolean;
  activeIndex: number;
  onSelect: (item: SuggestionItem) => void;
  onActiveIndexChange: (index: number) => void;
  maxHeight?: number;
  emptyMessage?: string;
  'data-testid'?: string;
}

export default function SuggestionList({
  suggestions,
  isOpen,
  activeIndex,
  onSelect,
  onActiveIndexChange,
  maxHeight = 300,
  emptyMessage = 'No suggestions found',
  'data-testid': testId,
}: SuggestionListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const activeItemRef = useRef<HTMLLIElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || suggestions.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          const nextIndex = activeIndex < suggestions.length - 1 ? activeIndex + 1 : 0;
          onActiveIndexChange(nextIndex);
          break;

        case 'ArrowUp':
          event.preventDefault();
          const prevIndex = activeIndex > 0 ? activeIndex - 1 : suggestions.length - 1;
          onActiveIndexChange(prevIndex);
          break;

        case 'Enter':
          event.preventDefault();
          if (activeIndex >= 0 && activeIndex < suggestions.length) {
            onSelect(suggestions[activeIndex]);
          }
          break;

        case 'Escape':
          event.preventDefault();
          onActiveIndexChange(-1);
          break;

        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, activeIndex, suggestions, onActiveIndexChange, onSelect]);

  // Scroll active item into view
  useEffect(() => {
    if (activeItemRef.current && isOpen) {
      activeItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [activeIndex, isOpen]);

  if (!isOpen || suggestions.length === 0) {
    if (!isOpen) return null;
    
    return (
      <Paper sx={{ ...searchBar.suggestion.container, maxHeight }} data-testid={testId}>
        <List sx={searchBar.suggestion.list}>
          <ListItem sx={searchBar.suggestion.listItem}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  {emptyMessage}
                </Typography>
              }
            />
          </ListItem>
        </List>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        ...searchBar.suggestion.container,
        maxHeight,
        overflow: 'auto',
      }}
      data-testid={testId}
    >
      <List ref={listRef} sx={searchBar.suggestion.list}>
        {suggestions.map((item, index) => (
          <ListItem
            key={item.id}
            ref={index === activeIndex ? activeItemRef : null}
            sx={{
              ...searchBar.suggestion.listItem,
              ...(index === activeIndex ? searchBar.suggestion.listItemActive : {}),
            }}
            onClick={() => onSelect(item)}
            onMouseEnter={() => onActiveIndexChange(index)}
          >
            <ListItemText
              primary={
                <Typography variant="body2" color="text.primary">
                  {item.label}
                </Typography>
              }
              secondary={
                item.description && (
                  <Typography variant="caption" color="text.secondary">
                    {item.description}
                  </Typography>
                )
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}