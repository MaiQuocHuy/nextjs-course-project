"use client";

import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPaymentsQuery } from "@/services/student/studentApi";
import { PaymentTableHead } from "./PaymentTableHead";
import { PaymentTableRow } from "./PaymentTableRow";
import { Receipt } from "lucide-react";
import { PaymentMobileCard } from "./PaymentMobileCard";
import { PaymentTableLoadingSkeleton } from "../ui/Loading";
import { PaymentsError } from "../ui/LoadingError";

export function PaymentTable() {
  const { data: payments, isLoading, error, refetch } = useGetPaymentsQuery();

  if (isLoading) {
    return <PaymentTableLoadingSkeleton />;
  }

  if (error) {
    return <PaymentsError onRetry={refetch} />;
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
