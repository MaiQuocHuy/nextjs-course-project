"use client";

import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AffiliatePayoutTableHead() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[120px] font-semibold">Discount Code</TableHead>
        <TableHead className="min-w-[200px] font-semibold">Course</TableHead>
        <TableHead className="w-[140px] font-semibold">User</TableHead>
        <TableHead className="w-[100px] font-semibold text-right">
          Commission %
        </TableHead>
        <TableHead className="w-[120px] font-semibold text-right">
          Commission
        </TableHead>
        <TableHead className="w-[100px] font-semibold">Status</TableHead>
        <TableHead className="w-[130px] font-semibold">Date</TableHead>
      </TableRow>
    </TableHeader>
  );
}
