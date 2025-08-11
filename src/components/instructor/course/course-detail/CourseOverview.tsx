import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CreateCourseBasicInforPage } from '../create-course/create-basic-infor/CreateCourseBasicInforPage';
import { CourseBasicInfoType } from '@/utils/instructor/create-course-validations/course-basic-info-validation';
import { createFilePreview } from '@/utils/instructor/create-file-preview';
import { useRouter } from 'next/navigation';

export interface CourseHeaderProps {
  isEditCourse?: boolean;
  courseData: CourseBasicInfoType;
}

const CourseOverview = ({ courseData, isEditCourse }: CourseHeaderProps) => {
  const [courseImage, setCourseImage] = useState('');
  const router = useRouter();

  // Create course image
  useEffect(() => {
    if (courseData) {      
      if (courseData.file) {
        const handleCreateCourseImage = async () => {
          const courseImage = await createFilePreview(courseData.file);
          setCourseImage(courseImage);
        };
        handleCreateCourseImage();
      }
    }
  }, [courseData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNPUBLISHED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {isEditCourse ? (
        <CreateCourseBasicInforPage
          mode="edit"
          courseInfor={courseData}
          onCancel={() =>
            router.push(`/instructor/courses/${courseData.id}`)
          }
        />
      ) : (
        <>
          {courseData.file && (
            <Card className="w-full">
              <CardHeader className="relative h-[200px] sm:h-[300px]">
                {courseImage && (
                  <Image
                    src={courseImage}
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
                  {courseData.categoryIds.map((catId) => (
                    <Badge key={catId} variant="secondary">
                      <BookOpen className="h-4 w-4" />
                      {catId.charAt(0).toUpperCase() + catId.slice(1)}{' '}
                    </Badge>
                  ))}
                  <Badge variant="outline">{courseData.level}</Badge>
                  {/* <Badge variant="outline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {Math.floor(courseData.duration / 60)}h {courseData.duration % 60}m
          </Badge> */}
                  {/* <Badge className={`${getStatusColor(courseData.status)}`}>
                {courseData.status}
              </Badge> */}
                  <Badge className={`${getStatusColor('PUBLISHED')}`}>
                    PUBLISHED
                  </Badge>
                </div>

                {/* <div className="flex flex-wrap gap-x-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Created:{' '}
                  {new Date(courseData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Updated:{' '}
                  {new Date(courseData.updateAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div> */}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  );
};

export default CourseOverview;
