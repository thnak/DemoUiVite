import type { PageMetadata } from 'src/config/page-metadata';

import { useTranslation } from 'react-i18next';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { searchPages, pageMetadata } from 'src/config/page-metadata';

// ----------------------------------------------------------------------

const SEARCH_HISTORY_KEY = 'search-history';
const MAX_HISTORY_ITEMS = 10;

/**
 * Custom hook for page search functionality
 */
export function usePageSearch() {
  const { i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const currentLanguage = (i18n.language.startsWith('vi') ? 'vi' : 'en') as 'en' | 'vi';

  // Load search history from localStorage
  const initialSearchHistory = useMemo(() => {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse search history:', error);
      }
    }
    return [];
  }, []);

  useEffect(() => {
    setSearchHistory(initialSearchHistory);
  }, [initialSearchHistory]);

  // Save search history to localStorage
  const saveSearchHistory = useCallback((history: string[]) => {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  }, []);

  // Add query to search history
  const addToHistory = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return;

      const newHistory = [
        searchQuery,
        ...searchHistory.filter((item) => item !== searchQuery),
      ].slice(0, MAX_HISTORY_ITEMS);

      setSearchHistory(newHistory);
      saveSearchHistory(newHistory);
    },
    [searchHistory, saveSearchHistory]
  );

  // Clear search history
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }, []);

  // Search results
  const results = useMemo(() => {
    if (!query.trim()) return [];

    let filteredResults = searchPages(query, currentLanguage);

    // Filter by category if selected
    if (selectedCategory !== 'all') {
      filteredResults = filteredResults.filter((page) => page.category === selectedCategory);
    }

    return filteredResults;
  }, [query, selectedCategory, currentLanguage]);

  // Get popular pages (pages without category filtering)
  const popularPages = useMemo(() => {
    const popularPaths = [
      '/analytics',
      '/machines',
      '/products',
      '/users',
      '/dashboard-builder',
      '/area',
      '/downtime-report',
      '/oi/dashboard',
    ];

    return pageMetadata.filter((page) => popularPaths.includes(page.path));
  }, []);

  // Get suggestions based on recent history
  const suggestions = useMemo(() => {
    if (query.trim()) return [];

    return searchHistory
      .map((historyQuery) => {
        const matches = searchPages(historyQuery, currentLanguage);
        return matches.length > 0 ? matches[0] : null;
      })
      .filter((page): page is PageMetadata => page !== null)
      .slice(0, 5);
  }, [query, searchHistory, currentLanguage]);

  return {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    results,
    popularPages,
    suggestions,
    searchHistory,
    addToHistory,
    clearHistory,
    currentLanguage,
  };
}
