"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateReviewMutation } from "@/services/student/studentApi";
import { Review } from "@/types/student";
import { Star, Edit, Calendar } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/utils/student";

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editRating, setEditRating] = useState(review.rating.toString());
  const [editReviewText, setEditReviewText] = useState(review.reviewText);

  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  const handleUpdateReview = async () => {
    try {
      await updateReview({
        reviewId: review.id,
        data: {
          rating: parseInt(editRating),
          reviewText: editReviewText,
        },
      }).unwrap();

      toast.success("Review updated successfully!");
      setIsEditDialogOpen(false);
    } catch (error: any) {
      // More detailed error handling
      let errorMessage = "Failed to update review. Please try again.";
      toast.error(errorMessage);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <h3 className="font-semibold text-lg text-gray-900">
              {review.course.title}
            </h3>
            <div className="flex items-center space-x-1">
              {renderStars(review.rating)}
              <span className="ml-2 text-sm text-gray-600">
                {review.rating}/5
              </span>
            </div>
          </div>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Review</DialogTitle>
                <DialogDescription>
                  Update your review for {review.course.title}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Select value={editRating} onValueChange={setEditRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reviewText">Review</Label>
                  <Textarea
                    id="reviewText"
                    value={editReviewText}
                    onChange={(e) => setEditReviewText(e.target.value)}
                    placeholder="Write your review..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateReview} disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Review"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Review Text */}
        <div className="text-gray-700">
          <p>{review.reviewText}</p>
        </div>

        {/* Date */}
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          Reviewed on {formatDate(review.reviewedAt)}
        </div>
      </div>
    </Card>
  );
}
