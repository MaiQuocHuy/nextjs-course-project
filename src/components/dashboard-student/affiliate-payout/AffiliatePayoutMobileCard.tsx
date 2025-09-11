"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AffiliatePayout } from "@/types/student";
import {
  Tag,
  User,
  Calendar,
  Percent,
  DollarSign,
  CreditCard,
} from "lucide-react";

interface AffiliatePayoutMobileCardProps {
  affiliatePayout: AffiliatePayout;
}

export function AffiliatePayoutMobileCard({
  affiliatePayout,
}: AffiliatePayoutMobileCardProps) {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        {/* Header with Discount Code and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary">
              {affiliatePayout.discountUsage?.discount?.code || "N/A"}
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
            {affiliatePayout.course?.title || "Unknown Course"}
          </h4>
          <p className="text-xs text-muted-foreground">
            by {affiliatePayout.course?.instructorName || "Unknown Instructor"}
          </p>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {affiliatePayout.discountUsage?.user?.name || "Unknown User"}
            </span>
            <span className="text-xs text-muted-foreground">
              {affiliatePayout.discountUsage?.user?.email || "No email"}
            </span>
          </div>
        </div>

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
              {formatCurrency(affiliatePayout.commissionAmount)}
            </span>
          </div>
        </div>

        {/* Footer with Dates */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatDate(affiliatePayout.createdAt)}
            </span>
          </div>
          {affiliatePayout.paidAt && (
            <div className="flex items-center gap-1">
              <CreditCard className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600">
                Paid: {formatDate(affiliatePayout.paidAt)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
