"use client";

import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function DiscountUsageTableHead() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[120px] font-semibold">Discount Code</TableHead>
        <TableHead className="min-w-[200px] font-semibold">Course</TableHead>
        <TableHead className="w-[140px] font-semibold">Used By</TableHead>
        <TableHead className="w-[120px] font-semibold text-right">
          Discount %
        </TableHead>
        <TableHead className="w-[120px] font-semibold text-right">
          Amount Saved
        </TableHead>
        <TableHead className="w-[130px] font-semibold">Date Used</TableHead>
      </TableRow>
    </TableHeader>
  );
}
