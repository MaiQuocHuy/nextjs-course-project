"use client";

import { useMemo } from "react";
import { useGetEnrolledCoursesQuery } from "@/services/student/studentApi";
import { CourseCard } from "./CourseCard";
import { CourseFilter } from "./CourseFilter";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { CoursesLoadingSkeleton, EnrolledCoursesError } from "../ui";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import {
  resetFilters,
  CourseFilterStatus,
  CourseSortBy,
} from "@/store/slices/student/courseFilterSlice";
import {
  CustomPagination,
  usePagination,
} from "@/components/ui/custom-pagination";

const COURSES_PER_PAGE = 6;

type CourseListProps = {
  cols?: number;
};

export function CourseList({ cols }: CourseListProps) {
  const { data, error, isLoading, refetch } = useGetEnrolledCoursesQuery();
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
        const progress = course.progress || 0;

        switch (filterStatus) {
          case CourseFilterStatus.COMPLETED:
            return status === "COMPLETED";
          case CourseFilterStatus.IN_PROGRESS:
            return status === "IN_PROGRESS";
          case CourseFilterStatus.NOT_STARTED:
            // A course is considered not started if:
            // - It has no completion status, OR
            // - It has progress of 0, OR
            // - Its status is explicitly "NOT_STARTED"
            return !status || progress === 0 || status === "NOT_STARTED";
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
          // Sort by enrolledAt date (most recent first)
          return (
            new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
          );
      }
    });

    return filtered;
  }, [courses, searchQuery, filterStatus, sortBy]);

  // Use pagination hook
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedCourses,
    handlePageChange,
    totalItems,
  } = usePagination(filteredAndSortedCourses, COURSES_PER_PAGE);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CourseFilter />
        <CoursesLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <CourseFilter />
        <EnrolledCoursesError onRetry={refetch} />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="space-y-6">
        <CourseFilter />
        <EmptyState
          hasFilter={
            searchQuery.trim() !== "" || filterStatus !== CourseFilterStatus.ALL
          }
          onClearFilter={() => dispatch(resetFilters())}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CourseFilter />

      {filteredAndSortedCourses.length === 0 ? (
        <EmptyState
          hasFilter={
            searchQuery.trim() !== "" || filterStatus !== CourseFilterStatus.ALL
          }
          onClearFilter={() => dispatch(resetFilters())}
        />
      ) : (
        <>
          <div
            className={`grid gap-6 md:grid-cols-2 lg:grid-cols-${cols || 4}`}
          >
            {paginatedCourses.map((course) => (
              <CourseCard key={course.courseId} course={course} />
            ))}
          </div>

          {/* Pagination */}
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
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
