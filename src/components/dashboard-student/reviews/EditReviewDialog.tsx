"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { Review } from "@/types/student";

interface EditReviewDialogProps {
  review: Review;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedReview: Partial<Review>) => void;
}

export function EditReviewDialog({
  review,
  isOpen,
  onOpenChange,
  onSave,
}: EditReviewDialogProps) {
  const [editedContent, setEditedContent] = useState(review.reviewText);
  const [editedRating, setEditedRating] = useState(review.rating);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSave = () => {
    onSave({
      reviewText: editedContent,
      rating: editedRating,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setEditedContent(review.reviewText);
    setEditedRating(review.rating);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            Update your review for "{review.course.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Rating Section */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 rounded-sm hover:bg-muted transition-colors"
                  onClick={() => setEditedRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoveredRating || editedRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {editedRating} out of 5 stars
              </span>
            </div>
          </div>

          {/* Review Content */}
          <div className="space-y-2">
            <Label htmlFor="review-content">Review Content</Label>
            <Textarea
              id="review-content"
              placeholder="Share your thoughts about this course..."
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {editedContent.length}/500 characters
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={editedContent.trim().length === 0}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
