import Link from 'next/link';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EnrolledCourse } from '@/types/instructor/students';
import { BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface EnrolledCoursesProps {
  enrolledCourses: EnrolledCourse[];
}

export const EnrolledCourses = ({ enrolledCourses }: EnrolledCoursesProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };
  return (
    <>
      <h3 className="text-xl font-semibold">Enrolled Courses</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <Link
            key={course.courseId}
            href={`/instructor/courses/${course.courseId}`}
            target="_blank"
          >
            <Card
              key={course.courseId}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-video">
                <Image
                  src={course.thumbnailUrl || '/images/empty-course.webp'}
                  alt={course.title || 'Course Thumbnail'}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3">
                  <h4 className="text-sm font-medium truncate">
                    {course.title}
                  </h4>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="mb-3">
                  {course.categories?.map((category) => (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="mr-1 mb-1"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round(course.progress * 100)}%
                    </span>
                  </div>
                  <Progress value={course.progress * 100} className="h-2" />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {course.level || 'Beginner'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {course.enrolledAt
                          ? formatDate(course.enrolledAt)
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
};
