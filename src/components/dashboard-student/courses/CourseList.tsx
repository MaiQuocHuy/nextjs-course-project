"use client";

import { useState, useMemo } from "react";
import { useGetEnrolledCoursesQuery } from "@/store/slices/student/studentApi";
import { CourseCard } from "./CourseCard";
import { CourseFilter } from "./CourseFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BookOpen, RefreshCw } from "lucide-react";
import type { Course } from "@/types/student";

export function CourseList() {
  const { data, error, isLoading, refetch } = useGetEnrolledCoursesQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const courses = data?.content || [];

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = [...courses];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.instructor.name.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((course) => {
        const status = course.completionStatus?.toUpperCase();
        switch (filterStatus) {
          case "completed":
            return status === "COMPLETED";
          case "in_progress":
            return status === "IN_PROGRESS";
          case "not_started":
            return status === "NOT_STARTED" || !status;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "instructor":
          return a.instructor.name.localeCompare(b.instructor.name);
        case "progress":
          return (b.progress || 0) - (a.progress || 0);
        case "recent":
        default:
          // For recent, we can sort by courseId as a proxy since we don't have enrolledAt
          return b.courseId.localeCompare(a.courseId);
      }
    });

    return filtered;
  }, [courses, searchQuery, filterStatus, sortBy]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CourseFilter />
        <CourseListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <CourseFilter />
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load courses. Please try again.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CourseFilter
        onSearch={setSearchQuery}
        onFilter={setFilterStatus}
        onSort={setSortBy}
      />

      {filteredAndSortedCourses.length === 0 ? (
        <EmptyState
          hasFilter={searchQuery.trim() !== "" || filterStatus !== "all"}
          onClearFilter={() => {
            setSearchQuery("");
            setFilterStatus("all");
          }}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedCourses.length} course
              {filteredAndSortedCourses.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedCourses.map((course) => (
              <CourseCard key={course.courseId} course={course} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CourseListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface EmptyStateProps {
  hasFilter: boolean;
  onClearFilter: () => void;
}

function EmptyState({ hasFilter, onClearFilter }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        {hasFilter ? "No courses found" : "No courses enrolled"}
      </h3>
      <p className="text-muted-foreground mb-4">
        {hasFilter
          ? "Try adjusting your search or filter criteria."
          : "Start your learning journey by browsing and enrolling in courses."}
      </p>
      {hasFilter ? (
        <Button variant="outline" onClick={onClearFilter}>
          Clear Filters
        </Button>
      ) : (
        <Button asChild>
          <a href="/courses">Browse Courses</a>
        </Button>
      )}
    </div>
  );
}
