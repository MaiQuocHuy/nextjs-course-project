"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetPaymentsQuery,
  useGetPaymentStatisticsQuery,
} from "@/services/student/studentApi";
import {
  DollarSign,
  CreditCard,
  Calendar,
  TrendingUp,
  CircleCheckBig,
  CircleX,
} from "lucide-react";
import { StatsLoadingSkeleton } from "../ui/Loading";
import { StatsError } from "../ui/LoadingError";

export function PaymentStats() {
  const {
    data: payments,
    isLoading,
    error,
    refetch,
  } = useGetPaymentStatisticsQuery();

  const stats = payments || null;

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
      {/* Total Amount */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">
            {formatCurrency(stats.totalAmountSpent)}
          </div>
          <p className="text-xs text-muted-foreground">
            From completed payments
          </p>
        </CardContent>
      </Card>

      {/* Total Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">
            {stats.totalPayments}
          </div>
          <p className="text-xs text-muted-foreground">
            All payment transactions
          </p>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Completed payments
          </CardTitle>
          <CircleCheckBig className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-green-600">
            {stats.completedPayments}
          </div>
          <p className="text-xs text-muted-foreground">
            Successful transactions
          </p>
        </CardContent>
      </Card>

      {/* Latest Payment */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed payments</CardTitle>
          <CircleX className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-base md:text-lg font-bold text-red-600">
            {stats.failedPayments}
          </div>
          <p className="text-xs text-muted-foreground">
            Unsuccessful transactions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
