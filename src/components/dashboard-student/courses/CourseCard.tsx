import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { CourseStatus } from "../CourseStatus";
import type { Course } from "@/types/student";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Image
            src={course.thumbnailUrl || "/api/placeholder/400/225"}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white"
            >
              <Link href={`/dashboard/learning/${course.courseId}`}>
                Continue Learning
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Course Title and Status */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg line-clamp-2 flex-1">
                <Link
                  href={`/dashboard/learning/${course.courseId}`}
                  className="hover:text-primary transition-colors"
                >
                  {course.title}
                </Link>
              </CardTitle>
              <CourseStatus status={course.completionStatus} />
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{course.instructor.name}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{course.progress * 100}%</span>
            </div>
            <Progress value={course.progress * 100} className="h-2" />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button asChild className="w-full">
              <Link href={`/dashboard/learning/${course.courseId}`}>
                Continue Learning
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
