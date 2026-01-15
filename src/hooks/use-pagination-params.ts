import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

// ----------------------------------------------------------------------

export interface PaginationParams {
  page: number;
  rowsPerPage: number;
  orderBy: string;
  order: 'asc' | 'desc';
  filterName?: string;
  currentTab?: string;
}

interface UsePaginationParamsOptions {
  defaultPage?: number;
  defaultRowsPerPage?: number;
  defaultOrderBy?: string;
  defaultOrder?: 'asc' | 'desc';
}

export function usePaginationParams(options: UsePaginationParamsOptions = {}) {
  const {
    defaultPage = 0,
    defaultRowsPerPage = 5,
    defaultOrderBy = 'name',
    defaultOrder = 'asc',
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current params from URL
  const params = useMemo<PaginationParams>(() => {
    const page = parseInt(searchParams.get('page') || String(defaultPage), 10);
    const rowsPerPage = parseInt(searchParams.get('rowsPerPage') || String(defaultRowsPerPage), 10);
    const orderBy = searchParams.get('orderBy') || defaultOrderBy;
    const order = (searchParams.get('order') || defaultOrder) as 'asc' | 'desc';
    const filterName = searchParams.get('filterName') || undefined;
    const currentTab = searchParams.get('tab') || undefined;

    return {
      page,
      rowsPerPage,
      orderBy,
      order,
      filterName,
      currentTab,
    };
  }, [searchParams, defaultPage, defaultRowsPerPage, defaultOrderBy, defaultOrder]);

  // Update URL params
  const setParams = useCallback(
    (newParams: Partial<PaginationParams>) => {
      setSearchParams((prev) => {
        const updated = new URLSearchParams(prev);

        // Update each param if provided
        if (newParams.page !== undefined) {
          updated.set('page', String(newParams.page));
        }
        if (newParams.rowsPerPage !== undefined) {
          updated.set('rowsPerPage', String(newParams.rowsPerPage));
        }
        if (newParams.orderBy !== undefined) {
          updated.set('orderBy', newParams.orderBy);
        }
        if (newParams.order !== undefined) {
          updated.set('order', newParams.order);
        }
        if (newParams.filterName !== undefined && newParams.filterName !== '') {
          updated.set('filterName', newParams.filterName);
        } else if (newParams.filterName === '') {
          updated.delete('filterName');
        }
        if (newParams.currentTab !== undefined && newParams.currentTab !== 'all') {
          updated.set('tab', newParams.currentTab);
        } else if (newParams.currentTab === 'all') {
          updated.delete('tab');
        }

        return updated;
      });
    },
    [setSearchParams]
  );

  // Reset page to 0
  const resetPage = useCallback(() => {
    setParams({ page: 0 });
  }, [setParams]);

  // Build URL with current params for navigation
  const getUrlWithParams = useCallback(
    (basePath: string) => {
      const urlParams = new URLSearchParams();
      if (params.page !== defaultPage) {
        urlParams.set('page', String(params.page));
      }
      if (params.rowsPerPage !== defaultRowsPerPage) {
        urlParams.set('rowsPerPage', String(params.rowsPerPage));
      }
      if (params.orderBy !== defaultOrderBy) {
        urlParams.set('orderBy', params.orderBy);
      }
      if (params.order !== defaultOrder) {
        urlParams.set('order', params.order);
      }
      if (params.filterName) {
        urlParams.set('filterName', params.filterName);
      }
      if (params.currentTab && params.currentTab !== 'all') {
        urlParams.set('tab', params.currentTab);
      }

      const queryString = urlParams.toString();
      return queryString ? `${basePath}?${queryString}` : basePath;
    },
    [params, defaultPage, defaultRowsPerPage, defaultOrderBy, defaultOrder]
  );

  return {
    params,
    setParams,
    resetPage,
    getUrlWithParams,
  };
}
