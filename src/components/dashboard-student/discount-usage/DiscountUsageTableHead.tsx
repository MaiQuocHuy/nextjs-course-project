"use client";

import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function DiscountUsageTableHead() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-16">Code</TableHead>
        <TableHead className="min-w-[200px]">Course</TableHead>
        <TableHead className="w-32">Used By</TableHead>
        <TableHead className="text-right w-20">Discount %</TableHead>
        <TableHead className="text-right w-24 lg:w-32">Amount Saved</TableHead>
        <TableHead className="w-24 lg:w-28">Date Used</TableHead>
        <TableHead className="w-12"></TableHead>
      </TableRow>
    </TableHeader>
  );
}
