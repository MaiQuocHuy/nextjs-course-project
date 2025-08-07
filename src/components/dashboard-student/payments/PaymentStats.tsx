"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPaymentsQuery } from "@/services/student/studentApi";
import { DollarSign, CreditCard, Calendar, TrendingUp } from "lucide-react";
import { StatsLoadingSkeleton } from "../ui/Loading";
import { StatsError } from "../ui/LoadingError";

export function PaymentStats() {
  const { data: payments, isLoading, error, refetch } = useGetPaymentsQuery();

  const stats = useMemo(() => {
    if (!payments) return null;

    // Calculate total amount
    const totalAmount = payments.reduce((sum, payment) => {
      if (payment.status === "COMPLETED") {
        return sum + payment.amount;
      }
      return sum;
    }, 0);

    // Count total payments
    const totalPayments = payments.length;

    // Count unique payment methods
    const paymentMethods = new Set(
      payments.map((payment) => payment.paymentMethod)
    );
    const uniqueMethodsCount = paymentMethods.size;

    // Find latest payment date
    const latestPayment = payments
      .filter((payment) => payment.status === "COMPLETED")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .at(0);

    const latestPaymentDate = latestPayment
      ? new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(new Date(latestPayment.createdAt))
      : "No payments";

    return {
      totalAmount,
      totalPayments,
      uniqueMethodsCount,
      latestPaymentDate,
    };
  }, [payments]);

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
            {formatCurrency(stats.totalAmount)}
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
          <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">
            {stats.uniqueMethodsCount}
          </div>
          <p className="text-xs text-muted-foreground">
            Different methods used
          </p>
        </CardContent>
      </Card>

      {/* Latest Payment */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Payment</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-base md:text-lg font-bold">
            {stats.latestPaymentDate}
          </div>
          <p className="text-xs text-muted-foreground">
            Most recent transaction
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
