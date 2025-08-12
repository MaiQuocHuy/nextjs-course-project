import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { EnrolledCoursesListProps } from "../types";
import { CourseCard } from "../coursecard/page";

export function EnrolledCoursesList({ courses }: EnrolledCoursesListProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          My Courses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">You haven't enrolled in any courses yet.</p>
          </div>
        ) : (
          /* Courses Grid */
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
