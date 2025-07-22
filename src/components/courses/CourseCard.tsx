import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { CourseProgress } from "./CourseProgress";
import { CourseStatus } from "./CourseStatus";

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  completedLessons: number;
  totalLessons: number;
}

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const isCompleted = course.completedLessons === course.totalLessons;

  return (
    <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow h-full">
      <div className="flex flex-col h-full">
        <CardHeader className="p-0">
          <div className="aspect-video relative rounded-t-2xl overflow-hidden">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-6 flex flex-col flex-1">
          <div className="flex flex-col justify-between h-full space-y-4">
            {/* Course Info - Fixed height section */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold line-clamp-2 flex-1 min-h-[3.5rem]">
                  {course.title}
                </h3>
                <CourseStatus isCompleted={isCompleted} />
              </div>
              <p className="text-sm text-muted-foreground">
                by {course.instructor}
              </p>
            </div>

            {/* Progress Section */}
            <CourseProgress 
              completedLessons={course.completedLessons}
              totalLessons={course.totalLessons}
            />

            {/* CTA Button - Always at bottom */}
            <Button
              className="w-full hover:bg-primary/90 transition-colors mt-auto"
              variant="default"
            >
              {isCompleted ? "Review Course" : "Continue Learning"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
