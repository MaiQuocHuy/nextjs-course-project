import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { useGetCourseReviewsQuery } from '@/services/instructor/courses/courses-api';
import { Review } from '@/types/instructor/courses/courses';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorComponent } from '@/components/instructor/commom/ErrorComponent';
import { EmptyState } from '@/components/instructor/commom/EmptyState';
import { Pagination } from '@/components/common/Pagination';

// Loading skeleton component
const ReviewSkeleton = () => (
  <Card className="mb-4">
    <CardContent className="p-6">
      <div className="flex space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4" />
              ))}
            </div>
          </div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const CourseReviews = () => {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const {
    data: reviewsData,
    isLoading,
    isError,
    refetch,
  } = useGetCourseReviewsQuery(
    {
      courseId: id,
      page,
      size,
      sort: 'reviewedAt,DESC',
    },
    { skip: !id }
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newSize: number) => {
    setSize(newSize);
    setPage(0); // Reset to first page when changing page size
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <ReviewSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <ErrorComponent
        title="Error Loading Reviews"
        message="Failed to load course reviews. Please try again."
        onRetry={refetch}
      />
    );
  }

  // Empty state
  if (!reviewsData?.content || reviewsData.content.length === 0) {
    return (
      <EmptyState
        title="No Reviews Yet"
        message="This course hasn't received any reviews yet. Reviews will appear here once students start rating the course."
        illustration="/images/empty_data.png"
      />
    );
  }

  const reviews = reviewsData.content;
  const pageInfo = reviewsData.page;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {reviews.map((review: Review) => (
          <Card key={review.id} className="transition-shadow hover:shadow-md">
            <CardContent className="px-6 py-0">
              <div className="flex space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src={review.user.avatar} 
                    alt={review.user.name}
                  />
                  <AvatarFallback>
                    {review.user.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">
                      {review.user.name}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-muted-foreground">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(review.reviewedAt), { 
                      addSuffix: true 
                    })}
                  </p>
                  
                  <p className="text-foreground leading-relaxed">
                    {review.reviewText}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show pagination if total pages >= 1 */}
      {pageInfo && pageInfo.totalPages >= 1 && (
        <Pagination
          currentPage={page}
          itemsPerPage={size}
          pageInfo={{
            totalPages: pageInfo.totalPages,
            totalElements: pageInfo.totalElements,
            first: pageInfo.first,
            last: pageInfo.last,
          }}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
};

export default CourseReviews;
