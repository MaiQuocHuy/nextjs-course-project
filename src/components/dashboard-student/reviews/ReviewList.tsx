"use client";

import { useGetStudentReviewsQuery } from "@/services/student/studentApi";
import { Card } from "@/components/ui/card";
import { ReviewItem } from "./ReviewItem";

export function ReviewList() {
  const {
    data: reviewsData,
    isLoading,
    error,
    refetch,
  } = useGetStudentReviewsQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Reviews</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, starIndex) => (
                        <div
                          key={starIndex}
                          className="h-4 w-4 bg-gray-200 rounded animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Reviews</h2>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load reviews</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </Card>
      </div>
    );
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
