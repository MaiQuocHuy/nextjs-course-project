import { useCallback, useMemo, useState } from "react";

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
  searchQuery: string;
  statusFilter: "ALL" | "PENDING" | "PAID" | "CANCELLED";
  dateRange: { from: string | null; to: string | null };
};

const initFilterValues: Filters = {
  searchQuery: "",
  statusFilter: "ALL",
  dateRange: { from: null, to: null },
};

const params = {
  page: 0,
  size: 10,
};

const AffiliatePayoutPage = () => {
  const [currentPage, setCurrentPage] = useState(params.page);
  const [itemsPerPage, setItemsPerPage] = useState(params.size);
  const [filters, setFilters] = useState<Filters>(initFilterValues);
  const [isFiltering, setIsFiltering] = useState(false);

  const { data, isLoading, error, refetch } = useGetAllAffiliatePayoutsQuery({
    page: currentPage,
    size: itemsPerPage,
  });

  // Compute hasActiveFilters
  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchQuery !== "" ||
      filters.statusFilter !== "ALL" ||
      filters.dateRange.from !== null ||
      filters.dateRange.to !== null
    );
  }, [
    filters.searchQuery,
    filters.statusFilter,
    filters.dateRange.from,
    filters.dateRange.to,
  ]);

  const filteredPayouts = useMemo(() => {
    if (!data?.data?.content || data.data.content.length === 0) {
      return [];
    }

    setIsFiltering(true);

    const result = data.data.content.filter((payout) => {
      // Search: match id, referred by user name, course title, or discount user name
      if (filters.searchQuery !== "") {
        const searchLower = String(filters.searchQuery).toLowerCase();
        const matchesSearch =
          payout.id.toLowerCase().includes(searchLower) ||
          (payout.referredByUser?.name &&
            payout.referredByUser.name.toLowerCase().includes(searchLower)) ||
          (payout.course?.title &&
            payout.course.title.toLowerCase().includes(searchLower)) ||
          (payout.discountUsage?.user?.name &&
            payout.discountUsage.user.name.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (
        filters.statusFilter !== "ALL" &&
        payout.payoutStatus !== filters.statusFilter
      ) {
        return false;
      }

      // Date range filter (use createdAt)
      if (filters.dateRange.from || filters.dateRange.to) {
        const payoutDate = new Date(payout.createdAt);
        if (
          filters.dateRange.from &&
          payoutDate < new Date(filters.dateRange.from)
        ) {
          return false;
        }
        if (
          filters.dateRange.to &&
          payoutDate > new Date(filters.dateRange.to + " 23:59:59")
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
              placeholder="Search by ID, referrer, course, or discount user"
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

      {/* Payouts Table */}
      {isFiltering ? (
        <TableLoadingSkeleton />
      ) : (
        <>
          {filteredPayouts.length > 0 ? (
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

              {/* Payouts Table */}
              <AffiliatePayoutTable filteredPayouts={filteredPayouts} />

              {/* Pagination */}
              {data && data.data.page && data.data.page.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  pageInfo={data.data.page || null}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              )}
            </div>
          ) : (
            <EmptyState
              type={hasActiveFilters ? "no-results" : "no-data"}
              clearFilters={resetFilters}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AffiliatePayoutPage;
