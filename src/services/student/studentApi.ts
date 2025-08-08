import { use } from "react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  CourseSections,
  CourseStats,
  PaginatedCourses,
  ActivityFeedResponse,
  DashboardData,
  Course,
  Payment,
  PaymentDetail,
  PaginatedReviews,
  UpdateReviewRequest,
  UpdateReviewResponse,
  Activity,
  PaginatedQuizResults,
  QuizResultDetails,
  QuizSubmissionRequest,
  QuizSubmissionResponse,
} from "@/types/student";
import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Course", "Lesson", "Payment", "Review", "Quiz"],
  endpoints: (builder) => ({
    getEnrolledCourses: builder.query<PaginatedCourses, void>({
      query: () => ({
        url: "/student/courses",
        method: "GET",
      }),
      providesTags: ["Course"],
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
      providesTags: (result, error, courseId) => [
        { type: "Course", id: courseId },
        "Lesson",
      ],
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
          const activities: Activity[] = [];

          // Add course enrollment activities
          courses.forEach((course: Course) => {
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
                        completedAt: lesson.completedAt, // Random date within last 2 weeks
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
                          completedAt: lesson.completedAt, // Use the same completedAt date
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
              new Date(b.completedAt).getTime() -
              new Date(a.completedAt).getTime()
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
    // Combined hook to get course with sections for learning page
    getCourseWithSections: builder.query<
      { course: Course; sections: CourseSections; progress: number },
      string
    >({
      async queryFn(courseId, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          // Fetch enrolled courses to get course info
          const coursesResult = await fetchWithBQ({
            url: "/student/courses",
            method: "GET",
          });

          if (coursesResult.error) return { error: coursesResult.error };

          const coursesData = (coursesResult.data as any)?.data;
          const course = coursesData?.content?.find(
            (c: any) => c.courseId === courseId
          );

          if (!course) {
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: "Course not found",
                data: "Course not found",
              },
            };
          }

          // Fetch course sections
          const sectionsResult = await fetchWithBQ({
            url: `/student/courses/${courseId}`,
            method: "GET",
          });

          if (sectionsResult.error) return { error: sectionsResult.error };

          const sections = (sectionsResult.data as any)?.data || [];

          // Calculate progress based on completed lessons
          let completedLessons = 0;
          let totalLessons = 0;

          sections.forEach((section: any) => {
            if (section.lessons && Array.isArray(section.lessons)) {
              totalLessons += section.lessons.length;
              completedLessons += section.lessons.filter(
                (lesson: any) => lesson.isCompleted
              ).length;
            }
          });

          const progress =
            totalLessons > 0 ? completedLessons / totalLessons : 0;

          return {
            data: {
              course,
              sections,
              progress,
            },
          };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
      providesTags: (result, error, courseId) => [
        { type: "Course", id: courseId },
        "Lesson",
      ],
    }),

    // Complete a lesson
    completeLesson: builder.mutation<
      { success: boolean; message: string },
      { sectionId: string; lessonId: string; courseId: string }
    >({
      query: ({ sectionId, lessonId }) => ({
        url: `/student/sections/${sectionId}/lessons/${lessonId}/complete`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Course", id: courseId },
        "Lesson",
        "Course", // Invalidate all courses to update progress
      ],
      transformResponse: (response: { success: boolean; message: string }) => {
        return response;
      },
    }),

    // Get all payments
    getPayments: builder.query<Payment[], void>({
      query: () => ({
        url: "/student/payments",
        method: "GET",
      }),
      providesTags: ["Payment"],
      transformResponse: (response: { data: Payment[] }) => {
        return response.data;
      },
    }),

    // Get payment detail
    getPaymentDetail: builder.query<PaymentDetail, string>({
      query: (paymentId) => ({
        url: `/student/payments/${paymentId}`,
        method: "GET",
      }),
      providesTags: (result, error, paymentId) => [
        { type: "Payment", id: paymentId },
      ],
      transformResponse: (response: { data: PaymentDetail }) => {
        return response.data;
      },
    }),

    // Get student reviews
    getStudentReviews: builder.query<PaginatedReviews, void>({
      query: () => ({
        url: "/student/reviews",
        method: "GET",
      }),
      providesTags: ["Review"],
      transformResponse: (response: { data: PaginatedReviews }) => {
        return response.data;
      },
    }),

    // Update review
    updateReview: builder.mutation<
      UpdateReviewResponse,
      { reviewId: string; data: UpdateReviewRequest }
    >({
      query: ({ reviewId, data }) => ({
        url: `/student/reviews/${reviewId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Review"],
      transformResponse: (response: { data: UpdateReviewResponse }) => {
        return response.data;
      },
    }),
    //Quiz results
    getQuizResults: builder.query<PaginatedQuizResults, void>({
      query: () => ({
        url: "/student/quiz-score",
        method: "GET",
      }),
      providesTags: ["Quiz"],
      transformResponse: (response: { data: PaginatedQuizResults }) => {
        return response.data;
      },
    }),
    getQuizResultDetails: builder.query<QuizResultDetails, string>({
      query: (quizId) => ({
        url: `/student/quiz-score/${quizId}`,
        method: "GET",
      }),
      providesTags: (result, error, quizId) => [{ type: "Quiz", id: quizId }],
      transformResponse: (response: { data: QuizResultDetails }) => {
        return response.data;
      },
    }),

    // Submit quiz
    submitQuiz: builder.mutation<
      QuizSubmissionResponse,
      {
        sectionId: string;
        lessonId: string;
        answers: Record<string, string>;
      }
    >({
      query: ({ sectionId, lessonId, answers }) => ({
        url: `/student/sections/${sectionId}/lessons/${lessonId}/submit`,
        method: "PUT",
        body: { answers },
      }),
      invalidatesTags: (result, error, { sectionId, lessonId }) => [
        "Lesson",
        "Quiz",
        "Course", // Invalidate courses to update progress
        { type: "Lesson", id: lessonId },
      ],
      transformResponse: (response: { data: QuizSubmissionResponse }) => {
        return response.data;
      },
    }),
  }),
});

export const {
  useGetEnrolledCoursesQuery,
  useGetDashboardDataQuery,
  useGetCourseDetailsQuery,
  useGetCourseWithSectionsQuery,
  useCompleteLessonMutation,
  useGetPaymentsQuery,
  useGetPaymentDetailQuery,
  useGetStudentReviewsQuery,
  useUpdateReviewMutation,
  useGetQuizResultsQuery,
  useGetQuizResultDetailsQuery,
  useSubmitQuizMutation,
} = studentApi;
