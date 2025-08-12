import type {
  Course,
  CourseSections,
  CourseStats,
  Activity,
  ActivityFeedResponse,
  Section,
  Lesson,
} from "@/types/student";

/**
 * Calculate lesson statistics from course sections
 */
export function calculateLessonStats(sections: CourseSections): {
  completedLessons: number;
  totalLessons: number;
} {
  let completedLessons = 0;
  let totalLessons = 0;

  sections.forEach((section) => {
    if (section.lessons && Array.isArray(section.lessons)) {
      totalLessons += section.lessons.length;
      completedLessons += section.lessons.filter(
        (lesson) => lesson.isCompleted
      ).length;
    }
  });

  return { completedLessons, totalLessons };
}

/**
 * Calculate course progress from sections
 */
export function calculateCourseProgress(sections: CourseSections): number {
  const { completedLessons, totalLessons } = calculateLessonStats(sections);
  return totalLessons > 0 ? completedLessons / totalLessons : 0;
}

/**
 * Calculate course statistics from enrolled courses and their sections
 */
export function calculateCourseStats(
  courses: Course[],
  courseSectionsMap: Record<string, CourseSections>
): CourseStats {
  const totalCourses = courses.length;
  const completedCourses = courses.filter(
    (course) => course.completionStatus === "COMPLETED"
  ).length;
  const inProgressCourses = courses.filter(
    (course) => course.completionStatus === "IN_PROGRESS"
  ).length;

  let totalCompletedLessons = 0;
  let totalLessons = 0;

  courses.forEach((course) => {
    const sections = courseSectionsMap[course.courseId];
    if (sections) {
      const { completedLessons, totalLessons: courseLessons } =
        calculateLessonStats(sections);
      totalCompletedLessons += completedLessons;
      totalLessons += courseLessons;
    }
  });

  return {
    totalCourses,
    completedCourses,
    inProgressCourses,
    completedLessons: totalCompletedLessons,
    totalLessons,
  };
}

/**
 * Generate activities from courses and their sections
 */
export function generateActivities(
  courses: Course[],
  courseSectionsMap: Record<string, CourseSections>
): Activity[] {
  const activities: Activity[] = [];

  // Add course enrollment activities
  courses.forEach((course) => {
    activities.push({
      id: `course-${course.courseId}`,
      user_id: "current-user",
      type: "COURSE_ENROLLED",
      title: `Enrolled in Course: ${course.title}`,
      description: `Started learning ${course.title}`,
      completedAt: course.enrolledAt,
      courseId: course.courseId,
    });
  });

  // Add lesson and quiz activities
  courses.forEach((course) => {
    const sections = courseSectionsMap[course.courseId];
    if (sections && Array.isArray(sections)) {
      sections.forEach((section) => {
        if (section.lessons && Array.isArray(section.lessons)) {
          section.lessons.forEach((lesson) => {
            if (lesson.isCompleted && lesson.completedAt) {
              // Add lesson completion activity
              activities.push({
                id: `lesson-${lesson.id}`,
                user_id: "current-user",
                type: "LESSON_COMPLETED",
                title: `Completed Lesson: ${lesson.title}`,
                description: `Successfully completed ${lesson.title} in ${course.title}`,
                completedAt: lesson.completedAt,
                courseId: course.courseId,
                lessonId: lesson.id,
              });

              // Add quiz activities for quiz lessons
              if (lesson.type === "QUIZ" && lesson.quiz) {
                activities.push({
                  id: `quiz-${lesson.id}`,
                  user_id: "current-user",
                  type: "QUIZ_SUBMITTED",
                  title: `Submitted Quiz: ${lesson.title}`,
                  description: `Quiz for ${lesson.title} in ${course.title}`,
                  completedAt: lesson.completedAt,
                  courseId: course.courseId,
                  lessonId: lesson.id,
                });
              }
            }
          });
        }
      });
    }
  });

  // Sort activities by completed_at (most recent first)
  return activities.sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
}

/**
 * Paginate activities array
 */
export function paginateActivities(
  activities: Activity[],
  page: number = 0,
  size: number = 10
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
 * Find a specific course by ID from enrolled courses list
 */
export function findCourseById(
  courses: Course[],
  courseId: string
): Course | undefined {
  return courses.find((course) => course.courseId === courseId);
}
