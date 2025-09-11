"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AffiliatePayout } from "@/types/student";
import {
  Tag,
  User,
  Calendar,
  Percent,
  DollarSign,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Hash,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/student";

interface AffiliatePayoutMobileCardProps {
  affiliatePayout: AffiliatePayout;
}

export function AffiliatePayoutMobileCard({
  affiliatePayout,
}: AffiliatePayoutMobileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const safeFormatCurrency = (amount: number) => {
    try {
      return formatCurrency(amount, "USD");
    } catch (error) {
      console.error("Error formatting currency:", error);
      return `$${amount.toFixed(2)}`;
    }
  };

  const safeFormatDate = (dateString: string | undefined) => {
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

  return (
    <Card className="hover:shadow-md transition-shadow pb-0">
      <CardContent className="p-4 space-y-3">
        {/* Header with Discount Code and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary">
              {affiliatePayout.discountUsage?.discount?.code || "Direct Sale"}
            </Badge>
          </div>
          {getStatusBadge(affiliatePayout.payoutStatus)}
        </div>

        {/* Discount Description */}
        {affiliatePayout.discountUsage?.discount?.description && (
          <p className="text-sm text-muted-foreground">
            {affiliatePayout.discountUsage.discount.description}
          </p>
        )}

        {/* Course Info */}
        <div className="space-y-1">
          <h4 className="font-medium text-sm">
            {affiliatePayout.course.title}
          </h4>
          <p className="text-xs text-muted-foreground">
            by {affiliatePayout.course.instructor.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Price: {safeFormatCurrency(affiliatePayout.course.price)}
          </p>
        </div>

        {/* User Info - Only show if discountUsage exists */}
        {affiliatePayout.discountUsage && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {affiliatePayout.discountUsage.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {affiliatePayout.discountUsage.user.email}
              </span>
            </div>
          </div>
        )}

        {/* Commission Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Percent className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {affiliatePayout.commissionPercent}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              {safeFormatCurrency(affiliatePayout.commissionAmount)}
            </span>
          </div>
        </div>

        {/* Footer with Dates */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {safeFormatDate(affiliatePayout.createdAt)}
            </span>
          </div>
          {affiliatePayout.paidAt && (
            <div className="flex items-center gap-1">
              <CreditCard className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600">
                Paid: {safeFormatDate(affiliatePayout.paidAt)}
              </span>
            </div>
          )}
        </div>

        {/* Expand Button */}
        <div className="flex justify-center pt-2 border-t mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            {isExpanded ? (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Less Details
              </>
            ) : (
              <>
                <ChevronRight className="h-3 w-3 mr-1" />
                More Details
              </>
            )}
          </Button>
        </div>

        {/* Expanded Detail Row */}
        {isExpanded && (
          <div className="mt-3 space-y-3 pt-3 border-t">
            {/* Payout ID */}
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Payout ID</span>
                <span className="text-sm font-mono">{affiliatePayout.id}</span>
              </div>
            </div>

            {/* Course Details */}
            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Course Details
                </span>
                <span className="text-sm font-medium">
                  {affiliatePayout.course.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  Course ID: {affiliatePayout.course.id}
                </span>
                <span className="text-xs text-muted-foreground">
                  Instructor: {affiliatePayout.course.instructor.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  Email: {affiliatePayout.course.instructor.email}
                </span>
                <span className="text-xs text-muted-foreground">
                  Price: {safeFormatCurrency(affiliatePayout.course.price)}
                </span>
              </div>
            </div>

            {/* Discount Usage Details */}
            {affiliatePayout.discountUsage && (
              <div className="flex items-start gap-2">
                <Percent className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Discount Details
                  </span>
                  <span className="text-sm">
                    Code: {affiliatePayout.discountUsage.discount.code}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Usage ID: {affiliatePayout.discountUsage.id}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Applied:{" "}
                    {safeFormatDate(affiliatePayout.discountUsage.usedAt)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Discount: {affiliatePayout.discountUsage.discountPercent}% -{" "}
                    {safeFormatCurrency(
                      affiliatePayout.discountUsage.discountAmount
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Commission Details */}
            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Commission Details
                </span>
                <span className="text-sm text-green-600 font-medium">
                  {affiliatePayout.commissionPercent}% ={" "}
                  {safeFormatCurrency(affiliatePayout.commissionAmount)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Status: {affiliatePayout.payoutStatus}
                </span>
              </div>
            </div>

            {/* Payment Status Info */}
            {affiliatePayout.paidAt && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-600" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Payment Status
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    Paid on {safeFormatDate(affiliatePayout.paidAt)}
                  </span>
                </div>
              </div>
            )}

            {/* Cancelled Status Info */}
            {affiliatePayout.cancelledAt && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-red-600" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Cancellation
                  </span>
                  <span className="text-sm text-red-600 font-medium">
                    Cancelled on {safeFormatDate(affiliatePayout.cancelledAt)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
