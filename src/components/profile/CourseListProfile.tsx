import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseList } from "@/components/dashboard-student/courses/CourseList";

export function ProfileCourseList() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          My Courses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CourseList cols={3} />
      </CardContent>
    </Card>
  );
}
