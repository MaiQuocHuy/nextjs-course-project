"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Filter,
  Calendar,
  User,
  MoreHorizontal,
} from "lucide-react";
import { Review } from "@/app/data/courses";
import { cn } from "@/lib/utils";

interface ReviewsListProps {
  reviews: Review[];
  courseRating: number;
  totalReviews: number;
  isEnrolled: boolean;
  className?: string;
}

interface ReviewWithUser extends Omit<Review, "user"> {
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  helpful_votes?: number;
  is_helpful?: boolean;
}

export function ReviewsList({
  reviews,
  courseRating,
  totalReviews,
  isEnrolled,
  className = "",
}: ReviewsListProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);

  // Mock review data with user info
  const mockReviewsWithUsers: ReviewWithUser[] = reviews.map(
    (review, index) => ({
      ...review,
      user: {
        id: `user_${index + 1}`,
        name: [
          "Sarah Johnson",
          "Mike Chen",
          "Emily Rodriguez",
          "David Kim",
          "Jessica Brown",
          "Alex Thompson",
          "Maria Garcia",
          "James Wilson",
        ][index % 8],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${
          index + 1
        }`,
      },
      helpful_votes: Math.floor(Math.random() * 50) + 5,
      is_helpful: Math.random() > 0.7,
    })
  );

  // Calculate rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    mockReviewsWithUsers.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });

    return Object.entries(distribution)
      .reverse()
      .map(([star, count]) => ({
        star: parseInt(star),
        count,
        percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
      }));
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300 dark:text-gray-600"
            )}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredReviews = mockReviewsWithUsers.filter((review) => {
    if (filterBy === "all") return true;
    return review.rating === parseInt(filterBy);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime()
        );
      case "oldest":
        return (
          new Date(a.reviewed_at).getTime() - new Date(b.reviewed_at).getTime()
        );
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "helpful":
        return (b.helpful_votes || 0) - (a.helpful_votes || 0);
      default:
        return 0;
    }
  });

  return (
    <div className={cn("space-y-6", className)}>
      {/* Reviews Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Student feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Overall Rating */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="text-6xl font-bold text-gray-900 dark:text-white">
                {courseRating.toFixed(1)}
              </div>
              <div className="flex items-center gap-2 mt-2">
                {renderStars(courseRating, "lg")}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Course Rating
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {totalReviews.toLocaleString()} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1">
              <div className="space-y-3">
                {getRatingDistribution().map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium">{star}</span>
                      <Star className="w-3 h-3 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <Progress value={percentage} className="h-2" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review Section (for enrolled students) */}
      {isEnrolled && (
        <Card>
          <CardHeader>
            <CardTitle>Share your experience</CardTitle>
          </CardHeader>
          <CardContent>
            {!showReviewForm ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  How would you rate this course?
                </p>
                <Button onClick={() => setShowReviewForm(true)}>
                  Write a Review
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={cn(
                            "w-6 h-6 transition-colors",
                            star <= userRating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300 hover:text-yellow-400"
                          )}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {userRating > 0 &&
                        `${userRating} star${userRating > 1 ? "s" : ""}`}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Review (optional)
                  </label>
                  <Textarea
                    placeholder="Share your thoughts about this course..."
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      // In real app, submit review to API
                      setShowReviewForm(false);
                      setUserRating(0);
                      setUserReview("");
                    }}
                    disabled={userRating === 0}
                  >
                    Submit Review
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowReviewForm(false);
                      setUserRating(0);
                      setUserReview("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filters and Sort */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Reviews ({sortedReviews.length})</CardTitle>

            <div className="flex gap-3">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ratings</SelectItem>
                  <SelectItem value="5">5 stars</SelectItem>
                  <SelectItem value="4">4 stars</SelectItem>
                  <SelectItem value="3">3 stars</SelectItem>
                  <SelectItem value="2">2 stars</SelectItem>
                  <SelectItem value="1">1 star</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="highest">Highest rated</SelectItem>
                  <SelectItem value="lowest">Lowest rated</SelectItem>
                  <SelectItem value="helpful">Most helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sortedReviews.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No reviews match your filters
                </p>
              </div>
            ) : (
              sortedReviews.slice(0, 10).map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-6 last:pb-0"
                >
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarImage
                        src={review.user.avatar}
                        alt={review.user.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm">
                        {review.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {review.user.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(review.rating, "sm")}
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(review.reviewed_at)}
                            </span>
                          </div>
                        </div>

                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      {review.review_text && (
                        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                          {review.review_text}
                        </p>
                      )}

                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "flex items-center gap-2 text-gray-600 dark:text-gray-400",
                            review.is_helpful &&
                              "text-blue-600 dark:text-blue-400"
                          )}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>Helpful ({review.helpful_votes})</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {sortedReviews.length > 10 && (
            <div className="text-center mt-6">
              <Button variant="outline">Load More Reviews</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
