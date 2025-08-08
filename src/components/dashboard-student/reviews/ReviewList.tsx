"use client";

import { useGetStudentReviewsQuery } from "@/services/student/studentApi";
import { Card } from "@/components/ui/card";
import { ReviewItem } from "./ReviewItem";
import { ReviewListLoadingSkeleton } from "../ui/Loading";
import { ReviewsError } from "../ui/LoadingError";

export function ReviewList() {
  const {
    data: reviewsData,
    isLoading,
    error,
    refetch,
  } = useGetStudentReviewsQuery();

  if (isLoading) {
    return <ReviewListLoadingSkeleton />;
  }

  if (error) {
    return <ReviewsError onRetry={refetch} />;
  }

  const reviews = reviewsData?.content || [];

  if (reviews.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Reviews</h2>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-gray-500">
              You haven't written any reviews yet.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Complete some courses and share your feedback!
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Your Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
