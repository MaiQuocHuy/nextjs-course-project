"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Review } from "./ReviewsPage";
import { ReviewCard } from "./ReviewCard";

interface ReviewsListProps {
  reviews: Review[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <div className="w-full">
      <ScrollArea className="h-[600px] w-full">
        <div className="space-y-4 p-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {reviews.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No reviews found</p>
              <p className="text-sm mt-1">
                Complete some courses and share your feedback
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
