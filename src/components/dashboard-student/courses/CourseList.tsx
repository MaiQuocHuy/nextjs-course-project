"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useGetEnrolledCoursesQuery } from "@/services/student/studentApi";
import { CourseCard } from "./CourseCard";
import { CourseFilter, type CourseFilterRef } from "./CourseFilter";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { CoursesLoadingSkeleton, EnrolledCoursesError } from "../ui";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import {
  resetFilters,
  setSearchQuery,
  CourseFilterStatus,
} from "@/store/slices/student/courseFilterSlice";
import { CustomPagination } from "@/components/ui/custom-pagination";

const COURSES_PER_PAGE = 6;

type CourseListProps = {
  cols?: number;
};

export function CourseList({ cols }: CourseListProps) {
  const dispatch = useAppDispatch();
  const { searchQuery, progressFilter, status, sortBy, sortDirection } =
    useAppSelector((state) => state.courseFilter);



  // Handle pagination via API
  const [currentPage, setCurrentPage] = useState(0);
  
  // Ref to communicate with CourseFilter component
  const courseFilterRef = useRef<CourseFilterRef>(null);

  // Proper reset handler that handles the search state correctly
  const handleResetFilters = () => {
    // Try to reset via CourseFilter component first (handles debounced search properly)
    if (courseFilterRef.current) {
      courseFilterRef.current.resetFilters();
    } else {
      // Fallback to direct Redux reset
      dispatch(resetFilters());
      dispatch(setSearchQuery(""));
    }
  };

  // Prepare API parameters with pagination
  const apiParams = useMemo(() => {
    const params: any = {
      sortBy,
      sortDirection,
      size: COURSES_PER_PAGE,
      page: currentPage,
    };

    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    if (progressFilter !== CourseFilterStatus.ALL) {
      params.progressFilter = progressFilter;
    }

    if (status) {
      params.status = status;
    }

    return params;
  }, [searchQuery, progressFilter, status, sortBy, sortDirection, currentPage]);

  const { data, error, isLoading, refetch } =
    useGetEnrolledCoursesQuery(apiParams);

  const courses = data?.content || [];
  const totalPages = data?.page?.totalPages || 1;
  const totalItems = data?.page?.totalElements || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, progressFilter, status, sortBy, sortDirection]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CourseFilter ref={courseFilterRef} />
        <CoursesLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <CourseFilter ref={courseFilterRef} />
        <EnrolledCoursesError onRetry={refetch} />
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="space-y-6">
        <CourseFilter ref={courseFilterRef} />
        <EmptyState
          hasFilter={
            searchQuery.trim() !== "" ||
            progressFilter !== CourseFilterStatus.ALL ||
            status !== null
          }
          onClearFilter={handleResetFilters}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CourseFilter ref={courseFilterRef} />

      {courses.length === 0 ? (
        <EmptyState
          hasFilter={
            searchQuery.trim() !== "" ||
            progressFilter !== CourseFilterStatus.ALL ||
            status !== null
          }
          onClearFilter={handleResetFilters}
        />
      ) : (
        <>
          <div
            className={`grid gap-6 md:grid-cols-2 lg:grid-cols-${cols || 4}`}
          >
            {courses.map((course) => (
              <CourseCard key={course.courseId} course={course} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <CustomPagination
              currentPage={currentPage + 1} // Convert to 1-based for UI
              totalPages={totalPages}
              onPageChange={(page) => handlePageChange(page - 1)} // Convert to 0-based for API
            />
          )}
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
