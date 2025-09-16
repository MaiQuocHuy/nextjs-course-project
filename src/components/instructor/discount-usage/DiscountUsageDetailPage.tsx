"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  BookOpen,
  Tag,
  Calendar,
  DollarSign,
  Hash,
  Percent,
  Users,
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
  getTypeVariant,
} from "@/utils/instructor/discount-usage";
import { useGetDiscountUsageByIdQuery } from "@/services/instructor/discount-usage/discount-usage-api";
import { DetailsLoadingSkeleton } from "../refunds/skeletons";

export const DiscountUsageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, error, refetch } = useGetDiscountUsageByIdQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return <DetailsLoadingSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-4 lg:p-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/instructor/discount-usage")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Discount Usage
        </Button>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Failed to load discount usage details. Please try again.
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

  const usage = data.data;

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/instructor/discount-usage")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Discount Usage
      </Button>
      {/* Header */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-lg lg:text-xl font-bold tracking-tight">
                Discount Usage Details
              </h1>
              <p className="text-muted-foreground">
                Usage ID: <span className="font-mono">{usage.id}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={getTypeVariant(usage.discount.type)}
                className="text-base"
              >
                {usage.discount.type}
              </Badge>
              <span className="text-xl font-semibold">
                {formatCurrency(usage.discountAmount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discount Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Discount Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Discount Code */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Discount Code</span>
              </div>
              <p className="text-lg font-mono">{usage.discount.code}</p>
            </div>

            {/* Discount Type */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Discount Type</span>
              <div>{usage.discount.type}</div>
            </div>

            {/* Discount Percentage */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Discount Percentage</span>
              </div>
              <div>{usage.discountPercent}%</div>
            </div>

            {/* Discount Amount */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Discount Amount</span>
              </div>
              <div>{formatCurrency(usage.discountAmount)}</div>
            </div>

            {/* Used At */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Used At</span>
              </div>
              <p className="text-sm">{formatDateTime(usage.usedAt)}</p>
            </div>

            {/* Description */}
            {usage.discount.description && (
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <span className="text-sm font-medium">Description</span>
                <p>{usage.discount.description}</p>
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
              {usage.course.thumbnailUrl && (
                <img
                  src={usage.course.thumbnailUrl}
                  alt={usage.course.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="space-y-2">
                <p className="font-medium text-lg">{usage.course.title}</p>
                <p className="text-sm text-muted-foreground">
                  Course ID: {usage.course.id}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{usage.course.level}</Badge>
                  <span className="text-sm font-medium">
                    {formatCurrency(usage.course.price)}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/instructor/courses/${usage.course.id}`)
              }
            >
              View Course
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={usage.user.thumbnailUrl}
                  alt={usage.user.name}
                />
                <AvatarFallback>
                  {usage.user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-medium">{usage.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {usage.user.email}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referred By Information (if applicable) */}
      {usage.referredByUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Referred By
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={usage.referredByUser.thumbnailUrl}
                    alt={usage.referredByUser.name}
                  />
                  <AvatarFallback>
                    {usage.referredByUser.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-medium">{usage.referredByUser.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {usage.referredByUser.email}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Usage Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Usage ID */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Usage ID</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm font-mono text-ellipsis overflow-hidden">
                    {usage.id}
                  </p>
                </TooltipTrigger>
                <TooltipContent>{usage.id}</TooltipContent>
              </Tooltip>
            </div>

            {/* Discount ID */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Discount ID</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm font-mono text-ellipsis overflow-hidden">
                    {usage.discount.id}
                  </p>
                </TooltipTrigger>
                <TooltipContent>{usage.discount.id}</TooltipContent>
              </Tooltip>
            </div>

            {/* Created Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Created At</span>
              </div>
              <p className="text-sm">{formatDateTime(usage.usedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
