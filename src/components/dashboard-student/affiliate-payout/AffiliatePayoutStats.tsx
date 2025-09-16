"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAffiliatePayoutStatsQuery } from "@/services/student/studentApi";
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { StatsLoadingSkeleton } from "../ui/Loading";
import { StatsError } from "../ui/LoadingError";

export function AffiliatePayoutStats() {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useGetAffiliatePayoutStatsQuery();

  if (isLoading) {
    return <StatsLoadingSkeleton />;
  }

  if (error) {
    return <StatsError onRetry={refetch} />;
  }

  if (!stats) {
    return (
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">No Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Commission */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Commission
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">
            {formatCurrency(stats.totalCommissionAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalPayouts} total payouts
          </p>
        </CardContent>
      </Card>

      {/* Pending Commission */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Commission
          </CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-yellow-600">
            {formatCurrency(stats.pendingCommissionAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingPayouts} pending payouts
          </p>
        </CardContent>
      </Card>

      {/* Paid Commission */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid Commission</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-green-600">
            {formatCurrency(stats.paidCommissionAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.paidPayouts} paid payouts
          </p>
        </CardContent>
      </Card>

      {/* Cancelled Commission */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Cancelled Commission
          </CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-red-600">
            {formatCurrency(stats.cancelledCommissionAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.cancelledPayouts} cancelled payouts
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
