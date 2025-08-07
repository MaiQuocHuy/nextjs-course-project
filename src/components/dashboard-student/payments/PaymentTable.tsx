"use client";

import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGetPaymentsQuery } from "@/services/student/studentApi";
import { PaymentTableHead } from "./PaymentTableHead";
import { PaymentTableRow } from "./PaymentTableRow";
import { AlertCircle, Receipt } from "lucide-react";
import { PaymentMobileCard } from "./PaymentMobileCard";

export function PaymentTable() {
  const { data: payments, isLoading, error } = useGetPaymentsQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile Loading */}
          <div className="block md:hidden space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Loading */}
          <div className="hidden md:block space-y-4">
            <div className="grid grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className="h-8" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load payment history. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Payment History
            </h3>
            <p className="text-gray-600 text-sm">
              You haven't made any payments yet. Start learning by enrolling in
              a course!
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
          <Receipt className="h-5 w-5" />
          <span className="hidden sm:inline">Payment History</span>
          <span className="sm:hidden">Payments</span>
          <span className="text-sm font-normal text-muted-foreground">
            ({payments.length} {payments.length === 1 ? "payment" : "payments"})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {/* Mobile View - Card Layout */}
        <div className="block md:hidden space-y-3">
          {payments.map((payment) => (
            <PaymentMobileCard key={payment.id} payment={payment} />
          ))}
        </div>

        {/* Desktop View - Table Layout */}
        <div className="hidden md:block">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <PaymentTableHead />
              <TableBody>
                {payments.map((payment) => (
                  <PaymentTableRow key={payment.id} payment={payment} />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
