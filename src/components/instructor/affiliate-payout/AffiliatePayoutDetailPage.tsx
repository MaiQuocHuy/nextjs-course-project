"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  BookOpen,
  DollarSign,
  Calendar,
  Hash,
  Percent,
  CreditCard,
  Users,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  formatCurrency,
  formatDateTime,
  getStatusVariant,
} from "@/utils/instructor/affiliate-payout";
import { useGetAffiliatePayoutByIdQuery } from "@/services/instructor/affiliate-payout/affiliate-payout-api";
import { DetailsLoadingSkeleton } from "../refunds/skeletons";

export const AffiliatePayoutDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, error, refetch } = useGetAffiliatePayoutByIdQuery(
    id,
    {
      skip: !id,
    }
  );

  if (isLoading) {
    return <DetailsLoadingSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-4 lg:p-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/instructor/affiliate-payout")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Affiliate Payouts
        </Button>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Failed to load affiliate payout details. Please try again.
            </p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="mt-4"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const payout = data.data;

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/instructor/affiliate-payout")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Affiliate Payouts
      </Button>
      {/* Header */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-lg lg:text-xl font-bold tracking-tight">
                Affiliate Payout Details
              </h1>
              <p className="text-muted-foreground">
                Payout ID: <span className="font-mono">{payout.id}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={getStatusVariant(payout.payoutStatus)}
                className="text-base"
              >
                {payout.payoutStatus}
              </Badge>
              <span className="text-xl font-semibold">
                {formatCurrency(payout.commissionAmount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Commission Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Commission Amount */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Commission Amount</span>
              </div>
              <p className="text-lg font-semibold">
                {formatCurrency(payout.commissionAmount)}
              </p>
            </div>

            {/* Commission Percentage */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Commission Percentage
                </span>
              </div>
              <p className="text-lg font-semibold">
                {payout.commissionPercent}%
              </p>
            </div>

            {/* Payout Status */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Payout Status</span>
              <div>
                <Badge variant={getStatusVariant(payout.payoutStatus)}>
                  {payout.payoutStatus}
                </Badge>
              </div>
            </div>

            {/* Created At */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Created At</span>
              </div>
              <p className="text-sm">{formatDateTime(payout.createdAt)}</p>
            </div>

            {/* Paid At */}
            {payout.paidAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Paid At</span>
                </div>
                <p className="text-sm">{formatDateTime(payout.paidAt)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Course Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
              {payout.course.thumbnailUrl && (
                <img
                  src={payout.course.thumbnailUrl}
                  alt={payout.course.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="space-y-2">
                <p className="font-medium text-lg">{payout.course.title}</p>
                <p className="text-sm text-muted-foreground">
                  Course ID: {payout.course.id}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{payout.course.level}</Badge>
                  <span className="text-sm font-medium">
                    {formatCurrency(payout.course.price)}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/instructor/courses/${payout.course.id}`)
              }
            >
              View Course
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referred By Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Affiliate (Referred By)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={payout.referredByUser.thumbnailUrl}
                  alt={payout.referredByUser.name}
                />
                <AvatarFallback>
                  {payout.referredByUser.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-medium">{payout.referredByUser.name}</p>
                <p className="text-sm text-muted-foreground">
                  {payout.referredByUser.email}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discount Usage Information (if applicable) */}
      {payout.discountUsage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Discount Usage Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Discount Code */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Discount Code</span>
                </div>
                <p className="text-lg font-mono">
                  {payout.discountUsage.discount.code}
                </p>
              </div>

              {/* User Who Used Discount */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Used By</span>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={payout.discountUsage.user.thumbnailUrl}
                      alt={payout.discountUsage.user.name}
                    />
                    <AvatarFallback>
                      {payout.discountUsage.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {payout.discountUsage.user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {payout.discountUsage.user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Discount Amount */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Discount Amount</span>
                </div>
                <p className="text-sm">
                  {formatCurrency(payout.discountUsage.discountAmount)}
                </p>
              </div>

              {/* Discount Percentage */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Discount Percentage
                  </span>
                </div>
                <p className="text-sm">
                  {payout.discountUsage.discountPercent}%
                </p>
              </div>

              {/* Used At */}
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Discount Used At</span>
                </div>
                <p className="text-sm">
                  {formatDateTime(payout.discountUsage.usedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Transaction Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payout ID */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Payout ID</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm font-mono text-ellipsis overflow-hidden">
                    {payout.id}
                  </p>
                </TooltipTrigger>
                <TooltipContent>{payout.id}</TooltipContent>
              </Tooltip>
            </div>

            {/* Course ID */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Course ID</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm font-mono text-ellipsis overflow-hidden">
                    {payout.course.id}
                  </p>
                </TooltipTrigger>
                <TooltipContent>{payout.course.id}</TooltipContent>
              </Tooltip>
            </div>

            {/* Discount Usage ID */}
            {payout.discountUsage && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Discount Usage ID</span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm font-mono text-ellipsis overflow-hidden">
                      {payout.discountUsage.id}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>{payout.discountUsage.id}</TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Referred By User ID */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Affiliate User ID</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm font-mono text-ellipsis overflow-hidden">
                    {payout.referredByUser.id}
                  </p>
                </TooltipTrigger>
                <TooltipContent>{payout.referredByUser.id}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
