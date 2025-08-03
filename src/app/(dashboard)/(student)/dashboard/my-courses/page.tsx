import { DashboardLayout } from "@/components/dashboard-student/DashboardLayout";
import { CourseList } from "@/components/dashboard-student/courses/CourseList";

export default function MyCoursesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">
            Manage and track your enrolled courses
          </p>
        </div>

        <CourseList />
      </div>
    </DashboardLayout>
  );
}
