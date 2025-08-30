import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Star } from 'lucide-react';
import { Course } from '@/types/instructor/courses';
import { getStatusColor } from '@/utils/instructor/course/handle-course-status';

interface CourseStatisticsProps {
  courses?: Course[];
}

export const CourseStatistics = ({ courses }: CourseStatisticsProps) => {
  return (
    <Card className="shadow-card lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Courses</CardTitle>
        <CardDescription>Your latest course activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-0">
        {courses && courses.length > 0 ? (
          <>
            {courses
              .slice(0, courses.length > 3 ? 3 : courses.length)
              .map((course) => (
                <Link
                  href={`/instructor/courses/${course.id}`}
                  target="_blank"
                  key={course.id}
                  className="flex items-center px-6 py-2 gap-6 hover:bg-accent"
                >
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-medium">{course.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span
                        className={`p-1 rounded text-xs font-semibold capitalize ${getStatusColor(
                          course.statusReview
                        )}`}
                      >
                        {course.statusReview ? course.statusReview : 'Draft'}
                      </span>
                      <span>•</span>
                      {/* Course Level */}
                      <Badge variant="outline">{course.level}</Badge>
                      <span>•</span>
                      <span>{course.totalStudents} students</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${course.price}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Star className="mr-1 h-3 w-3 fill-current" />
                      {course.averageRating || '0'}
                    </div>
                  </div>
                </Link>
              ))}
            <Link href="/instructor/courses">
              <Button variant="outline" className="w-full mt-4 cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                View All Courses
              </Button>
            </Link>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No courses available</p>
        )}
      </CardContent>
    </Card>
  );
};
