import { GraduationCap, Filter, Search } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CourseList } from "@/components/courses/CourseList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const enrolledCourses = [
  {
    id: "course-1",
    title: "Mastering React Basics",
    instructor: "Nguyen Van A",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
    completedLessons: 6,
    totalLessons: 12,
  },
  {
    id: "course-2",
    title: "Advanced TypeScript Patterns",
    instructor: "Pham Thi B",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
    completedLessons: 12,
    totalLessons: 12,
  },
  {
    id: "course-3",
    title: "Next.js Full Stack Development",
    instructor: "Le Van C",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
    completedLessons: 8,
    totalLessons: 15,
  },
  {
    id: "course-4",
    title: "Modern CSS & Tailwind",
    instructor: "Tran Thi D",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    completedLessons: 3,
    totalLessons: 10,
  },
  {
    id: "course-5",
    title: "Node.js Backend Development",
    instructor: "Hoang Van E",
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=400&fit=crop",
    completedLessons: 15,
    totalLessons: 15,
  },
  {
    id: "course-6",
    title: "Database Design & SQL",
    instructor: "Vo Thi F",
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=400&fit=crop",
    completedLessons: 4,
    totalLessons: 8,
  },
];

export default function MyCoursesPage() {
  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(
    (course) => course.completedLessons === course.totalLessons
  ).length;
  const inProgressCourses = totalCourses - completedCourses;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">My Courses</h1>
          </div>

          {/* Course Stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">{totalCourses} courses</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Completed:</span>
              <span className="font-medium text-green-600">
                {completedCourses}
              </span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">In Progress:</span>
              <span className="font-medium text-blue-600">
                {inProgressCourses}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Course List */}
        <CourseList courses={enrolledCourses} />
      </div>
    </DashboardLayout>
  );
}
