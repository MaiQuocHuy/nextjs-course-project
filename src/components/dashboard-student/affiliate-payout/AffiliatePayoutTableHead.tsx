"use client";

import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AffiliatePayoutTableHead() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-16">Code</TableHead>
        <TableHead className="min-w-[200px]">Course</TableHead>
        <TableHead className="w-32">User</TableHead>
        <TableHead className="text-right w-20">Commission %</TableHead>
        <TableHead className="text-right w-24 lg:w-32">Amount</TableHead>
        <TableHead className="text-center w-20">Status</TableHead>
        <TableHead className="w-24 lg:w-28">Date</TableHead>
        <TableHead className="w-12"></TableHead>
      </TableRow>
    </TableHeader>
  );
}
