import { useCallback, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SearchBar,
  FilterBar,
  Pagination,
} from "@/components/instructor/discount-usage/shared";
import { DiscountUsageTable } from "@/components/instructor/discount-usage/DiscountUsageTable";
import { useGetAllDiscountUsagesQuery } from "@/services/instructor/discount-usage/discount-usage-api";
import { EmptyState } from "../refunds/shared";
import { TableLoadingError } from "../refunds/shared/LoadingError";
import { RefundsSkeleton, TableLoadingSkeleton } from "../refunds/skeletons";

type Filters = {
  searchQuery: string;
  typeFilter: "ALL" | "REFERRAL" | "GENERAL";
  dateRange: { from: string | null; to: string | null };
};

const initFilterValues: Filters = {
  searchQuery: "",
  typeFilter: "ALL",
  dateRange: { from: null, to: null },
};

const params = {
  page: 0,
  size: 10,
};

const DiscountUsagePage = () => {
  const [currentPage, setCurrentPage] = useState(params.page);
  const [itemsPerPage, setItemsPerPage] = useState(params.size);
  const [filters, setFilters] = useState<Filters>(initFilterValues);
  const [isFiltering, setIsFiltering] = useState(false);

  const { data, isLoading, error, refetch } = useGetAllDiscountUsagesQuery({
    page: currentPage,
    size: itemsPerPage,
  });

  // Compute hasActiveFilters
  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchQuery !== "" ||
      filters.typeFilter !== "ALL" ||
      filters.dateRange.from !== null ||
      filters.dateRange.to !== null
    );
  }, [
    filters.searchQuery,
    filters.typeFilter,
    filters.dateRange.from,
    filters.dateRange.to,
  ]);

  const filteredUsages = useMemo(() => {
    if (!data?.data?.content || data.data.content.length === 0) {
      return [];
    }

    setIsFiltering(true);

    const result = data.data.content.filter((usage) => {
      // Search: match id, discount code, user name, course title
      if (filters.searchQuery !== "") {
        const searchLower = String(filters.searchQuery).toLowerCase();
        const matchesSearch =
          usage.id.toLowerCase().includes(searchLower) ||
          (usage.discount?.code &&
            usage.discount.code.toLowerCase().includes(searchLower)) ||
          (usage.user?.name &&
            usage.user.name.toLowerCase().includes(searchLower)) ||
          (usage.course?.title &&
            usage.course.title.toLowerCase().includes(searchLower)) ||
          (usage.referredByUser?.name &&
            usage.referredByUser.name.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Type filter
      if (
        filters.typeFilter !== "ALL" &&
        usage.discount.type !== filters.typeFilter
      ) {
        return false;
      }

      // Date range filter (use usedAt)
      if (filters.dateRange.from || filters.dateRange.to) {
        const usageDate = new Date(usage.usedAt);
        if (
          filters.dateRange.from &&
          usageDate < new Date(filters.dateRange.from)
        ) {
          return false;
        }
        if (
          filters.dateRange.to &&
          usageDate > new Date(filters.dateRange.to + " 23:59:59")
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
            Discount Usages
          </h1>
          <p className="text-muted-foreground">
            Track discount code usages for your courses
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="px-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <SearchBar
              placeholder="Search by ID, discount code, user, or course"
              searchQuery={filters.searchQuery}
              onSearchChange={handleSearchChange}
            />
            <div className="lg:flex-1 lg:max-w-none">
              <FilterBar
                typeFilter={filters.typeFilter}
                dateRange={filters.dateRange}
                onTypeFilterChange={(type) => {
                  setFilters((prev) => ({ ...prev, typeFilter: type }));
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

      {/* Discount Usages Table */}
      {isFiltering ? (
        <TableLoadingSkeleton />
      ) : (
        <>
          {filteredUsages.length > 0 ? (
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

              {/* Discount Usages Table */}
              <DiscountUsageTable filteredUsages={filteredUsages} />

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

export default DiscountUsagePage;
