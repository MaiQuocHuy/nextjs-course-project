"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Payment } from "./PaymentsPage";
import { PaymentRow } from "./PaymentRow";

interface PaymentsTableProps {
  payments: Payment[];
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  return (
    <div className="w-full">
      {/* Desktop/Tablet Table View */}
      <div className="hidden md:block">
        <ScrollArea className="h-[600px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-10 pr-5">
                  Transaction ID
                </TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="w-[160px]">Amount</TableHead>
                <TableHead className="w-[160px]">Status</TableHead>
                <TableHead className="w-[180px]">Date</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <PaymentRow key={payment.id} payment={payment} />
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 ">
                    <div className="text-muted-foreground">
                      No payment transactions found
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Mobile Stacked Cards View */}
      <div className="md:hidden space-y-4 p-4">
        <ScrollArea className="h-[600px]">
          {payments.map((payment) => (
            <PaymentRow key={payment.id} payment={payment} isMobile={true} />
          ))}
          {payments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No payment transactions found
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
