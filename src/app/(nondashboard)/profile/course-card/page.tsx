import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { CourseCardProps } from "../types";

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Course Thumbnail */}
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={course.thumbnail || "/placeholder.svg"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>

      <CardContent className="p-4 flex flex-col h-[220px]">
        {/* Course Title - Fixed height with line clamp */}
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 min-h-[56px]">
          {course.title}
        </h3>

        {/* Instructor - Fixed position */}
        <p className="text-sm text-gray-600 mb-4">Instructor: {course.instructor}</p>

        {/* Progress - Fixed position */}
        <div className="space-y-2 mb-auto">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>

        {/* Continue Learning Button - Fixed at bottom */}
        <Button asChild className="w-full mt-4">
          <Link href={`/dashboard/learning/${course.id}`}>Continue Learning</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
