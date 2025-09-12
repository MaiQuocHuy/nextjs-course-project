import { useCallback, useMemo, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  SearchBar,
  FilterBar,
  Pagination,
  EmptyState,
} from '@/components/instructor/refunds/shared';
import { RefundsTable } from '@/components/instructor/refunds/RefundsTable';
import { useGetAllRefundsQuery } from '@/services/instructor/refunds/refunds-ins-api';
import { TableLoadingSkeleton, RefundsSkeleton } from './skeletons/index';
import { TableLoadingError } from './shared/LoadingError';

type Filters = {
  searchQuery: string;
  statusFilter: 'ALL' | 'PENDING' | 'COMPLETED' | 'FAILED';
  dateRange: { from: string | null; to: string | null };
};

const initFilterValues: Filters = {
  searchQuery: '',
  statusFilter: 'ALL',
  dateRange: { from: null, to: null },
};

const params = {
  page: 0,
  size: 10,
};

const RefundsPage = () => {
  const [currentPage, setCurrentPage] = useState(params.page);
  const [itemsPerPage, setItemsPerPage] = useState(params.size);
  const [filters, setFilters] = useState<Filters>(initFilterValues);
  const [isFiltering, setIsFiltering] = useState(false);

  const { data, isLoading, error, refetch } = useGetAllRefundsQuery({
    page: currentPage,
    size: itemsPerPage,
  });

  // Compute hasActiveFilters
  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchQuery !== '' ||
      filters.statusFilter !== 'ALL' ||
      filters.dateRange.from !== null ||
      filters.dateRange.to !== null
    );
  }, [
    filters.searchQuery,
    filters.statusFilter,
    filters.dateRange.from,
    filters.dateRange.to,
  ]);

  const filteredRefunds = useMemo(() => {
    if (!data?.content || data.content.length === 0) {
      return [];
    }

    setIsFiltering(true);

    const result = data.content.filter((refund) => {
      // Search: match id, payment id, or reason
      if (filters.searchQuery !== '') {
        const searchLower = String(filters.searchQuery).toLowerCase();
        const matchesSearch =
          refund.id.toLowerCase().includes(searchLower) ||
          (refund.payment?.user?.name &&
            refund.payment.user.name.toLowerCase().includes(searchLower)) ||
          (refund.payment?.id &&
            refund.payment.id.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (
        filters.statusFilter !== 'ALL' &&
        refund.status !== filters.statusFilter
      ) {
        return false;
      }

      // Date range filter (use requestedAt)
      if (filters.dateRange.from || filters.dateRange.to) {
        const refundDate = new Date(refund.requestedAt);
        if (
          filters.dateRange.from &&
          refundDate < new Date(filters.dateRange.from)
        ) {
          return false;
        }
        if (
          filters.dateRange.to &&
          refundDate > new Date(filters.dateRange.to + ' 23:59:59')
        ) {
          return false;
        }
      }

      return true;
    });

    setIsFiltering(false);
    return result;
  }, [data, filters]);

  const handleSearchChange = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initFilterValues);
  }, []);

  if (isLoading) {
    return <RefundsSkeleton />;
  }

  if (error) {
    return <TableLoadingError onRetry={() => refetch()} />;
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Refunds Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and process refund requests
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="px-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <SearchBar
              placeholder="Search by refund id or student's name"
              searchQuery={filters.searchQuery}
              onSearchChange={handleSearchChange}
            />
            <div className="lg:flex-1 lg:max-w-none">
              <FilterBar
                statusFilter={filters.statusFilter}
                dateRange={filters.dateRange}
                onStatusFilterChange={(status) => {
                  setFilters((prev) => ({ ...prev, statusFilter: status }));
                }}
                onDateRangeChange={(range) => {
                  setFilters((prev) => ({ ...prev, dateRange: range }));
                }}
                onClearFilters={() => {
                  setFilters(initFilterValues);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refunds Table */}
      {isFiltering ? (
        <TableLoadingSkeleton />
      ) : (
        <>
          {filteredRefunds.length > 0 ? (
            <div className="space-y-4">
              {/* Refetch button */}
              <div>
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  disabled={isLoading || isFiltering}
                >
                  Refetch
                </Button>
              </div>

              {/* Refunds Table */}
              <RefundsTable filteredRefunds={filteredRefunds} />

              {/* Pagination */}
              {data && data.page && data.page.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  pageInfo={data.page || null}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              )}
            </div>
          ) : (
            <EmptyState
              type={hasActiveFilters ? 'no-results' : 'no-data'}
              clearFilters={resetFilters}
            />
          )}
        </>
      )}
    </div>
  );
};

export default RefundsPage;
