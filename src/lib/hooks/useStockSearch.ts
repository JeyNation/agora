'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { StockInfo } from '../types/stock';

const DEBOUNCE_MS = 200;

export function useStockSearch() {
    const [suggestions, setSuggestions] = useState<StockInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // refs for debounce timer and abort controller for the in-flight suggestions request
    const timerRef = useRef<number | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    // Debounced search for suggestions. Cancels previous timer and any in-flight fetch.
    const searchStocks = useCallback((query: string) => {
        // clear previous timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        // If empty query, cancel any in-flight request and clear suggestions immediately
        if (!query.trim()) {
            if (abortRef.current) {
                abortRef.current.abort();
                abortRef.current = null;
            }
            setSuggestions([]);
            setLoading(false);
            setError(null);
            return;
        }

        // schedule a debounced fetch
        timerRef.current = window.setTimeout(async () => {
            // Abort previous fetch if still running
            if (abortRef.current) {
                abortRef.current.abort();
            }
            const controller = new AbortController();
            abortRef.current = controller;

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch suggestions');
                }

                const data = await response.json();
                setSuggestions(data.results || []);
            } catch (err) {
                // ignore abort errors
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((err as any)?.name === 'AbortError') {
                    return;
                }
                setError(err instanceof Error ? err.message : 'An error occurred');
                setSuggestions([]);
            } finally {
                setLoading(false);
                // clear abortRef if it points to our controller
                if (abortRef.current === controller) {
                    abortRef.current = null;
                }
            }
        }, DEBOUNCE_MS);
    }, []);

    // validateTicker should perform an immediate request (no debounce) and use its own AbortController
    const validateTicker = useCallback(async (query: string): Promise<StockInfo | null> => {
        const q = query.trim();
        if (!q) return null;

        const controller = new AbortController();
        try {
            const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(q)}`, {
                signal: controller.signal,
            });
            if (!response.ok) {
                throw new Error('Failed to validate ticker');
            }
            const data = await response.json();
            const results: StockInfo[] = data.results || [];
            const match = results.find(r => r.ticker.toUpperCase() === q.toUpperCase()) ?? null;
            return match;
        } catch (err) {
             
            console.error(err);
            return null;
        }
    }, []);

    // cleanup on unmount: clear timer and abort any in-flight request
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            if (abortRef.current) {
                abortRef.current.abort();
                abortRef.current = null;
            }
        };
    }, []);

    return {
        suggestions,
        loading,
        error,
        searchStocks,
        validateTicker,
    };
}