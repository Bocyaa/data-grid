import { useState, useCallback, useEffect } from 'react';
import type { SearchState, SearchHandlers } from '@/types/dataGrid';
import { DATA_GRID_CONFIG } from '@/config/dataGridConfig';

interface UseSearchProps {
  onSearchChange?: (query: string) => void;
  onPageReset?: () => void;
}

interface UseSearchReturn extends SearchState, SearchHandlers {}

export const useDataGridSearch = ({
  onSearchChange,
  onPageReset,
}: UseSearchProps = {}): UseSearchReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    onPageReset?.();
  }, [onPageReset]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      // Reset to first page when search changes
      if (searchQuery !== debouncedSearchQuery) {
        onPageReset?.();
      }
      // Notify parent of search change
      onSearchChange?.(searchQuery);
    }, DATA_GRID_CONFIG.SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery, onSearchChange, onPageReset]);

  return {
    // State
    searchQuery,
    debouncedSearchQuery,
    // Handlers
    handleSearchChange,
    handleClearSearch,
    setSearchQuery,
    setDebouncedSearchQuery,
  };
};
