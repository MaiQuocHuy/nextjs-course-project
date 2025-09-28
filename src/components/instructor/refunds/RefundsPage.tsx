import { useCallback, useEffect, useMemo, useState } from 'react';

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
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

type RefundStatus = 'ALL' | 'PENDING' | 'COMPLETED' | 'FAILED';
type RefundDateRange = { from: string | null; to: string | null };
type Filters = {
  search: string;
  statusFilter: RefundStatus;
  dateRange: RefundDateRange;
};

const initFilterValues: Filters = {
  search: '',
  statusFilter: 'ALL',
  dateRange: { from: null, to: null },
};

const RefundsPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<Filters>(initFilterValues);
  const [isFiltering, setIsFiltering] = useState(false);

  const apiParams = useMemo(() => {
    const searchQuery = filters.search.trim();
    const statusFilter = filters.statusFilter;
    const dataRange = filters.dateRange;

    return {
      page: currentPage,
      size: itemsPerPage,
      search: searchQuery !== '' ? searchQuery : undefined,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      fromDate: dataRange.from || undefined,
      toDate: dataRange.to || undefined,
    };
  }, [currentPage, itemsPerPage, filters]);

  const {
    data: refundsData,
    isLoading,
    error,
    refetch,
  } = useGetAllRefundsQuery(apiParams);

  // Compute hasActiveFilters
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.statusFilter !== 'ALL' ||
      filters.dateRange.from !== null ||
      filters.dateRange.to !== null
    );
  }, [
    filters.search,
    filters.statusFilter,
    filters.dateRange.from,
    filters.dateRange.to,
  ]);

  const handleSearchChange = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  }, []);

  const handleStatusFilter = useCallback((status: RefundStatus) => {
    setFilters((prev) => ({ ...prev, statusFilter: status }));
  }, []);

  const handleSelectDateRange = useCallback((range: RefundDateRange) => {
    // Check if the from date is after the to date
    if (range.from && range.to && range.from > range.to) {
      toast.error('Invalid date range: From date cannot be after To date');
      return;
    }
    setFilters((prev) => ({ ...prev, dateRange: range }));
  }, []);

  const resetFilters = useCallback(() => {
    setIsFiltering(true);
    setFilters(initFilterValues);
  }, []);

  useEffect(() => {
    setIsFiltering(true);
    setCurrentPage(0); // Reset to first page on filter change
  }, [filters]);

  useEffect(() => {
    if (refundsData) {
      setIsFiltering(false);
    }
  }, [refundsData]);

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
              searchQuery={filters.search}
              onSearchChange={handleSearchChange}
            />
            <div className="lg:flex-1 lg:max-w-none">
              <FilterBar
                statusFilter={filters.statusFilter}
                dateRange={filters.dateRange}
                onStatusFilterChange={(status) => handleStatusFilter(status)}
                onDateRangeChange={(range) => handleSelectDateRange(range)}
                onClearFilters={resetFilters}
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
          {refundsData && refundsData.content.length > 0 ? (
            <div className="space-y-4">
              {/* Refresh button */}
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isLoading || isFiltering}
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>

              {/* Refunds Table */}
              <RefundsTable
                filteredRefunds={refundsData.content}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />

              {/* Pagination */}
              {refundsData &&
                refundsData.page &&
                refundsData.page.totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    pageInfo={refundsData.page || null}
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
