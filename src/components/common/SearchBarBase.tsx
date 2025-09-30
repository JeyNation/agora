"use client";

import React from 'react';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { searchBar } from '../../styles/components/search-bar';
import { createPortal } from 'react-dom';

export type Suggestion<T = unknown> = T & { ticker: string; companyName?: string };

type Props<T = unknown> = {
    value: string;
    onChange: (v: string) => void;
    onSelect: (item: Suggestion<T>) => void;
    onSubmit?: (v: string) => void;
    suggestions: Suggestion<T>[];
    loading?: boolean;
    placeholder?: string;
    fullWidth?: boolean;
    minWidth?: number | string;
    maxWidth?: number | string;
    renderSuggestion?: (item: Suggestion<T>, highlighted: boolean) => React.ReactNode;
    className?: string;
};

export default function SearchBarBase<T = unknown>({
    value,
    onChange,
    onSelect,
    onSubmit,
    suggestions,
    loading = false,
    placeholder = 'Search...',
    fullWidth,
    minWidth,
    maxWidth,
    renderSuggestion,
    className,
}: Props<T>) {
    const [mounted, setMounted] = React.useState(false);
    const [showSuggestions, setShowSuggestions] = React.useState(true);
    const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);
    const itemRefs = React.useRef<Record<number, HTMLLIElement | null>>({});
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const [portalPos, setPortalPos] = React.useState<{ left: number; top: number; width: number } | null>(null);

    React.useEffect(() => setMounted(true), []);

    React.useEffect(() => {
        if (!wrapperRef.current) return;
        const update = () => {
            const rect = wrapperRef.current!.getBoundingClientRect();
            setPortalPos({ left: rect.left + window.scrollX, top: rect.bottom + window.scrollY, width: rect.width });
        };
        update();
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, true);
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update, true);
        };
    }, [suggestions.length, value]);

    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            const portalEl = document.getElementById('search-suggestions-portal');
            const target = e.target as Node | null;
            if (wrapperRef.current && wrapperRef.current.contains(target)) return;
            if (portalEl && portalEl.contains(target)) return;
            setShowSuggestions(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    React.useEffect(() => {
        if (highlightedIndex >= 0) {
            const el = itemRefs.current[highlightedIndex];
            if (el && typeof el.scrollIntoView === 'function') {
                el.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [highlightedIndex]);

    if (!mounted) return null;

    return (
        <Paper
            component="form"
            onSubmit={(e) => {
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                    onSelect(suggestions[highlightedIndex]);
                    return;
                }
                onSubmit?.(value);
            }}
            sx={{ ...searchBar.container({ fullWidth, minWidth, maxWidth }) }}
            className={className}
            elevation={0}
        >
            <Box sx={searchBar.searchIcon}>
                <SearchIcon fontSize="small" />
            </Box>
            <Box sx={{ position: 'relative', width: '100%' }} ref={wrapperRef}>
                <input
                    value={value}
                    onChange={(e) => {
                        const v = e.target.value;
                        onChange(v);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => {
                        if (value.trim() !== '') {
                            setShowSuggestions(true);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setShowSuggestions(true);
                            setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
                            return;
                        }
                        if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setShowSuggestions(true);
                            setHighlightedIndex((i) => Math.max(i - 1, 0));
                            return;
                        }
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                                onSelect(suggestions[highlightedIndex]);
                                return;
                            }
                            if (value.trim()) {
                                onSubmit?.(value);
                            }
                            return;
                        }
                        if (e.key === 'Escape') {
                            setShowSuggestions(false);
                            setHighlightedIndex(-1);
                            return;
                        }
                    }}
                    placeholder={placeholder}
                    aria-label={placeholder}
                    style={{ border: 'none', outline: 'none', width: '100%', padding: '8px 12px', fontSize: '0.95rem', background: 'transparent' }}
                />

                {loading && (
                    <Box sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
                        <CircularProgress size={18} />
                    </Box>
                )}

                {suggestions.length > 0 && value.trim() !== '' && showSuggestions && portalPos && createPortal(
                    <Paper id="search-suggestions-portal" sx={{ position: 'absolute', left: portalPos.left, top: portalPos.top, width: portalPos.width, zIndex: (theme) => theme.zIndex.modal + 10 }} elevation={3}>
                        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                            {suggestions.map((s, idx) => {
                                const ticker = (s as Partial<Record<string, unknown>>).ticker as string | undefined;
                                const companyName = (s as Partial<Record<string, unknown>>).companyName as string | undefined;
                                return (
                                <Box
                                    key={ticker ?? idx}
                                    component="li"
                                    ref={(el: HTMLLIElement | null) => { itemRefs.current[idx] = el; return; }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        onSelect(s);
                                    }}
                                    onMouseEnter={() => setHighlightedIndex(idx)}
                                    sx={{ px: 2, py: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }, bgcolor: highlightedIndex === idx ? 'action.selected' : 'transparent' }}
                                >
                                    {renderSuggestion ? renderSuggestion(s, highlightedIndex === idx) : <><strong>{ticker}</strong>&nbsp;-&nbsp;{companyName}</>}
                                </Box>
                                );
                            })}
                        </Box>
                    </Paper>,
                    document.body
                )}
            </Box>
        </Paper>
    );
}
