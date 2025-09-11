"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DiscountUsage } from "@/types/student";
import { Tag, User, Calendar, Percent, DollarSign } from "lucide-react";

interface DiscountUsageMobileCardProps {
  discountUsage: DiscountUsage;
}

export function DiscountUsageMobileCard({
  discountUsage,
}: DiscountUsageMobileCardProps) {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        {/* Header with Discount Code */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary">
              {discountUsage.discount?.code || "N/A"}
            </Badge>
          </div>
          <Badge variant="outline" className="font-mono">
            {discountUsage.discountPercent}%
          </Badge>
        </div>

        {/* Discount Description */}
        {discountUsage.discount?.description && (
          <p className="text-sm text-muted-foreground">
            {discountUsage.discount.description}
          </p>
        )}

        {/* Course Info */}
        <div className="space-y-1">
          <h4 className="font-medium text-sm">
            {discountUsage.course?.title || "Unknown Course"}
          </h4>
          <p className="text-xs text-muted-foreground">
            by {discountUsage.course?.instructorName || "Unknown Instructor"}
          </p>
        </div>

        {/* Used By */}
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {discountUsage.user?.name || "Unknown User"}
            </span>
            <span className="text-xs text-muted-foreground">
              {discountUsage.user?.email || "No email"}
            </span>
          </div>
        </div>

        {/* Footer with Amount and Date */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              -{formatCurrency(discountUsage.discountAmount)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatDate(discountUsage.usedAt)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
