import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for paginated data fetching
 * @param {Function} fetchFunction - Function to fetch data
 * @param {Object} filters - Filters to apply
 * @param {number} initialPage - Initial page number
 * @param {number} pageSize - Number of items per page
 */
export function usePaginatedData(fetchFunction, filters = {}, initialPage = 1, pageSize = 50) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    pageSize,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if filters are applied
  const hasFilters = Object.keys(filters).some(key => {
    const value = filters[key];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    return value !== null && value !== undefined;
  });

  const loadData = useCallback(async (page) => {
    setLoading(true);
    setError(null);

    try {
      // If filters are applied, fetch 3 pages at once for preview
      if (hasFilters) {
        const promises = [1, 2, 3].map(p =>
          fetchFunction(p, pageSize, filters)
        );
        const results = await Promise.all(promises);

        // Combine data from all 3 pages
        const combinedData = results.flatMap(r => r.data);
        setData(combinedData);
        setPagination(results[0].pagination);
      } else {
        // Normal pagination without filters
        const result = await fetchFunction(page, pageSize, filters);
        setData(result.data);
        setPagination(result.pagination);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, pageSize, filters, hasFilters]);

  useEffect(() => {
    loadData(initialPage);
  }, [loadData, initialPage, JSON.stringify(filters)]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      loadData(page);
    }
  }, [loadData, pagination.totalPages]);

  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      goToPage(pagination.currentPage + 1);
    }
  }, [pagination.hasNextPage, pagination.currentPage, goToPage]);

  const previousPage = useCallback(() => {
    if (pagination.hasPreviousPage) {
      goToPage(pagination.currentPage - 1);
    }
  }, [pagination.hasPreviousPage, pagination.currentPage, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(pagination.totalPages);
  }, [pagination.totalPages, goToPage]);

  return {
    data,
    pagination,
    loading,
    error,
    hasFilters,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    reload: () => loadData(pagination.currentPage),
  };
}
