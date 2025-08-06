import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { courseBasicInfoType } from '@/lib/instructor/create-course-validations/course-basic-info-validation';

interface CourseSummaryProps {
  course: courseBasicInfoType;
}

export function CourseSummary({ course }: CourseSummaryProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Course Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-muted-foreground mt-1">{course.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {course.categoryIds.map((catId) => (
                <Badge key={catId} variant="secondary">
                  {catId.charAt(0).toUpperCase() + catId.slice(1)}{' '}
                </Badge>
              ))}
              <Badge variant="outline">Level: {course.level}</Badge>
              <Badge variant="default">
                Price: ${course.price.toLocaleString()}
              </Badge>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-[80%] overflow-hidden">
              <Image
                src={course.thumbnail || '/placeholder.svg'}
                alt={course.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
