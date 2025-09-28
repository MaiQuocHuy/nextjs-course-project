"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSubmitCourseReviewMutation } from "@/services/coursesApi";
import { toast } from "sonner";

interface ReviewFormProps {
  courseId: string;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ courseId, onReviewSubmitted }: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitReview, { isLoading }] = useSubmitCourseReviewMutation();

  // Check if user is a student
  const isStudent = session?.user?.role === "STUDENT";
  const isAuthenticated = !!session?.user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isStudent) {
      toast.error("Only students can submit reviews");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      await submitReview({
        courseId,
        review: {
          rating,
          review_text: reviewText.trim(),
        },
      }).unwrap();

      toast.success("Review submitted successfully!");
      setRating(0);
      setReviewText("");
      onReviewSubmitted?.();
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      toast.error(error?.data?.message || "Failed to submit review");
    }
  };

  const handleReset = () => {
    setRating(0);
    setReviewText("");
  };

  // Don't render if user is not authenticated or not a student
  if (!isAuthenticated) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Please log in to submit a review
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isStudent) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Only students can submit reviews for courses
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating *
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-colors"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    } transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {rating > 0 && `${rating} star${rating > 1 ? "s" : ""}`}
              </span>
            </div>
          </div>

          {/* Review Text Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Review *
            </label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this course..."
              className="min-h-[100px] resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {reviewText.length}/1000 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isLoading || rating === 0 || !reviewText.trim()}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Review
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
