"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetStudentReviewsQuery } from "@/services/student/studentApi";
import { Star, MessageSquare } from "lucide-react";
import { StatsLoadingSkeleton } from "../ui/Loading";
import { ReviewsError, StatsError } from "../ui/LoadingError";

export function ReviewStats() {
  const {
    data: reviewsData,
    isLoading,
    error,
    refetch,
  } = useGetStudentReviewsQuery();

  if (isLoading) {
    return <StatsLoadingSkeleton statsCount={2} />;
  }

  if (error) {
    return <StatsError onRetry={refetch} />;
  }

  const reviews = reviewsData?.content || [];
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  const statCards = [
    {
      title: "Total Reviews",
      value: totalReviews,
      description: "Reviews you've written",
      icon: MessageSquare,
      color: "text-blue-600",
    },
    {
      title: "Average Rating",
      value: averageRating.toFixed(1),
      description: "Your average rating given",
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
