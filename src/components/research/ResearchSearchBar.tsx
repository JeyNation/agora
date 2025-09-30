"use client";

import React from 'react';
import SearchBarBase, { Suggestion } from '../common/SearchBarBase';
import { useStockSearch } from '../../lib/hooks/useStockSearch';
import Toast from '../common/Toast';
import type { StockInfo } from '../../lib/types/stock';

type Props = {
    onSearch?: (query: string) => void;
    placeholder?: string;
    fullWidth?: boolean;
    minWidth?: number | string;
    maxWidth?: number | string;
    className?: string;
};

export default function ResearchSearchBar({ onSearch, placeholder, fullWidth, minWidth, maxWidth, className }: Props) {
    const [value, setValue] = React.useState('');
    const { suggestions, loading, searchStocks, validateTicker } = useStockSearch();
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState<string | null>(null);

    React.useEffect(() => {
        // keep suggestions in sync with input changes
        if (value.trim() !== '') {
            searchStocks(value);
        }
    }, [value, searchStocks]);

    const handleSelect = React.useCallback((item: Suggestion<StockInfo>) => {
        const ticker = item.ticker;
        onSearch?.(ticker);
        setValue('');
    }, [onSearch]);

    const handleSubmit = React.useCallback(async (q: string) => {
        const trimmed = q.trim();
        if (!trimmed) return;
        const match = await validateTicker(trimmed);
        if (match) {
            onSearch?.(trimmed);
            setValue('');
        } else {
            setSnackbarMsg(`${trimmed} not found`);
            setSnackbarOpen(true);
        }
    }, [onSearch, validateTicker]);

    return (
        <>
            <SearchBarBase<StockInfo>
                value={value}
                onChange={setValue}
                onSelect={handleSelect}
                onSubmit={handleSubmit}
                suggestions={suggestions}
                loading={loading}
                placeholder={placeholder}
                fullWidth={fullWidth}
                minWidth={minWidth}
                maxWidth={maxWidth}
                className={className}
            />
            <Toast open={snackbarOpen} message={snackbarMsg} onClose={() => setSnackbarOpen(false)} severity="error" />
        </>
    );
}
