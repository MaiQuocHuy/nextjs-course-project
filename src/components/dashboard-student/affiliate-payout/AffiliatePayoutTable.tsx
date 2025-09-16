"use client";

import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAffiliatePayoutsQuery } from "@/services/student/studentApi";
import { AffiliatePayoutTableHead } from "./AffiliatePayoutTableHead";
import { AffiliatePayoutTableRow } from "./AffiliatePayoutTableRow";
import { Coins } from "lucide-react";
import { AffiliatePayoutMobileCard } from "./AffiliatePayoutMobileCard";
import { AffiliateLoadingSkeleton } from "../ui/Loading";
import { AffiliatePayoutsError } from "../ui/LoadingError";
import {
  CustomPagination,
  usePagination,
} from "@/components/ui/custom-pagination";

export function AffiliatePayoutTable() {
  const {
    data: affiliatePayouts,
    isLoading,
    error,
    refetch,
  } = useGetAffiliatePayoutsQuery();

  // Pagination với 12 affiliate payouts per page
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedAffiliatePayouts,
    handlePageChange,
  } = usePagination(affiliatePayouts?.content || [], 12);

  if (isLoading) {
    return <AffiliateLoadingSkeleton />;
  }

  if (error) {
    return <AffiliatePayoutsError onRetry={refetch} />;
  }

  if (!affiliatePayouts?.content || affiliatePayouts.content.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Affiliate Payout History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Affiliate Payout History
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              You haven't earned any affiliate commissions yet.
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
          <Coins className="h-5 w-5" />
          Affiliate Payout History
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <AffiliatePayoutTableHead />
              <TableBody>
                {paginatedAffiliatePayouts.map((affiliatePayout) => (
                  <AffiliatePayoutTableRow
                    key={affiliatePayout.id}
                    affiliatePayout={affiliatePayout}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden space-y-3">
          {paginatedAffiliatePayouts.map((affiliatePayout) => (
            <AffiliatePayoutMobileCard
              key={affiliatePayout.id}
              affiliatePayout={affiliatePayout}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
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
