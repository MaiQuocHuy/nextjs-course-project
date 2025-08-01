"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, CheckCircle, Clock, BookOpen } from "lucide-react";
import { useGetEnrolledCoursesQuery } from "@/store/slices/student/studentApi";
import { Loading, CoursesLoadingSkeleton } from "./ui/Loading";
import { LoadingError, CourseLoadError } from "./ui/LoadingError";

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
  const { data, error, isLoading, refetch } = useGetEnrolledCoursesQuery();

  if (isLoading) {
    return <CoursesLoadingSkeleton />;
  }
  if (error) {
    return <CourseLoadError onRetry={refetch} />;
  }

  const courses = data?.content || [];

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
              key={enrollment.courseId}
              className="overflow-hidden hover:shadow-lg transition-shadow "
            >
              <CardHeader className="pb-3 px-3">
                <div className="aspect-video relative rounded-md overflow-hidden mb-3">
                  <Image
                    src={enrollment.thumbnailUrl}
                    alt={enrollment.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2 flex-1">
                      {enrollment.title}
                    </CardTitle>
                    {getStatusBadge(enrollment.completionStatus)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    by {enrollment.instructor.name}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="px-3">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {enrollment.progress * 100}%
                      </span>
                    </div>
                    <Progress
                      value={enrollment.progress * 100}
                      className="h-2"
                    />
                  </div>

                  <Button
                    className="w-full"
                    variant={
                      enrollment.completionStatus === "COMPLETED"
                        ? "outline"
                        : "default"
                    }
                  >
                    {enrollment.completionStatus === "COMPLETED"
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
