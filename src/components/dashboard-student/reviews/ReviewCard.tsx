"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Star, 
  Pencil, 
  Trash, 
  Clock, 
  CheckCircle, 
  XCircle,
  BookOpen
} from "lucide-react";
import { Review } from "./ReviewsPage";
import { EditReviewDialog } from "./EditReviewDialog";
import { DeleteReviewAlert } from "./DeleteReviewAlert";

interface ReviewCardProps {
  review: Review;
}

function getStatusBadge(status: Review["status"]) {
  switch (status) {
    case "published":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Published
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return null;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-muted-foreground">
        ({rating}/5)
      </span>
    </div>
  );
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(review);

  const handleEditSave = (updatedReview: Partial<Review>) => {
    // In a real app, this would make an API call
    setCurrentReview(prev => ({ ...prev, ...updatedReview }));
    console.log("Review updated:", updatedReview);
  };

  const handleDelete = () => {
    // In a real app, this would make an API call
    console.log("Review deleted:", currentReview.id);
  };

  const canEdit = currentReview.status === "pending" || currentReview.status === "rejected";

  return (
    <>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-lg leading-tight">
                  {currentReview.courseTitle}
                </h3>
              </div>
              <StarRating rating={currentReview.rating} />
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(currentReview.status)}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Review Content */}
          <div>
            <p className="text-muted-foreground leading-relaxed">
              {currentReview.content}
            </p>
          </div>

          {/* Footer with Date and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              Submitted on {formatDate(currentReview.submittedAt)}
            </div>

            <div className="flex items-center gap-2">
              {canEdit && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsDeleteAlertOpen(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Status-specific messages */}
          {currentReview.status === "rejected" && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                <XCircle className="h-4 w-4 inline mr-1" />
                This review was rejected. You can edit and resubmit it.
              </p>
            </div>
          )}

          {currentReview.status === "pending" && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <Clock className="h-4 w-4 inline mr-1" />
                This review is being moderated and will be published soon.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditReviewDialog
        review={currentReview}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleEditSave}
      />

      {/* Delete Alert */}
      <DeleteReviewAlert
        review={currentReview}
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}
