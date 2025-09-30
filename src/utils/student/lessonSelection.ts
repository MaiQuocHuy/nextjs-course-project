/**
 * Utility functions for lesson selection logic
 * Extracted from LearningPageClient for reusability and testing
 */

import type { TransformedSection, TransformedLesson } from "@/types/student";

/**
 * Find the first accessible lesson across all sections
 */
export const findFirstAccessibleLesson = (
  sections: TransformedSection[]
): TransformedLesson | null => {
  for (const section of sections) {
    for (const lesson of section.lessons) {
      if (lesson.status === "COMPLETED" || lesson.status === "UNLOCKED") {
        return lesson;
      }
    }
  }
  return null;
};

/**
 * Find next accessible lesson after the current one
 */
export const findNextAccessibleLesson = (
  sections: TransformedSection[],
  currentLessonId: string
): TransformedLesson | null => {
  let foundCurrent = false;
  for (const section of sections) {
    for (const lesson of section.lessons) {
      if (
        foundCurrent &&
        (lesson.status === "COMPLETED" || lesson.status === "UNLOCKED")
      ) {
        return lesson;
      }
      if (lesson.id === currentLessonId) {
        foundCurrent = true;
      }
    }
  }
  return null;
};

/**
 * Find a lesson by ID and verify it's accessible
 */
export const findAccessibleLessonById = (
  sections: TransformedSection[],
  lessonId: string
): TransformedLesson | null => {
  for (const section of sections) {
    const lesson = section.lessons.find(
      (lesson) =>
        lesson.id === lessonId &&
        (lesson.status === "COMPLETED" || lesson.status === "UNLOCKED")
    );
    if (lesson) return lesson;
  }
  return null;
};

/**
 * Get lesson selection strategy based on saved lesson and course data
 */
export const getLessonSelectionStrategy = (
  sections: TransformedSection[],
  savedLessonId: string | null
): {
  selectedLesson: TransformedLesson | null;
  strategy: "saved" | "first" | "none";
  reason: string;
} => {
  // Find first accessible lesson
  const firstAccessibleLesson = findFirstAccessibleLesson(sections);

  if (!firstAccessibleLesson) {
    return {
      selectedLesson: null,
      strategy: "none",
      reason: "No accessible lessons found",
    };
  }

  // If there's no saved lesson, use first accessible
  if (!savedLessonId) {
    return {
      selectedLesson: firstAccessibleLesson,
      strategy: "first",
      reason: "No saved lesson, selecting first accessible",
    };
  }

  // Check if saved lesson is still accessible
  const savedLesson = findAccessibleLessonById(sections, savedLessonId);

  if (savedLesson) {
    return {
      selectedLesson: savedLesson,
      strategy: "saved",
      reason: "Saved lesson is still accessible",
    };
  } else {
    return {
      selectedLesson: firstAccessibleLesson,
      strategy: "first",
      reason:
        "Saved lesson is no longer accessible, selecting first accessible",
    };
  }
};

/**
 * Validate lesson accessibility
 */
export const isLessonAccessible = (lesson: TransformedLesson): boolean => {
  return lesson.status === "COMPLETED" || lesson.status === "UNLOCKED";
};

/**
 * Get all accessible lessons from sections
 */
export const getAllAccessibleLessons = (
  sections: TransformedSection[]
): TransformedLesson[] => {
  const accessibleLessons: TransformedLesson[] = [];

  for (const section of sections) {
    for (const lesson of section.lessons) {
      if (isLessonAccessible(lesson)) {
        accessibleLessons.push(lesson);
      }
    }
  }

  return accessibleLessons;
};

/**
 * Get lesson statistics
 */
export const getLessonStatistics = (sections: TransformedSection[]) => {
  let totalLessons = 0;
  let completedLessons = 0;
  let unlockedLessons = 0;
  let lockedLessons = 0;

  for (const section of sections) {
    for (const lesson of section.lessons) {
      totalLessons++;

      switch (lesson.status) {
        case "COMPLETED":
          completedLessons++;
          break;
        case "UNLOCKED":
          unlockedLessons++;
          break;
        case "LOCKED":
          lockedLessons++;
          break;
      }
    }
  }

  return {
    totalLessons,
    completedLessons,
    unlockedLessons,
    lockedLessons,
    accessibleLessons: completedLessons + unlockedLessons,
    progressPercentage:
      totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
  };
};
