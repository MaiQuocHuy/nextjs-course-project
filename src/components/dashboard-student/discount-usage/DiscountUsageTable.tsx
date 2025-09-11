"use client";

import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDiscountUsagesQuery } from "@/services/student/studentApi";
import { DiscountUsageTableHead } from "./DiscountUsageTableHead";
import { DiscountUsageTableRow } from "./DiscountUsageTableRow";
import { Tag } from "lucide-react";
import { DiscountUsageMobileCard } from "./DiscountUsageMobileCard";
import { PaymentTableLoadingSkeleton } from "../ui/Loading";
import { PaymentsError } from "../ui/LoadingError";
import {
  CustomPagination,
  usePagination,
} from "@/components/ui/custom-pagination";

export function DiscountUsageTable() {
  const {
    data: discountUsages,
    isLoading,
    error,
    refetch,
  } = useGetDiscountUsagesQuery();

  // Pagination với 12 discount usages per page
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedDiscountUsages,
    handlePageChange,
  } = usePagination(discountUsages?.content || [], 12);

  if (isLoading) {
    return <PaymentTableLoadingSkeleton />;
  }

  if (error) {
    return <PaymentsError onRetry={refetch} />;
  }

  if (!discountUsages?.content || discountUsages.content.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Discount Usage History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Discount Usage History
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              You haven't used any discount codes yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Discount Usage History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 md:p-6">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <DiscountUsageTableHead />
            <TableBody>
              {paginatedDiscountUsages.map((discountUsage) => (
                <DiscountUsageTableRow
                  key={discountUsage.id}
                  discountUsage={discountUsage}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3 p-4">
          {paginatedDiscountUsages.map((discountUsage) => (
            <DiscountUsageMobileCard
              key={discountUsage.id}
              discountUsage={discountUsage}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 px-4 md:px-0">
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
