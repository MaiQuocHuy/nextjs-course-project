import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Edit, BookOpen, Calendar, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreateCourseBasicInforPage } from '../create-course/create-basic-infor/CreateCourseBasicInforPage';
import { CourseDetail } from '@/types/instructor/courses';
import { calculateTotalDuration } from '@/utils/instructor/course/course-helper-functions';
import { getStatusColor } from '@/utils/instructor/course/handle-course-status';

export interface CourseHeaderProps {
  courseInfo: CourseDetail;
  isEdittingCourse?: boolean;
  onRefetchData?: () => void;
}

const CourseOverview = ({
  courseInfo,
  isEdittingCourse,
  onRefetchData,
}: CourseHeaderProps) => {
  const router = useRouter();

  return (
    <>
      {isEdittingCourse ? (
        courseInfo ? (
          <CreateCourseBasicInforPage
            mode="edit"
            courseInfo={courseInfo}
            onCancel={() => router.push(`/instructor/courses/${courseInfo.id}`)}
            onRefetchData={onRefetchData}
          />
        ) : (
          <p>No course information available</p>
        )
      ) : (
        <>
          {courseInfo && (
            <Card className="w-full">
              <CardHeader className="relative h-[200px] sm:h-[300px]">
                {/* Course Thumbnail */}
                {courseInfo.thumbnailUrl && (
                  <Image
                    src={courseInfo.thumbnailUrl}
                    alt={courseInfo.title || 'Course image'}
                    fill
                    className="object-cover rounded-t-lg"
                    priority
                  />
                )}
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {courseInfo.title}
                  </h1>

                  {/* Edit course button */}
                  {!courseInfo.approved && (
                    <Button
                      onClick={() =>
                        router.push(
                          `/instructor/courses/${courseInfo.id}/edit-course`
                        )
                      }
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Course
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-4">
                  {/* Categories */}
                  {courseInfo.categories.map((cat) => (
                    <Badge key={cat.id} variant="secondary">
                      <BookOpen className="h-4 w-4" />
                      {cat.name.charAt(0).toUpperCase() +
                        cat.name.slice(1)}{' '}
                    </Badge>
                  ))}

                  {/* Course Level */}
                  <Badge variant="outline">{courseInfo.level}</Badge>

                  {/* Course Duration */}
                  <Badge variant="outline" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {calculateTotalDuration(courseInfo.sections)}
                  </Badge>

                  {/* Course Status */}
                  <Badge
                    className={`${getStatusColor(courseInfo.statusReview)}`}
                  >
                    {courseInfo.statusReview
                      ? courseInfo.statusReview
                      : 'Draft'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-x-6 text-sm text-muted-foreground">
                  {/* Created Date */}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created:{' '}
                      {new Date(courseInfo.createdAt).toLocaleDateString(
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
                      {new Date(courseInfo.updatedAt).toLocaleDateString(
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
          )}
        </>
      )}
    </>
  );
};

export default CourseOverview;
