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
import { RefundsSkeleton } from './skeletons/index';
import { TableLoadingError } from './shared/LoadingError';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

type Filters = {
  search: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | null;
  fromDate: string | null;
  toDate: string | null;
};

const initFilterValues: Filters = {
  search: '',
  status: null,
  fromDate: null,
  toDate: null,
};

const RefundsPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<Filters>(initFilterValues);

  const apiParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      size: itemsPerPage,
    };

    if (filters.search.trim()) {
      params.search = filters.search.trim();
    }
    if (filters.status) {
      params.status = filters.status;
    }
    if (filters.fromDate) {
      params.fromDate = filters.fromDate;
    }
    if (filters.toDate) {
      params.toDate = filters.toDate;
    }

    return params;
  }, [currentPage, itemsPerPage, filters]);

  const { data, isLoading, error, refetch } = useGetAllRefundsQuery(apiParams);

  // Compute hasActiveFilters
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.status !== null ||
      filters.fromDate !== null ||
      filters.toDate !== null
    );
  }, [filters]);

  // Use data directly from API since filtering is done server-side
  const refunds = data?.content || [];

  const handleSearchChange = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
    setCurrentPage(0); // Reset to first page when searching
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
              placeholder="Search by refund ID, user name, or reason"
              searchQuery={filters.search}
              onSearchChange={handleSearchChange}
            />
            <div className="lg:flex-1 lg:max-w-none">
              <FilterBar
                statusFilter={filters.status || 'ALL'}
                dateRange={{ from: filters.fromDate, to: filters.toDate }}
                onStatusFilterChange={(status) => {
                  setFilters((prev) => ({
                    ...prev,
                    status:
                      status === 'ALL'
                        ? null
                        : (status as 'PENDING' | 'COMPLETED' | 'FAILED'),
                  }));
                  setCurrentPage(0); // Reset to first page when filtering
                }}
                onDateRangeChange={(range) => {
                  // Check if from date and to date are valid
                  if (range.from && range.to && range.from > range.to) {
                    // Invalid range, ignore the change
                    toast.error("'From Date' cannot be later than 'To Date'");
                    return;
                  }
                  setFilters((prev) => ({
                    ...prev,
                    fromDate: range.from,
                    toDate: range.to,
                  }));
                  setCurrentPage(0); // Reset to first page when filtering
                }}
                onClearFilters={() => {
                  setFilters(initFilterValues);
                  setCurrentPage(0);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refunds Table */}
      {refunds.length > 0 ? (
        <div className="space-y-4">
          {/* Refresh button */}
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>

          {/* Refunds Table */}
          <RefundsTable
            filteredRefunds={refunds}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />

          {/* Pagination */}
          {data && data.page && data.page.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              pageInfo={data.page || null}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newSize) => {
                setItemsPerPage(newSize);
                setCurrentPage(0); // Reset to first page when changing page size
              }}
            />
          )}
        </div>
      ) : (
        <EmptyState
          type={hasActiveFilters ? 'no-results' : 'no-data'}
          clearFilters={resetFilters}
        />
      )}
    </div>
  );
};

export default RefundsPage;
