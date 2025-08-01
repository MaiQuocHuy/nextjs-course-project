import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  CourseSections,
  CourseStats,
  PaginatedCourses,
  ActivityFeedResponse,
} from "@/types/student";

// Type for course stats

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    headers.set(
      "Authorization",
      `Bearer eyJhbGciOiJIUzM4NCJ9.eyJyb2xlcyI6WyJTVFVERU5UIl0sInN1YiI6ImJvYkBleGFtcGxlLmNvbSIsImlhdCI6MTc1NDAzNjcxNSwiZXhwIjoxNzU0MDQwMzE1fQ.CMbpZPZH046vBfQMlFfngBAyWedu5ufsOnbaAQQ1_X_G1gGjqdRL5SNIMhKHuIFv`
    );
    return headers;
  },
});

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery,
  endpoints: (builder) => ({
    getEnrolledCourses: builder.query<PaginatedCourses, void>({
      query: () => ({
        url: "/student/courses",
        method: "GET",
      }),
      transformResponse: (response: { data: PaginatedCourses }) => {
        return response.data;
      },
    }),
    getEnrolledCourseDetails: builder.query<CourseSections, string>({
      query: (courseId) => ({
        url: `/student/courses/${courseId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: CourseSections }) => {
        return response.data;
      },
    }),
    // New endpoint to calculate course stats from enrolled courses
    getCourseStats: builder.query<CourseStats, void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          // First get enrolled courses
          const coursesResult = await fetchWithBQ({
            url: "/student/courses",
            method: "GET",
          });

          if (coursesResult.error) return { error: coursesResult.error };

          const coursesData = (coursesResult.data as any)?.data;
          if (!coursesData?.content) {
            return {
              data: {
                totalCourses: 0,
                completedCourses: 0,
                inProgressCourses: 0,
                completedLessons: 0,
                totalLessons: 0,
              },
            };
          }

          const courses = coursesData.content;

          // Calculate basic course stats
          const totalCourses = courses.length;
          const completedCourses = courses.filter(
            (course: any) => course.completionStatus === "COMPLETED"
          ).length;
          const inProgressCourses = courses.filter(
            (course: any) => course.completionStatus === "IN_PROGRESS"
          ).length;

          // Fetch details for all courses to calculate lesson stats
          const detailsPromises = courses.map(async (course: any) => {
            const detailResult = await fetchWithBQ({
              url: `/student/courses/${course.courseId}`,
              method: "GET",
            });
            return detailResult.data ? (detailResult.data as any).data : null;
          });

          const allDetails = await Promise.all(detailsPromises);
          const validDetails = allDetails.filter(Boolean);

          // Calculate lesson stats
          let completedLessons = 0;
          let totalLessons = 0;

          validDetails.forEach((sections: any) => {
            if (sections && Array.isArray(sections)) {
              sections.forEach((section: any) => {
                if (section.lessons && Array.isArray(section.lessons)) {
                  totalLessons += section.lessons.length;
                  completedLessons += section.lessons.filter(
                    (lesson: any) => lesson.isCompleted
                  ).length;
                }
              });
            }
          });

          return {
            data: {
              totalCourses,
              completedCourses,
              inProgressCourses,
              completedLessons,
              totalLessons,
            },
          };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
    }),
    // Get activity feed - build from completed lessons in enrolled courses
    getActivityFeed: builder.query<
      ActivityFeedResponse,
      { page?: number; size?: number }
    >({
      async queryFn(
        { page = 0, size = 10 },
        _queryApi,
        _extraOptions,
        fetchWithBQ
      ) {
        try {
          // First get enrolled courses
          const coursesResult = await fetchWithBQ({
            url: "/student/courses",
            method: "GET",
          });

          if (coursesResult.error) return { error: coursesResult.error };

          const coursesData = (coursesResult.data as any)?.data;
          if (!coursesData?.content) {
            return {
              data: {
                content: [],
                page: {
                  number: 0,
                  size,
                  totalPages: 0,
                  totalElements: 0,
                  first: true,
                  last: true,
                },
              },
            };
          }

          const courses = coursesData.content;
          const activities: any[] = [];

          // Add course enrollment activities
          courses.forEach((course: any) => {
            activities.push({
              id: `course-${course.courseId}`,
              user_id: "current-user",
              type: "COURSE_ENROLLED",
              title: `Enrolled in Course: ${course.title}`,
              description: `Started learning ${course.title}`,
              completed_at: new Date(
                Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
              ).toISOString(), // Random date within last week
              courseId: course.courseId,
            });
          });

          // Fetch details for courses to get completed lessons
          const detailsPromises = courses.map(async (course: any) => {
            const detailResult = await fetchWithBQ({
              url: `/student/courses/${course.courseId}`,
              method: "GET",
            });
            return {
              course,
              sections: detailResult.data
                ? (detailResult.data as any).data
                : null,
            };
          });

          const courseDetails = await Promise.all(detailsPromises);

          // Extract completed lessons and create activities
          courseDetails.forEach(({ course, sections }) => {
            if (sections && Array.isArray(sections)) {
              sections.forEach((section: any) => {
                if (section.lessons && Array.isArray(section.lessons)) {
                  section.lessons.forEach((lesson: any) => {
                    if (lesson.isCompleted) {
                      activities.push({
                        id: `lesson-${lesson.id}`,
                        user_id: "current-user",
                        type: "LESSON_COMPLETED",
                        title: `Completed Lesson: ${lesson.title}`,
                        description: `Successfully completed ${lesson.title} in ${course.title}`,
                        completed_at: new Date(
                          Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000
                        ).toISOString(), // Random date within last 2 weeks
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
                          description: `Quiz completed with good performance`,
                          completed_at: new Date(
                            Date.now() -
                              Math.random() * 14 * 24 * 60 * 60 * 1000
                          ).toISOString(),
                          score: Math.floor(Math.random() * 25) + 75, // Random score between 75-100
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
          activities.sort(
            (a, b) =>
              new Date(b.completed_at).getTime() -
              new Date(a.completed_at).getTime()
          );

          // Implement pagination
          const totalElements = activities.length;
          const totalPages = Math.ceil(totalElements / size);
          const startIndex = page * size;
          const endIndex = startIndex + size;
          const paginatedActivities = activities.slice(startIndex, endIndex);

          return {
            data: {
              content: paginatedActivities,
              page: {
                number: page,
                size,
                totalPages,
                totalElements,
                first: page === 0,
                last: page >= totalPages - 1,
              },
            },
          };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
    }),
  }),
});

export const {
  useGetEnrolledCoursesQuery,
  useGetEnrolledCourseDetailsQuery,
  useGetCourseStatsQuery,
  useGetActivityFeedQuery,
} = studentApi;
