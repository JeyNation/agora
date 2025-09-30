"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Popper, ClickAwayListener } from '@mui/material';
import SearchInput from "../common/SearchInput";
import SuggestionList, { SuggestionItem } from "../common/SuggestionList";
import { useStockSearch } from "../../lib/hooks/useStockSearch";
import type { StockInfo } from "../../lib/types/stock";

interface ResearchBarProps {
  onSelect?: (ticker: string, stockInfo: StockInfo) => void;
  placeholder?: string;
  autoFocus?: boolean;
  fullWidth?: boolean;
  minWidth?: number | string;
  maxWidth?: number | string;
  'data-testid'?: string;
}

export default function ResearchBar({
  onSelect,
  placeholder = 'Search stocks...',
  autoFocus = false,
  fullWidth = false,
  minWidth,
  maxWidth,
  'data-testid': testId,
}: ResearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchInputRef = useRef<HTMLDivElement>(null);

  // Use the existing stock search hook
  const { suggestions: stockSuggestions, loading, error, searchStocks } = useStockSearch();

  // Convert StockInfo to SuggestionItem format
  const suggestions: SuggestionItem[] = stockSuggestions.map((stock) => ({
    id: stock.ticker,
    label: `${stock.ticker} - ${stock.companyName}`,
    value: stock.ticker,
    description: stock.companyName,
  }));

  // Helper function to open suggestions with fresh data
  // This ensures data is refreshed every time the suggestion dropdown is opened
  const openSuggestionsWithRefresh = useCallback(() => {
    if (query.length > 0) {
      // Refresh data when opening suggestions
      searchStocks(query);
      setIsOpen(true);
    }
  }, [query, searchStocks]);

  // Handle input change
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    setActiveIndex(-1);
    
    // Trigger search through the hook
    searchStocks(value);
    
    // Show suggestions if we have a query
    setIsOpen(value.length > 0);
  }, [searchStocks]);

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    openSuggestionsWithRefresh();
  }, [openSuggestionsWithRefresh]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((item: SuggestionItem) => {
    const selectedStock = stockSuggestions.find(stock => stock.ticker === item.value);
    
    setQuery(item.value);
    setIsOpen(false);
    setActiveIndex(-1);
    
    // Call parent callback with selected ticker and stock info
    if (selectedStock) {
      onSelect?.(item.value, selectedStock);
    }
  }, [stockSuggestions, onSelect]);

  // Note: Enter key handling reverted to previous behavior (no exact-match validation here).

  // Handle active index change
  const handleActiveIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Handle click away
  const handleClickAway = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  // Update suggestions visibility when suggestions change
  useEffect(() => {
    if (query.length > 0 && suggestions.length > 0 && document.activeElement?.closest('[data-testid="research-search-input"]')) {
      setIsOpen(true);
    } else if (suggestions.length === 0 && !loading) {
      setIsOpen(false);
    }
  }, [suggestions.length, query.length, loading]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto', }}>
        <Box ref={searchInputRef}>
          <SearchInput
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            autoFocus={autoFocus}
            placeholder={placeholder}
            fullWidth={fullWidth}
            minWidth={minWidth}
            maxWidth={maxWidth}
            data-testid={testId || 'research-search-input'}
          />
        </Box>
        
        <Popper
          open={isOpen}
          anchorEl={searchInputRef.current}
          placement="bottom-start"
          style={{ 
            width: searchInputRef.current?.offsetWidth || 'auto',
            zIndex: 1300,
          }}
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 4],
              },
            },
          ]}
        >
          <SuggestionList
            suggestions={suggestions}
            isOpen={isOpen}
            activeIndex={activeIndex}
            onSelect={handleSuggestionSelect}
            onActiveIndexChange={handleActiveIndexChange}
            emptyMessage={loading ? 'Searching...' : error ? 'Error loading suggestions' : 'No stocks found'}
            data-testid={testId ? `${testId}-suggestions` : 'research-suggestions'}
          />
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
