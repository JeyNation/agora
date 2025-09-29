'use client';

import { useState, useCallback, useEffect } from 'react';
import type { ResearchHistoryItem, ResearchHistory } from '../types/research';

const STORAGE_KEY = 'research_history';
const MAX_HISTORY_ITEMS = 50;

export function useResearchHistory() {
    const [history, setHistory] = useState<ResearchHistoryItem[]>([]);

    // Load history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem(STORAGE_KEY);
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                setHistory(parsed.items || []);
            } catch (e) {
                console.error('Failed to parse research history:', e);
                setHistory([]);
            }
        }
    }, []);

    // Save history to localStorage
    const saveHistory = useCallback((items: ResearchHistoryItem[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
            setHistory(items);
        } catch (e) {
            console.error('Failed to save research history:', e);
        }
    }, []);

    // Add a ticker to history
    const addToHistory = useCallback((ticker: string) => {
        setHistory(currentHistory => {
            // Remove any existing entry for this ticker
            const filteredHistory = currentHistory.filter(item => item.ticker !== ticker);
            
            // Add new entry at the start
            const newItem: ResearchHistoryItem = {
                ticker: ticker.toUpperCase(),
                timestamp: Date.now(),
                isPinned: false
            };

            // Put pinned items first, followed by unpinned items sorted by timestamp
            const newHistory = [newItem, ...filteredHistory]
                .sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return b.timestamp - a.timestamp;
                })
                .slice(0, MAX_HISTORY_ITEMS);

            saveHistory(newHistory);
            return newHistory;
        });
    }, [saveHistory]);

    // Toggle pin status
    const togglePin = useCallback((ticker: string) => {
        setHistory(currentHistory => {
            const newHistory = currentHistory.map(item => 
                item.ticker === ticker 
                    ? { ...item, isPinned: !item.isPinned }
                    : item
            ).sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return b.timestamp - a.timestamp;
            });

            saveHistory(newHistory);
            return newHistory;
        });
    }, [saveHistory]);

    // Remove from history
    const removeFromHistory = useCallback((ticker: string) => {
        setHistory(currentHistory => {
            const newHistory = currentHistory.filter(item => item.ticker !== ticker);
            saveHistory(newHistory);
            return newHistory;
        });
    }, [saveHistory]);

    // Clear all unpinned history
    const clearUnpinnedHistory = useCallback(() => {
        setHistory(currentHistory => {
            const newHistory = currentHistory.filter(item => item.isPinned);
            saveHistory(newHistory);
            return newHistory;
        });
    }, [saveHistory]);

    return {
        history,
        addToHistory,
        togglePin,
        removeFromHistory,
        clearUnpinnedHistory
    };
}