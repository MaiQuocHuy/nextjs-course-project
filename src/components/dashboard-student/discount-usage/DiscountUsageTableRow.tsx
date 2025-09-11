"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DiscountUsage } from "@/types/student";

interface DiscountUsageTableRowProps {
  discountUsage: DiscountUsage;
}

export function DiscountUsageTableRow({
  discountUsage,
}: DiscountUsageTableRowProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <TableRow className="hover:bg-muted/50">
      {/* Discount Code */}
      <TableCell>
        <div className="flex flex-col">
          <Badge variant="secondary" className="w-fit">
            {discountUsage.discount?.code || "N/A"}
          </Badge>
          <span className="text-xs text-muted-foreground mt-1 truncate max-w-[100px]">
            {discountUsage.discount?.description || "No description"}
          </span>
        </div>
      </TableCell>

      {/* Course */}
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium truncate max-w-[180px]">
            {discountUsage.course?.title || "Unknown Course"}
          </span>
          <span className="text-sm text-muted-foreground">
            by {discountUsage.course?.instructorName || "Unknown Instructor"}
          </span>
        </div>
      </TableCell>

      {/* Used By */}
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-sm truncate max-w-[120px]">
            {discountUsage.user?.name || "Unknown User"}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[120px]">
            {discountUsage.user?.email || "No email"}
          </span>
        </div>
      </TableCell>

      {/* Discount Percent */}
      <TableCell className="text-right">
        <Badge variant="outline" className="font-mono">
          {discountUsage.discountPercent}%
        </Badge>
      </TableCell>

      {/* Amount Saved */}
      <TableCell className="text-right">
        <span className="font-medium text-green-600">
          -{formatCurrency(discountUsage.discountAmount)}
        </span>
      </TableCell>

      {/* Date Used */}
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {formatDate(discountUsage.usedAt)}
        </span>
      </TableCell>
    </TableRow>
  );
}
