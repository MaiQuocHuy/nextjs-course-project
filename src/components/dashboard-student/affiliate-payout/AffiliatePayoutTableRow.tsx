"use client";

import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AffiliatePayout } from "@/types/student";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/student";
import {
  ChevronDown,
  ChevronRight,
  Tag,
  User,
  Calendar,
  CreditCard,
  Hash,
  Percent,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AffiliatePayoutTableRowProps {
  affiliatePayout: AffiliatePayout;
}

export function AffiliatePayoutTableRow({
  affiliatePayout,
}: AffiliatePayoutTableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const safeFormatCurrency = (amount: number) => {
    try {
      return formatCurrency(amount, "USD");
    } catch (error) {
      console.error("Error formatting currency:", error);
      return `$${amount.toFixed(2)}`;
    }
  };

  const safeFormatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "N/A";
    try {
      return formatDate(dateString);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
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

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Main Table Row */}
      <TableRow className={cn(isExpanded && "border-b-0", "hover:bg-muted/50")}>
        {/* Discount Code */}
        <TableCell>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="w-fit">
                {affiliatePayout.discountUsage?.discount?.code || "N/A"}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {affiliatePayout.discountUsage?.discount?.code || "N/A"}
            </TooltipContent>
          </Tooltip>
        </TableCell>

        {/* Course */}
        <TableCell>
          <div className="font-medium line-clamp-2 max-w-xs">
            {affiliatePayout.course?.title || "Unknown Course"}
          </div>
        </TableCell>

        {/* User */}
        <TableCell>
          <div className="font-medium text-sm truncate max-w-[120px]">
            {affiliatePayout.discountUsage?.user?.name || "Unknown User"}
          </div>
        </TableCell>

        {/* Commission Percent */}
        <TableCell className="text-right">
          <span className="font-medium">
            {affiliatePayout.commissionPercent}%
          </span>
        </TableCell>

        {/* Commission Amount */}
        <TableCell className="text-right">
          <div className="font-medium text-green-600 whitespace-nowrap">
            {safeFormatCurrency(affiliatePayout.commissionAmount)}
          </div>
        </TableCell>

        {/* Status */}
        <TableCell className="text-center">
          {getStatusBadge(affiliatePayout.payoutStatus)}
        </TableCell>

        {/* Date */}
        <TableCell>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {formatDate(affiliatePayout.createdAt)}
          </span>
        </TableCell>

        {/* Expand/Collapse Button */}
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
      </TableRow>

      {/* Expanded Detail Row */}
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={8} className="p-0">
            <div className="bg-gray-50 border-t border-gray-200 p-3 md:p-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-900 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Affiliate Payout Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {/* Payout ID */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Hash className="h-3 w-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Payout ID
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 font-mono break-all">
                      {affiliatePayout.id}
                    </p>
                  </div>

                  {/* Discount Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Discount Code
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {affiliatePayout.discountUsage?.discount?.code || "N/A"}
                    </p>
                    {affiliatePayout.discountUsage?.discount?.description && (
                      <p className="text-xs text-gray-500">
                        {affiliatePayout.discountUsage.discount.description}
                      </p>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Course
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {affiliatePayout.course.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {`by ${affiliatePayout.course.instructor.name} (${affiliatePayout.course.instructor.email})`}
                    </p>
                    <p className="text-xs text-gray-500">
                      Price: {safeFormatCurrency(affiliatePayout.course.price)}
                    </p>
                  </div>

                  {/* User Info - Only show if discountUsage exists */}
                  {affiliatePayout.discountUsage && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          User
                        </span>
                      </div>
                      <p className="text-sm text-gray-900">
                        {affiliatePayout.discountUsage.user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {affiliatePayout.discountUsage.user.email}
                      </p>
                    </div>
                  )}

                  {/* Commission Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Percent className="h-3 w-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Commission
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {affiliatePayout.commissionPercent}% -{" "}
                      {safeFormatCurrency(affiliatePayout.commissionAmount)}
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Created
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {safeFormatDate(affiliatePayout.createdAt)}
                    </p>
                    {affiliatePayout.paidAt && (
                      <p className="text-xs text-green-600">
                        Paid: {safeFormatDate(affiliatePayout.paidAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
