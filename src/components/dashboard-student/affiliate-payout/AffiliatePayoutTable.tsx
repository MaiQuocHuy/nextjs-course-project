"use client";

import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAffiliatePayoutsQuery } from "@/services/student/studentApi";
import { AffiliatePayoutTableHead } from "./AffiliatePayoutTableHead";
import { AffiliatePayoutTableRow } from "./AffiliatePayoutTableRow";
import { Coins } from "lucide-react";
import { AffiliatePayoutMobileCard } from "./AffiliatePayoutMobileCard";
import { PaymentTableLoadingSkeleton } from "../ui/Loading";
import { PaymentsError } from "../ui/LoadingError";
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
    return <PaymentTableLoadingSkeleton />;
  }

  if (error) {
    return <PaymentsError onRetry={refetch} />;
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
      <CardContent className="p-0 md:p-6">
        {/* Desktop Table */}
        <div className="hidden md:block">
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

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3 p-4">
          {paginatedAffiliatePayouts.map((affiliatePayout) => (
            <AffiliatePayoutMobileCard
              key={affiliatePayout.id}
              affiliatePayout={affiliatePayout}
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
