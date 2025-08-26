import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseList } from "@/components/dashboard-student/courses/CourseList";
import { useAuth } from "@/hooks/useAuth";
import { CoursesPage } from "../instructor/course/CoursesPage";

export function ProfileCourseList() {
  const { user } = useAuth();

  const userRole = user?.role;

  if (userRole === "STUDENT") {
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

  if (userRole === "INSTRUCTOR") {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <style jsx>{`
            .courses-page-container :global(a[href="/instructor/courses/create-course"]) {
              display: none !important;
            }
            .courses-page-container :global(p.text-muted-foreground) {
              display: none !important;
            }
          `}</style>
          <div className="courses-page-container">
            <CoursesPage />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default fallback for other roles or when role is not defined
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Courses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">No courses available for your role.</p>
      </CardContent>
    </Card>
  );
}
