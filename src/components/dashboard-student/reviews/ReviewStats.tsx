"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetReviewStatisticsQuery } from "@/services/student/studentApi";
import { Star, MessageSquare } from "lucide-react";
import { StatsLoadingSkeleton } from "../ui/Loading";
import { ReviewsError, StatsError } from "../ui/LoadingError";

export function ReviewStats() {
  const { data, isLoading, error, refetch } = useGetReviewStatisticsQuery();

  const stats = data || null;

  if (isLoading) {
    return <StatsLoadingSkeleton statsCount={2} />;
  }

  if (error) {
    return <StatsError onRetry={refetch} />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalReviews}</div>
          <p className="text-xs text-muted-foreground">
            Reviews you've written
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.averageRating}</div>
          <p className="text-xs text-muted-foreground">
            Your average rating given
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
