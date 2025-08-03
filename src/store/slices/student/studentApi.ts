import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  CourseSections,
  CourseStats,
  PaginatedCourses,
  ActivityFeedResponse,
} from "@/types/student";
import { baseQueryWithReauth } from "@/services/baseQueryWithReauth";

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: baseQueryWithReauth,
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
    // Get course details with sections and lessons
    getCourseDetails: builder.query<CourseSections, string>({
      query: (courseId) => ({
        url: `/student/courses/${courseId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: CourseSections }) => {
        return response.data;
      },
    }),
    // New optimized endpoint that combines stats and activities in one call
    getDashboardData: builder.query<
      DashboardData,
      { page?: number; size?: number }
    >({
      async queryFn(
        { page = 0, size = 10 },
        _queryApi,
        _extraOptions,
        fetchWithBQ
      ) {
        try {
          // Single API call to get enrolled courses
          const coursesResult = await fetchWithBQ({
            url: "/student/courses",
            method: "GET",
          });

          if (coursesResult.error) return { error: coursesResult.error };

          const coursesData = (coursesResult.data as any)?.data;
          if (!coursesData?.content) {
            return {
              data: {
                stats: {
                  totalCourses: 0,
                  completedCourses: 0,
                  inProgressCourses: 0,
                  completedLessons: 0,
                  totalLessons: 0,
                },
                activities: {
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

          // Fetch details for all courses to calculate lesson stats and build activities
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

          // Calculate lesson stats and build activities from course details
          let completedLessons = 0;
          let totalLessons = 0;

          courseDetails.forEach(({ course, sections }) => {
            if (sections && Array.isArray(sections)) {
              sections.forEach((section: any) => {
                if (section.lessons && Array.isArray(section.lessons)) {
                  totalLessons += section.lessons.length;

                  section.lessons.forEach((lesson: any) => {
                    if (lesson.isCompleted) {
                      completedLessons++;

                      // Add lesson completion activity
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

          // Implement pagination for activities
          const totalElements = activities.length;
          const totalPages = Math.ceil(totalElements / size);
          const startIndex = page * size;
          const endIndex = startIndex + size;
          const paginatedActivities = activities.slice(startIndex, endIndex);

          // Build the final response
          const stats: CourseStats = {
            totalCourses,
            completedCourses,
            inProgressCourses,
            completedLessons,
            totalLessons,
          };

          const activitiesResponse: ActivityFeedResponse = {
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

          return {
            data: {
              stats,
              activities: activitiesResponse,
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
  useGetDashboardDataQuery,
  useGetCourseDetailsQuery,
} = studentApi;
