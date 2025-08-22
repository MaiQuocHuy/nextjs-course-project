import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, BookOpen, Calendar, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CreateCourseBasicInforPage } from '../create-course/create-basic-infor/CreateCourseBasicInforPage';
import { useRouter } from 'next/navigation';
import { CourseDetail } from '@/types/instructor/courses';
import { calculateTotalDuration } from '@/utils/instructor/course/cal-total-duration';
import {
  getStatusColor,
} from '@/utils/instructor/course/handle-course-status';

export interface CourseHeaderProps {
  isEditCourse?: boolean;
  courseData: CourseDetail;
}

const CourseOverview = ({ courseData, isEditCourse }: CourseHeaderProps) => {
  const [courseInfo, setCourseInfo] = useState<CourseDetail | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (courseData) {
      const courseInfo: CourseDetail = {
        ...courseData,
      };
      setCourseInfo(courseInfo);
    }
  }, [courseData]);

  return (
    <>
      {isEditCourse ? (
        courseInfo ? (
          <CreateCourseBasicInforPage
            mode="edit"
            courseInfor={courseInfo}
            onCancel={() => router.push(`/instructor/courses/${courseData.id}`)}
          />
        ) : (
          <p>No course information available</p>
        )
      ) : (
        <>
          <Card className="w-full">
            <CardHeader className="relative h-[200px] sm:h-[300px]">
              {/* Course Thumbnail */}
              {courseData.thumbnailUrl && (
                <Image
                  src={courseData.thumbnailUrl}
                  alt={courseData.title || 'Course image'}
                  fill
                  className="object-cover rounded-t-lg"
                  priority
                />
              )}
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {courseData.title}
                </h1>

                {/* Edit course button */}
                <Button
                  onClick={() =>
                    router.push(
                      `/instructor/courses/${courseData.id}/edit-course`
                    )
                  }
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Course
                </Button>
              </div>

              <div className="flex flex-wrap gap-4">
                {/* Categories */}
                {courseData.categories.map((cat) => (
                  <Badge key={cat.id} variant="secondary">
                    <BookOpen className="h-4 w-4" />
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}{' '}
                  </Badge>
                ))}
                {/* Course Level */}
                <Badge variant="outline">{courseData.level}</Badge>
                {/* Course Duration */}
                <Badge variant="outline" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {calculateTotalDuration(courseData.sections)}
                </Badge>
                {/* Course Status */}
                <Badge className={`${getStatusColor(courseData.statusReview)}`}>
                  {courseData.statusReview ? courseData.statusReview : "Draft"}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-x-6 text-sm text-muted-foreground">
                {/* Created Date */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created:{' '}
                    {new Date(courseData.createdAt).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }
                    )}
                  </span>
                </div>
                {/* Updated Date */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Last Updated:{' '}
                    {new Date(courseData.updatedAt).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

export default CourseOverview;
