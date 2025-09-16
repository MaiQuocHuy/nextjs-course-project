import type {
  Course,
  CourseSections,
  Activity,
  CourseStats,
  ActivityFeedResponse,
  Lesson,
} from "@/types/student/index";

// Types for better type safety
interface CourseWithSections {
  courseId: string;
  course: Course;
  sections: CourseSections;
}

interface LessonStats {
  completedLessons: number;
  totalLessons: number;
}

interface ApiResponse<T = any> {
  data?: { data?: T };
  error?: any;
}

/**
 * Safely extracts data from API response with proper typing
 */
export function extractApiData<T>(response: ApiResponse<T>): T | null {
  return response?.data?.data ?? null;
}

/**
 * Creates a course enrollment activity
 */
function createCourseEnrollmentActivity(course: Course): Activity {
  return {
    id: `course-${course.courseId}`,
    user_id: "current-user",
    type: "COURSE_ENROLLED",
    title: `Enrolled in Course: ${course.title}`,
    description: `Started learning ${course.title}`,
    completedAt: course.enrolledAt,
    courseId: course.courseId,
  };
}

/**
 * Creates a lesson completion activity
 */
function createLessonCompletionActivity(
  lesson: Lesson,
  course: Course
): Activity {
  return {
    id: `lesson-${lesson.id}`,
    user_id: "current-user",
    type: "LESSON_COMPLETED",
    title: `Completed Lesson: ${lesson.title}`,
    description: `Successfully completed ${lesson.title} in ${course.title}`,
    completedAt: lesson.completedAt!,
    courseId: course.courseId,
    lessonId: lesson.id,
  };
}

/**
 * Creates a quiz submission activity
 */
function createQuizSubmissionActivity(
  lesson: Lesson,
  course: Course
): Activity {
  return {
    id: `quiz-${lesson.id}`,
    user_id: "current-user",
    type: "QUIZ_SUBMITTED",
    title: `Submitted Quiz: ${lesson.title}`,
    description: `Quiz for ${lesson.title} in ${course.title}`,
    completedAt: lesson.completedAt!,
    courseId: course.courseId,
    lessonId: lesson.id,
  };
}

/**
 * Generates all activities from courses and their sections
 */
export function generateAllActivities(
  courses: Course[],
  courseWithSections: CourseWithSections[]
): Activity[] {
  const activities: Activity[] = [];

  // Add course enrollment activities
  courses.forEach((course) => {
    activities.push(createCourseEnrollmentActivity(course));
  });

  // Add lesson and quiz activities
  courseWithSections.forEach(({ course, sections }) => {
    sections?.forEach((section) => {
      section.lessons?.forEach((lesson) => {
        if (lesson.isCompleted && lesson.completedAt) {
          // Add lesson completion activity
          activities.push(createLessonCompletionActivity(lesson, course));

          // Add quiz activity for quiz lessons
          if (lesson.type === "QUIZ" && lesson.quiz) {
            activities.push(createQuizSubmissionActivity(lesson, course));
          }
        }
      });
    });
  });

  return activities;
}

/**
 * Calculates lesson statistics from course sections
 */
export function calculateLessonStatistics(
  courseWithSections: CourseWithSections[]
): LessonStats {
  let completedLessons = 0;
  let totalLessons = 0;

  courseWithSections.forEach(({ sections }) => {
    sections?.forEach((section) => {
      const lessons = section.lessons ?? [];
      totalLessons += lessons.length;
      completedLessons += lessons.filter((lesson) => lesson.isCompleted).length;
    });
  });

  return { completedLessons, totalLessons };
}

/**
 * Calculates course statistics
 */
export function calculateCourseStatistics(
  courses: Course[],
  lessonStats: LessonStats
): CourseStats {
  const totalCourses = courses.length;
  const completedCourses = courses.filter(
    (course) => course.completionStatus === "COMPLETED"
  ).length;
  const inProgressCourses = courses.filter(
    (course) => course.completionStatus === "IN_PROGRESS"
  ).length;

  return {
    totalCourses,
    completedCourses,
    inProgressCourses,
    completedLessons: lessonStats.completedLessons,
    totalLessons: lessonStats.totalLessons,
  };
}

/**
 * Sorts activities by completion date (most recent first)
 */
export function sortActivitiesByDate(activities: Activity[]): Activity[] {
  return activities.sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
}

/**
 * Creates paginated activity response
 */
export function createPaginatedActivities(
  activities: Activity[],
  page: number,
  size: number
): ActivityFeedResponse {
  const totalElements = activities.length;
  const totalPages = Math.ceil(totalElements / size);
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedActivities = activities.slice(startIndex, endIndex);

  return {
    content: paginatedActivities,
    page: {
      number: page,
      size,
      totalPages,
      totalElements,
      first: page === 0,
      last: page >= totalPages - 1,
    },
  };
}

/**
 * Fetches course sections with error handling
 */
export async function fetchCourseSections(
  courses: Course[],
  fetchWithBQ: any
): Promise<CourseWithSections[]> {
  const sectionsPromises = courses.map(
    async (course): Promise<CourseWithSections> => {
      try {
        const sectionsResult = await fetchWithBQ({
          url: `/student/courses/${course.courseId}`,
          method: "GET",
        });

        const sectionsData = extractApiData<CourseSections>(sectionsResult);

        return {
          courseId: course.courseId,
          course,
          sections: sectionsData ?? [],
        };
      } catch (error) {
        // Return empty sections on error to prevent breaking the whole chain
        return {
          courseId: course.courseId,
          course,
          sections: [],
        };
      }
    }
  );

  // Use Promise.allSettled to prevent one failure from breaking everything
  const results = await Promise.allSettled(sectionsPromises);

  return results
    .filter(
      (result): result is PromiseFulfilledResult<CourseWithSections> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value);
}
