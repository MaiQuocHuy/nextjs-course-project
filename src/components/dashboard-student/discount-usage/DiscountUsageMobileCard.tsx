"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DiscountUsage } from "@/types/student";
import {
  Tag,
  User,
  Calendar,
  Percent,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Hash,
  BookOpen,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/student";
import { toast } from "sonner";

interface DiscountUsageMobileCardProps {
  discountUsage: DiscountUsage;
}

export function DiscountUsageMobileCard({
  discountUsage,
}: DiscountUsageMobileCardProps) {
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

  return (
    <Card className="hover:shadow-md transition-shadow pb-0">
      <CardContent className="p-4 space-y-3">
        {/* Header with Discount Code */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary">{discountUsage.discount.code}</Badge>
          </div>
          <Badge variant="outline" className="font-mono">
            {discountUsage.discountPercent}%
          </Badge>
        </div>

        {/* Discount Type */}
        {discountUsage.discount.type && (
          <p className="text-xs text-gray-500">
            Type: {discountUsage.discount.type}
          </p>
        )}

        {/* Discount Description */}
        <p className="text-sm text-muted-foreground">
          {discountUsage.discount.description}
        </p>

        {/* Course Info */}
        <div className="space-y-1">
          <h4 className="font-medium text-sm">{discountUsage.course.title}</h4>
          <p className="text-xs text-muted-foreground">
            by {discountUsage.course.instructor.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Price: {safeFormatCurrency(discountUsage.course.price)}
          </p>
        </div>

        {/* Used By */}
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {discountUsage.user.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {discountUsage.user.email}
            </span>
          </div>
        </div>

        {/* Footer with Amount and Date */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              -{safeFormatCurrency(discountUsage.discountAmount)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {safeFormatDate(discountUsage.usedAt)}
            </span>
          </div>
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
            {/* Usage ID */}
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Usage ID</span>
                <span className="text-sm font-mono">{discountUsage.id}</span>
              </div>
            </div>

            {/* Course Details */}
            {discountUsage.course && (
              <div className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Course</span>
                  <span className="text-sm font-medium">
                    {discountUsage.course.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Course ID: {discountUsage.course.id}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Instructor: {discountUsage.course.instructor.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Email: {discountUsage.course.instructor.email}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Price: {safeFormatCurrency(discountUsage.course.price)}
                  </span>
                </div>
              </div>
            )}

            {/* Discount Details */}
            {discountUsage.discount && (
              <div className="flex items-start gap-2">
                <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Discount Details
                  </span>
                  <span className="text-sm font-medium">
                    Code: {discountUsage.discount.code}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {discountUsage.discount.description}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Discount ID: {discountUsage.discount.id}
                  </span>
                </div>
              </div>
            )}

            {/* Discount Amount Breakdown */}
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Discount Applied
                </span>
                <span className="text-sm">
                  {discountUsage.discountPercent}% discount
                </span>
                <span className="text-sm text-green-600 font-medium">
                  Saved: {safeFormatCurrency(discountUsage.discountAmount)}
                </span>
              </div>
            </div>

            {/* User Details */}
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  User Information
                </span>
                <span className="text-sm font-medium">
                  {discountUsage.user.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {discountUsage.user.email}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
