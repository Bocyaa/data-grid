import { useState, useCallback, useEffect } from 'react';
import type { PaginationState, PaginationHandlers } from '@/types/dataGrid';
import { DATA_GRID_CONFIG } from '@/config/dataGridConfig';

interface UsePaginationProps {
  totalPages?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  onPageChange?: (page: number) => void;
}

interface UsePaginationReturn extends PaginationState, PaginationHandlers {}

export const useDataGridPagination = ({
  totalPages = 1,
  hasPrevPage = false,
  hasNextPage = false,
  onPageChange,
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState('1');
  const [pageSize, setPageSize] = useState(DATA_GRID_CONFIG.DEFAULT_PAGE_SIZE);

  // Handle previous page
  const handlePreviousPage = useCallback(() => {
    if (hasPrevPage) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setPageInputValue(newPage.toString());
      onPageChange?.(newPage);
    }
  }, [hasPrevPage, currentPage, onPageChange]);

  // Handle next page
  const handleNextPage = useCallback(() => {
    if (hasNextPage) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setPageInputValue(newPage.toString());
      onPageChange?.(newPage);
    }
  }, [hasNextPage, currentPage, onPageChange]);

  // Handle page input change
  const handlePageInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Only allow numbers
      if (/^\d*$/.test(value)) {
        setPageInputValue(value);
      }
    },
    []
  );

  // Handle page input submit (Enter key or blur)
  const handlePageInputSubmit = useCallback(() => {
    const pageNumber = parseInt(pageInputValue, 10);

    if (
      !isNaN(pageNumber) &&
      pageNumber >= 1 &&
      pageNumber <= totalPages &&
      pageNumber !== currentPage
    ) {
      // Valid page number within range and different from current
      setCurrentPage(pageNumber);
      onPageChange?.(pageNumber);
    } else {
      // Invalid input, reset to current page
      setPageInputValue(currentPage.toString());
    }
  }, [pageInputValue, totalPages, currentPage, onPageChange]);

  // Handle Enter key press
  const handlePageInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handlePageInputSubmit();
        e.currentTarget.blur(); // Remove focus after submit
      }
    },
    [handlePageInputSubmit]
  );

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      setCurrentPage(1); // Reset to first page when changing page size
      setPageInputValue('1');
      onPageChange?.(1);
    },
    [onPageChange]
  );

  // Update input value when current page changes
  useEffect(() => {
    setPageInputValue(currentPage.toString());
  }, [currentPage]);

  return {
    // State
    currentPage,
    pageInputValue,
    pageSize,
    // Handlers
    handlePreviousPage,
    handleNextPage,
    handlePageInputChange,
    handlePageInputSubmit,
    handlePageInputKeyDown,
    handlePageSizeChange,
    setCurrentPage,
    setPageInputValue,
    setPageSize,
  };
};
