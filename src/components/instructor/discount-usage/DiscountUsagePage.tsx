import { useCallback, useMemo, useState, useEffect } from "react";

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
  search: string;
  type: "REFERRAL" | "GENERAL" | null;
  fromDate: string | null;
  toDate: string | null;
};

const initFilterValues: Filters = {
  search: "",
  type: null,
  fromDate: null,
  toDate: null,
};

const params = {
  page: 0,
  size: 10,
};

const DiscountUsagePage = () => {
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
    if (filters.type) {
      params.type = filters.type;
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
    useGetAllDiscountUsagesQuery(apiParams);

  // Compute hasActiveFilters
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.type !== null ||
      filters.fromDate !== null ||
      filters.toDate !== null
    );
  }, [filters]);

  // Use data directly from API since filtering is done server-side
  const discountUsages = data?.data?.content || [];

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [filters.search, filters.type, filters.fromDate, filters.toDate]);

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
              placeholder="Search by discount usage ID, discount code, user name, or course title"
              searchQuery={filters.search}
              onSearchChange={handleSearchChange}
            />
            <div className="lg:flex-1 lg:max-w-none">
              <FilterBar
                typeFilter={filters.type || "ALL"}
                dateRange={{ from: filters.fromDate, to: filters.toDate }}
                onTypeFilterChange={(type) => {
                  setFilters((prev) => ({
                    ...prev,
                    type:
                      type === "ALL" ? null : (type as "REFERRAL" | "GENERAL"),
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

      {/* Discount Usages Table */}
      {discountUsages.length > 0 ? (
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

          {/* Discount Usages Table */}
          <DiscountUsageTable filteredUsages={discountUsages} />

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

export default DiscountUsagePage;
