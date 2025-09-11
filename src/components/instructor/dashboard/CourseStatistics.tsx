import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CalendarDays, DollarSign, Eye, Star, Users } from 'lucide-react';
import { Course } from '@/types/instructor/courses/courses';
import { getStatusColor } from '@/utils/instructor/course/handle-course-status';
import { formatDistanceToNow } from 'date-fns';
import { EmptyState } from '@/components/instructor/commom/EmptyState';

interface CourseStatisticsProps {
  courses?: Course[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const CourseStatistics = ({ 
  courses, 
  onRefresh 
}: CourseStatisticsProps) => {
  return (
    <Card className="shadow-card lg:col-span-2 gap-0">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>Your latest course activity</CardDescription>
          </div>
          {courses && courses.length > 0 && (
            <Badge variant={courses.some(c => c.approved) ? "default" : "secondary"} className={courses.some(c => c.approved) ? "bg-green-500" : ""}>
              {courses.filter(c => c.approved).length} Approved
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-0">
        {courses && courses.length > 0 ? (
          <>
            {courses
              .slice(0, courses.length > 3 ? 3 : courses.length)
              .map((course) => (
                <Link
                  href={`/instructor/courses/${course.id}`}
                  target="_blank"
                  key={course.id}
                  className="flex items-start px-6 py-3 gap-4 hover:bg-accent group transition-colors"
                >
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">{course.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusColor(
                          course.statusReview
                        )}`}
                      >
                        {course.statusReview ? course.statusReview : 'Draft'}
                      </span>
                      <Badge variant="outline" className="font-normal">{course.level}</Badge>
                      {course.categories && course.categories.length > 0 && (
                        <Badge variant="secondary" className="font-normal">
                          {course.categories[0].name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center text-xs">
                        <Users className="mr-1 h-3 w-3" />
                        <span>{course.totalStudents}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <Star className="mr-1 h-3 w-3 fill-amber-500 text-amber-500" />
                        <span>{course.averageRating ? course.averageRating.toFixed(1) : '0.0'}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <DollarSign className="mr-1 h-3 w-3 text-green-600" />
                        <span>${course.revenue}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <CalendarDays className="mr-1 h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(course.updatedAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium">${course.price}</p>
                    <p className="text-xs text-muted-foreground mt-1">{course.sectionCount} {course.sectionCount === 1 ? 'section' : 'sections'}</p>
                  </div>
                </Link>
              ))}
          </>
        ) : (
          <EmptyState
            title="No courses yet"
            message="Start creating your first course or refresh to update your course list."
            icon={<BookOpen className="h-6 w-6 text-muted-foreground" />}
            showRetry={!!onRefresh}
            retryLabel="Refresh Courses"
            onRetry={onRefresh}
            className="py-10"
          />
        )}
      </CardContent>
      {courses && courses.length > 0 && (
        <CardFooter className="pt-0">
          <Link href="/instructor/courses" className="w-full">
            <Button variant="outline" className="w-full cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View All Courses
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};
