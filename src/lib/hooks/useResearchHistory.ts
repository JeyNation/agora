'use client';

import { useState, useCallback, useEffect } from 'react';
import type { ResearchHistoryItem } from '../types/research';
import { 
    MAX_HISTORY_ITEMS, 
    RESEARCH_HISTORY_STORAGE_KEY 
} from '../../app/constants/researchConstants';

export function useResearchHistory() {
    const [history, setHistory] = useState<ResearchHistoryItem[]>([]);

    // Load history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem(RESEARCH_HISTORY_STORAGE_KEY);
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
            localStorage.setItem(RESEARCH_HISTORY_STORAGE_KEY, JSON.stringify(items));
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
            
            // Add new entry at the start, preserving pin status
            const newItem: ResearchHistoryItem = {
                ticker: uppercaseTicker,
                timestamp: Date.now(),
                isPinned: existingItem ? existingItem.isPinned : false,
            };

            // First, combine new item with filtered history
            let newHistory = [newItem, ...filteredHistory];

            // Sort items: pinned first, then by timestamp
            newHistory = newHistory.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return b.timestamp - a.timestamp;
            });

            // If we have more than MAX_HISTORY_ITEMS, remove oldest unpinned items
            if (newHistory.length > MAX_HISTORY_ITEMS) {
                // Keep all pinned items
                const pinnedItems = newHistory.filter(item => item.isPinned);
                const unpinnedItems = newHistory.filter(item => !item.isPinned);
                
                // Calculate how many unpinned items we can keep
                const remainingSlots = MAX_HISTORY_ITEMS - pinnedItems.length;
                
                // Take the most recent unpinned items up to remainingSlots
                const keptUnpinnedItems = unpinnedItems.slice(0, Math.max(0, remainingSlots));
                
                // Combine pinned and kept unpinned items
                newHistory = [...pinnedItems, ...keptUnpinnedItems];
            }

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
        clearUnpinnedHistory,
    };
}