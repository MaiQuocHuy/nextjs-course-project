import { useCallback, useMemo, useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SearchBar,
  FilterBar,
  Pagination,
} from "@/components/instructor/affiliate-payout/shared";
import { AffiliatePayoutTable } from "@/components/instructor/affiliate-payout/AffiliatePayoutTable";
import { useGetAllAffiliatePayoutsQuery } from "@/services/instructor/affiliate-payout/affiliate-payout-api";

import { TableLoadingError } from "../refunds/shared/LoadingError";
import { EmptyState } from "../refunds/shared";
import { RefundsSkeleton, TableLoadingSkeleton } from "../refunds/skeletons";

type Filters = {
  search: string;
  status: "PENDING" | "PAID" | "CANCELLED" | null;
  fromDate: string | null;
  toDate: string | null;
};

const initFilterValues: Filters = {
  search: "",
  status: null,
  fromDate: null,
  toDate: null,
};

const params = {
  page: 0,
  size: 10,
};

const AffiliatePayoutPage = () => {
  const [currentPage, setCurrentPage] = useState(params.page);
  const [itemsPerPage, setItemsPerPage] = useState(params.size);
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

  const { data, isLoading, error, refetch } =
    useGetAllAffiliatePayoutsQuery(apiParams);

  // Compute hasActiveFilters
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.status !== null ||
      filters.fromDate !== null ||
      filters.toDate !== null
    );
  }, [filters]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [filters.search, filters.status, filters.fromDate, filters.toDate]);

  // Use data directly from API since filtering is done server-side
  const affiliatePayouts = data?.data?.content || [];

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
            Affiliate Payouts
          </h1>
          <p className="text-muted-foreground">
            Track commission payouts from referral programs
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="px-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <SearchBar
              placeholder="Search by affiliate payout ID, referrer name, course title, or discount code"
              searchQuery={filters.search}
              onSearchChange={handleSearchChange}
            />
            <div className="lg:flex-1 lg:max-w-none">
              <FilterBar
                statusFilter={filters.status || "ALL"}
                dateRange={{ from: filters.fromDate, to: filters.toDate }}
                onStatusFilterChange={(status) => {
                  setFilters((prev) => ({
                    ...prev,
                    status:
                      status === "ALL"
                        ? null
                        : (status as "PENDING" | "PAID" | "CANCELLED"),
                  }));
                  setCurrentPage(0); // Reset to first page when filtering
                }}
                onDateRangeChange={(range) => {
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

      {/* Payouts Table */}
      {affiliatePayouts.length > 0 ? (
        <div className="space-y-4">
          {/* Refetch button */}
          <div>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Refetch
            </Button>
          </div>

          {/* Payouts Table */}
          <AffiliatePayoutTable filteredPayouts={affiliatePayouts} />

          {/* Pagination */}
          {data && data.data.page && data.data.page.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              pageInfo={data.data.page || null}
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
          type={hasActiveFilters ? "no-results" : "no-data"}
          clearFilters={resetFilters}
        />
      )}
    </div>
  );
};

export default AffiliatePayoutPage;
