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
} from "@/types/student/index";
import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";
import {
  getEmptyDashboardData,
  extractApiData,
  generateAllActivities,
  calculateLessonStatistics,
  calculateCourseStatistics,
  sortActivitiesByDate,
  createPaginatedActivities,
  fetchCourseSections,
} from "@/utils/student/dashboardHelpers";

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
    // Get course sections for a specific course
    getCourseSections: builder.query<CourseSections, string>({
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

    // Get complete dashboard data with detailed activities
    getDashboardDataComplete: builder.query<
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
          // Fetch enrolled courses
          const coursesResult = await fetchWithBQ({
            url: "/student/courses",
            method: "GET",
          });

          if (coursesResult.error) {
            return { error: coursesResult.error };
          }

          const coursesData = extractApiData<PaginatedCourses>(
            coursesResult as any
          );
          const courses = coursesData?.content ?? [];

          // Return empty data if no courses found
          if (courses.length === 0) {
            return { data: getEmptyDashboardData(size) };
          }

          // Fetch sections for all courses with error handling
          const courseWithSections = await fetchCourseSections(
            courses,
            fetchWithBQ
          );

          // Calculate lesson statistics
          const lessonStats = calculateLessonStatistics(courseWithSections);

          // Calculate course statistics
          const stats = calculateCourseStatistics(courses, lessonStats);

          // Generate all activities (enrollment, lessons, quizzes)
          const activities = generateAllActivities(courses, courseWithSections);

          // Sort activities by date and create paginated response
          const sortedActivities = sortActivitiesByDate(activities);
          const paginatedActivities = createPaginatedActivities(
            sortedActivities,
            page,
            size
          );

          return {
            data: {
              stats,
              activities: paginatedActivities,
            },
          };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: error instanceof Error ? error.message : String(error),
            },
          };
        }
      },
      providesTags: ["Course", "Lesson"],
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
  useGetCourseDetailsQuery,
  useGetCourseSectionsQuery,
  useGetDashboardDataCompleteQuery,
  useCompleteLessonMutation,
  useGetPaymentsQuery,
  useGetPaymentDetailQuery,
  useGetStudentReviewsQuery,
  useUpdateReviewMutation,
  useGetQuizResultsQuery,
  useGetQuizResultDetailsQuery,
  useSubmitQuizMutation,
} = studentApi;
