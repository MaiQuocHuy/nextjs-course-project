"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, CheckCircle, Clock, BookOpen } from "lucide-react";

// Mock enrolled courses data
const mockEnrolledCourses = [
  {
    user_id: "u-001",
    course_id: "c-001",
    course: {
      id: "c-001",
      title: "React for Beginners",
      instructor: { name: "Tran Van B" },
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
    },
    completion_status: "IN_PROGRESS",
    progress_percentage: 65,
    enrolled_at: "2024-01-15T10:00:00Z",
  },
  {
    user_id: "u-001",
    course_id: "c-002",
    course: {
      id: "c-002",
      title: "Advanced TypeScript",
      instructor: { name: "Nguyen Thi C" },
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
    },
    completion_status: "IN_PROGRESS",
    progress_percentage: 30,
    enrolled_at: "2024-02-01T14:30:00Z",
  },
  {
    user_id: "u-001",
    course_id: "c-003",
    course: {
      id: "c-003",
      title: "Next.js Full Stack",
      instructor: { name: "Le Van D" },
      thumbnail:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop",
    },
    completion_status: "COMPLETED",
    progress_percentage: 100,
    enrolled_at: "2023-12-10T09:15:00Z",
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Clock className="h-3 w-3 mr-1" />
          In Progress
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          <PlayCircle className="h-3 w-3 mr-1" />
          Not Started
        </Badge>
      );
  }
}

export function EnrolledCoursesSummary() {
  const courses = mockEnrolledCourses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Courses</h2>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      {courses && courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((enrollment) => (
            <Card
              key={enrollment.course_id}
              className="overflow-hidden hover:shadow-lg transition-shadow "
            >
              <CardHeader className="pb-3 px-3">
                <div className="aspect-video relative rounded-md overflow-hidden mb-3">
                  <Image
                    src={enrollment.course.thumbnail}
                    alt={enrollment.course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2 flex-1">
                      {enrollment.course.title}
                    </CardTitle>
                    {getStatusBadge(enrollment.completion_status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    by {enrollment.course.instructor.name}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="px-3">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {enrollment.progress_percentage}%
                      </span>
                    </div>
                    <Progress
                      value={enrollment.progress_percentage}
                      className="h-2"
                    />
                  </div>

                  <Button
                    className="w-full"
                    variant={
                      enrollment.completion_status === "COMPLETED"
                        ? "outline"
                        : "default"
                    }
                  >
                    {enrollment.completion_status === "COMPLETED"
                      ? "Review Course"
                      : "Continue Learning"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No courses enrolled</h3>
                <p className="text-muted-foreground">
                  Discover and enroll in courses to start your learning journey.
                </p>
              </div>
              <Button>Browse Courses</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
