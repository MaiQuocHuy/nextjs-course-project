"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AffiliatePayout } from "@/types/student";

interface AffiliatePayoutTableRowProps {
  affiliatePayout: AffiliatePayout;
}

export function AffiliatePayoutTableRow({
  affiliatePayout,
}: AffiliatePayoutTableRowProps) {
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

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Pending
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <TableRow className="hover:bg-muted/50">
      {/* Discount Code */}
      <TableCell>
        <div className="flex flex-col">
          <Badge variant="secondary" className="w-fit">
            {affiliatePayout.discountUsage?.discount?.code || "N/A"}
          </Badge>
          <span className="text-xs text-muted-foreground mt-1 truncate max-w-[100px]">
            {affiliatePayout.discountUsage?.discount?.description ||
              "No description"}
          </span>
        </div>
      </TableCell>

      {/* Course */}
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium truncate max-w-[180px]">
            {affiliatePayout.course?.title || "Unknown Course"}
          </span>
          <span className="text-sm text-muted-foreground">
            by {affiliatePayout.course?.instructorName || "Unknown Instructor"}
          </span>
        </div>
      </TableCell>

      {/* User */}
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-sm truncate max-w-[120px]">
            {affiliatePayout.discountUsage?.user?.name || "Unknown User"}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[120px]">
            {affiliatePayout.discountUsage?.user?.email || "No email"}
          </span>
        </div>
      </TableCell>

      {/* Commission Percent */}
      <TableCell className="text-right">
        <Badge variant="outline" className="font-mono">
          {affiliatePayout.commissionPercent}%
        </Badge>
      </TableCell>

      {/* Commission Amount */}
      <TableCell className="text-right">
        <span className="font-medium text-green-600">
          {formatCurrency(affiliatePayout.commissionAmount)}
        </span>
      </TableCell>

      {/* Status */}
      <TableCell>{getStatusBadge(affiliatePayout.payoutStatus)}</TableCell>

      {/* Date */}
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">
            {formatDate(affiliatePayout.createdAt)}
          </span>
          {affiliatePayout.paidAt && (
            <span className="text-xs text-green-600">
              Paid: {formatDate(affiliatePayout.paidAt)}
            </span>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
