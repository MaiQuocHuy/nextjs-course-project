"use client";

import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DiscountUsage } from "@/types/student";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/student";
import {
  ChevronDown,
  ChevronRight,
  Tag,
  User,
  Calendar,
  Hash,
  Percent,
  DollarSign,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface DiscountUsageTableRowProps {
  discountUsage: DiscountUsage;
}

export function DiscountUsageTableRow({
  discountUsage,
}: DiscountUsageTableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const safeFormatCurrency = (amount: number) => {
    try {
      return formatCurrency(amount, "USD");
    } catch (error) {
      toast.error("Error formatting currency");
      return `$${amount.toFixed(2)}`;
    }
  };

  const safeFormatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return formatDate(dateString);
    } catch (error) {
      toast.error("Error formatting date");
      return dateString;
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Main Table Row */}
      <TableRow className={cn(isExpanded && "border-b-0", "hover:bg-muted/50")}>
        {/* Discount Code use tooltip shadcn */}
        <TableCell className="font-medium">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="font-mono">
                {discountUsage.discount.code}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>{discountUsage.discount.code}</TooltipContent>
          </Tooltip>
        </TableCell>

        {/* Course Title */}
        <TableCell className="min-w-[200px]">
          <div className="space-y-1">
            <div className="font-medium">{discountUsage.course.title}</div>
          </div>
        </TableCell>

        {/* User */}
        <TableCell>
          <div className="font-medium">{discountUsage.user.name}</div>
        </TableCell>

        {/* Discount Percentage */}
        <TableCell className="text-right">
          <span className="inline-flex items-center gap-1">
            {discountUsage.discountPercent}%
          </span>
        </TableCell>

        {/* Discount Amount */}
        <TableCell className="text-right">
          <div className="font-medium  whitespace-nowrap">
            {safeFormatCurrency(discountUsage.discountAmount)}
          </div>
        </TableCell>

        {/* Used Date */}
        <TableCell>
          <div className="text-sm text-muted-foreground">
            {safeFormatDate(discountUsage.usedAt)}
          </div>
        </TableCell>

        {/* Expand Button */}
        <TableCell className="text-center w-[80px]">
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
        <TableRow className="bg-muted/30">
          <TableCell colSpan={7} className="p-6">
            <div className="space-y-6">
              <h4 className="font-medium text-sm text-gray-900 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Discount Usage Details
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Usage ID */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Hash className="h-3 w-3 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Usage ID
                    </span>
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm text-gray-900 font-mono overflow-hidden text-ellipsis">
                        {discountUsage.id}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>{discountUsage.id}</TooltipContent>
                  </Tooltip>
                </div>

                {/* User Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      User Information
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {discountUsage.user.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {discountUsage.user.email}
                  </p>
                </div>

                {/* Usage Date */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Used At
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {safeFormatDate(discountUsage.usedAt)}
                  </p>
                </div>

                {/* Discount Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Discount Details
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {discountUsage.discount.code}
                  </p>
                  <p className="text-xs text-gray-500">
                    {discountUsage.discount.description}
                  </p>
                  {discountUsage.discount.type && (
                    <p className="text-xs text-gray-500">
                      Type: {discountUsage.discount.type}
                    </p>
                  )}
                </div>

                {/* Course Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Course Details
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {discountUsage.course.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {`by ${discountUsage.course.instructor.name} (${discountUsage.course.instructor.email})`}
                  </p>
                  <p className="text-xs text-gray-500">
                    Price: {safeFormatCurrency(discountUsage.course.price)}
                  </p>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
