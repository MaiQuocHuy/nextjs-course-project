import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface CourseSummaryProps {
  course: {
    title: string;
    description: string;
    category: string;
    level: string;
    price: number;
    thumbnail: string;
  };
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-muted-foreground mt-1">{course.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Category: {course.category}</Badge>
              <Badge variant="outline">Level: {course.level}</Badge>
              <Badge variant="default">
                Price: ${course.price.toLocaleString()}
              </Badge>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-48 h-32 rounded-lg overflow-hidden">
              <Image
                src={course.thumbnail || '/placeholder.svg'}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
