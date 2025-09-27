"use client";
import { useMemo } from "react";
import {
  useGetEnrolledCoursesQuery,
  useGetCourseProgressQuery,
  useGetCourseStructureQuery,
} from "@/services/student/studentApi";
import type {
  CourseStructure,
  CourseProgress,
  CourseWithProgress,
} from "@/types/student";

/**
 * Hook to get course with sections and progress
 */
export function useCourseWithSections(courseId: string): {
  data: CourseWithProgress | undefined;
  isLoading: boolean;
  error: any;
  refetch: () => void;
} {
  // Get enrolled courses to find the specific course
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useGetEnrolledCoursesQuery({});

  // Get course progress
  const {
    data: progressData,
    isLoading: progressLoading,
    error: progressError,
    refetch: refetchProgress,
  } = useGetCourseProgressQuery(courseId, {
    skip: !courseId,
  });

  // Get course structure
  const {
    data: structureData,
    isLoading: structureLoading,
    error: structureError,
    refetch: refetchStructure,
  } = useGetCourseStructureQuery(courseId, {
    skip: !courseId,
  });

  // Combine loading and error states
  const isLoading = coursesLoading || progressLoading || structureLoading;
  const error = coursesError || progressError || structureError;

  // Calculate course data with progress
  const courseData = useMemo(() => {
    if (isLoading || error || !coursesData || !structureData || !progressData) {
      return undefined;
    }

    const courses = coursesData.content || [];
    const course = courses.find((c) => c.courseId === courseId);

    if (!course) {
      return undefined;
    }

    // Create a map of lesson progress for quick lookup
    const progressMap = new Map(
      progressData.lessons.map((lesson) => [lesson.lessonId, lesson])
    );

    // Transform structure data to include progress information
    const sectionsWithProgress = structureData.map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      orderIndex: section.order,
      lessonCount: section.lessonCount,
      lessons: section.lessons.map((lesson) => {
        const lessonProgress = progressMap.get(lesson.id);

        return {
          id: lesson.id,
          title: lesson.title,
          type: lesson.type,
          order: lesson.order,
          video: lesson.video,
          quiz: lesson.quiz,
          isCompleted: lessonProgress?.status === "COMPLETED",
          completedAt: lessonProgress?.completedAt || null,
          // Add lesson status from progress API for accessibility logic
          status: lessonProgress?.status || "LOCKED",
          progressOrder: lessonProgress?.order || lesson.order,
        };
      }),
    }));

    return {
      course,
      sections: sectionsWithProgress,
      progress: progressData.summary.percentage / 100, // Convert percentage to decimal
      progressSummary: progressData.summary,
      progressData, // Include raw progress data for reference
    };
  }, [coursesData, structureData, progressData, courseId, isLoading, error]);

  const refetch = () => {
    refetchProgress();
    refetchStructure();
  };

  return {
    data: courseData,
    isLoading,
    error,
    refetch,
  };
}
