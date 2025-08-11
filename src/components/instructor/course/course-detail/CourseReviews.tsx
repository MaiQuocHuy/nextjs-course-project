import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface CourseReviewsProps {
  averageRating: number;
  totalReviews: number;
  onViewAllReviews: () => void;
}

const CourseReviews = ({
  averageRating,
  totalReviews,
  onViewAllReviews,
}: CourseReviewsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews & Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {totalReviews} reviews
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={onViewAllReviews}>
          View All Reviews
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseReviews;
