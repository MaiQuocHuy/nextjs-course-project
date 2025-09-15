"use client";
import { useMemo } from "react";
import {
  useGetEnrolledCoursesQuery,
  useGetCourseSectionsQuery,
  useGetDashboardDataCompleteQuery,
} from "@/services/student/studentApi";
import type {
  DashboardData,
  Course,
  CourseSections,
  CourseStats,
  ActivityFeedResponse,
} from "@/types/student/index";

/**
 * Hook to get dashboard data with stats and activities
 * Uses the complete dashboard endpoint to get all lesson and quiz activities
 */
export function useDashboardData(
  options: {
    page?: number;
    size?: number;
  } = {}
) {
  const { page = 0, size = 10 } = options;

  // Use the complete dashboard data endpoint that includes all activities
  return useGetDashboardDataCompleteQuery({ page, size });
}

/**
 * Hook to get course with sections and progress
 */
export function useCourseWithSections(courseId: string) {
  // Get enrolled courses to find the specific course
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useGetEnrolledCoursesQuery();

  // Get course sections
  const {
    data: sectionsData,
    isLoading: sectionsLoading,
    error: sectionsError,
    refetch: refetchSections,
  } = useGetCourseSectionsQuery(courseId, {
    skip: !courseId,
  });

  // Combine loading and error states
  const isLoading = coursesLoading || sectionsLoading;
  const error = coursesError || sectionsError;

  // Calculate course data with progress
  const courseData = useMemo(() => {
    if (isLoading || error || !coursesData || !sectionsData) {
      return undefined;
    }

    const courses = coursesData.content || [];
    const course = courses.find((c) => c.courseId === courseId);

    if (!course) {
      return undefined;
    }

    // Calculate progress based on completed lessons
    let completedLessons = 0;
    let totalLessons = 0;

    sectionsData.forEach((section) => {
      if (section.lessons && Array.isArray(section.lessons)) {
        totalLessons += section.lessons.length;
        completedLessons += section.lessons.filter(
          (lesson) => lesson.isCompleted
        ).length;
      }
    });

    const progress = totalLessons > 0 ? completedLessons / totalLessons : 0;

    return {
      course,
      sections: sectionsData,
      progress,
    };
  }, [coursesData, sectionsData, courseId, isLoading, error]);

  const refetch = () => {
    refetchSections();
  };

  return {
    data: courseData,
    isLoading,
    error,
    refetch,
  };
}
