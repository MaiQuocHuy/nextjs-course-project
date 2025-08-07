import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function PaymentTableHead() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-16">Course</TableHead>
        <TableHead className="min-w-[200px]">Course Title</TableHead>
        <TableHead className="text-right w-24 lg:w-32">Amount</TableHead>
        <TableHead className="w-20 lg:w-24">Method</TableHead>
        <TableHead className="w-24 lg:w-28">Date</TableHead>
        <TableHead className="text-center w-20">Status</TableHead>
        <TableHead className="w-12"></TableHead>
      </TableRow>
    </TableHeader>
  );
}
