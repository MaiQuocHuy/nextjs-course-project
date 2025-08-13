"use client";

import { useGetStudentReviewsQuery } from "@/services/student/studentApi";
import { Card } from "@/components/ui/card";
import { ReviewItem } from "./ReviewItem";
import { ReviewListLoadingSkeleton } from "../ui/Loading";
import { ReviewsError } from "../ui/LoadingError";
import {
  CustomPagination,
  usePagination,
} from "@/components/ui/custom-pagination";

export function ReviewList() {
  const {
    data: reviewsData,
    isLoading,
    error,
    refetch,
  } = useGetStudentReviewsQuery();

  const reviews = reviewsData?.content || [];

  // Pagination với 5 reviews per page
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedReviews,
    handlePageChange,
  } = usePagination(reviews, 5);

  if (isLoading) {
    return <ReviewListLoadingSkeleton />;
  }

  if (error) {
    return <ReviewsError onRetry={refetch} />;
  }

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

      {/* Reviews List */}
      <div className="space-y-4">
        {paginatedReviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
