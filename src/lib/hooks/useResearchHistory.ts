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
                // Handle both formats: array and {items: array}
                const parsed = JSON.parse(savedHistory);
                const items = Array.isArray(parsed) ? parsed : (parsed.items || []);
                setHistory(items);
            } catch (e) {
                console.error('Failed to parse research history:', e);
                setHistory([]);
            }
        }
    }, []);

    // Save history to localStorage
    const saveHistory = useCallback((items: ResearchHistoryItem[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.error('Failed to save research history:', e);
        }
    }, []);

    // Add a ticker to history
    const addToHistory = useCallback((ticker: string) => {
        setHistory(currentHistory => {
            const uppercaseTicker = ticker.toUpperCase();
            // Find existing item to preserve pin status
            const existingItem = currentHistory.find(item => item.ticker === uppercaseTicker);
            
            // Remove any existing entry for this ticker
            const filteredHistory = currentHistory.filter(item => item.ticker !== uppercaseTicker);
            
            // Add new entry at the start, preserving pin status if it existed
            const newItem: ResearchHistoryItem = {
                ticker: uppercaseTicker,
                timestamp: Date.now(),
                isPinned: existingItem ? existingItem.isPinned : false
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
            const newHistory = currentHistory.map(item => {
                if (item.ticker === ticker) {
                    return { ...item, isPinned: !item.isPinned };
                }
                return item;
            }).sort((a, b) => {
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