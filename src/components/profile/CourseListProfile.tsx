"use client";

import { useMemo } from "react";
import { useGetEnrolledCoursesQuery } from "@/services/student/studentApi";
import { CourseCard } from "@/components/dashboard-student/courses/CourseCard";
import { CourseFilter } from "@/components/dashboard-student/courses/CourseFilter";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import {
  resetFilters,
  CourseFilterStatus,
  CourseSortBy,
} from "@/store/slices/student/courseFilterSlice";

export function ProfileCourseList() {
  const { data, error, isLoading } = useGetEnrolledCoursesQuery();
  const dispatch = useAppDispatch();
  const {
    searchQuery,
    filter: filterStatus,
    sort: sortBy,
  } = useAppSelector((state) => state.courseFilter);

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
    if (filterStatus !== CourseFilterStatus.ALL) {
      filtered = filtered.filter((course) => {
        const status = course.completionStatus?.toUpperCase();
        switch (filterStatus) {
          case CourseFilterStatus.COMPLETED:
            return status === "COMPLETED";
          case CourseFilterStatus.IN_PROGRESS:
            return status === "IN_PROGRESS";
          case CourseFilterStatus.NOT_STARTED:
            return status === "NOT_STARTED" || !status;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case CourseSortBy.TITLE:
          return a.title.localeCompare(b.title);
        case CourseSortBy.INSTRUCTOR:
          return a.instructor.name.localeCompare(b.instructor.name);
        case CourseSortBy.PROGRESS:
          return (b.progress || 0) - (a.progress || 0);
        case CourseSortBy.RECENT:
        default:
          // For recent, we can sort by courseId as a proxy since we don't have enrolledAt
          return b.courseId.localeCompare(a.courseId);
      }
    });

    return filtered;
  }, [courses, searchQuery, filterStatus, sortBy]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            My Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <CourseFilter />
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 w-full animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            My Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <CourseFilter />
            <div className="text-red-500 text-sm">
              Failed to load enrolled courses: check your connection or try again.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (courses.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            My Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">You haven't enrolled in any courses yet.</p>
            <Button asChild className="mt-4">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          My Courses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <CourseFilter />

          {filteredAndSortedCourses.length === 0 ? (
            <EmptyState
              hasFilter={searchQuery.trim() !== "" || filterStatus !== CourseFilterStatus.ALL}
              onClearFilter={() => dispatch(resetFilters())}
            />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredAndSortedCourses.length} course
                  {filteredAndSortedCourses.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {filteredAndSortedCourses.map((course) => (
                  <CourseCard key={course.courseId} course={course} />
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface EmptyStateProps {
  hasFilter: boolean;
  onClearFilter: () => void;
}

function EmptyState({ hasFilter, onClearFilter }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        {hasFilter ? "No courses found" : "No courses enrolled"}
      </h3>
      <p className="text-gray-500 mb-4">
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
          <Link href="/courses">Browse Courses</Link>
        </Button>
      )}
    </div>
  );
}
