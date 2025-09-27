import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  PaginatedCourses,
  RecentActivity,
  Course,
  Payment,
  PaymentDetail,
  RefundRequest,
  RefundResponse,
  PaginatedReviews,
  UpdateReviewRequest,
  UpdateReviewResponse,
  PaginatedQuizResults,
  QuizResultDetails,
  QuizSubmissionResponse,
  PaginatedDiscountUsages,
  PaginatedAffiliatePayouts,
  CourseProgress,
  CourseStructure,
} from "@/types/student/index";
import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";
import {
  Comment,
  CommentCountResponse,
  CommentResponse,
  CommentsResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "@/types/student";
import {
  AffiliatePayoutStats,
  ReviewStats,
  PaymentStats,
  QuizResultStats,
  DashboardStats,
} from "@/types/student/statistics";

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Course",
    "Lesson",
    "Payment",
    "Review",
    "Quiz",
    "Comment",
    "CommentCount",
    "DiscountUsage",
    "AffiliatePayout",
  ],
  endpoints: (builder) => ({
    getEnrolledCourses: builder.query<
      PaginatedCourses,
      {
        search?: string;
        progressFilter?: string;
        status?: string;
        sortBy?: string;
        sortDirection?: string;
        page?: number;
        size?: number;
      }
    >({
      query: ({
        search,
        progressFilter,
        status,
        sortBy = "recent",
        sortDirection = "desc",
        page = 0,
        size = 20,
      } = {}) => {
        const params = new URLSearchParams();
        
        if (search?.trim()) params.append("search", search.trim());
        if (progressFilter) params.append("progressFilter", progressFilter);
        if (status) params.append("status", status);
        params.append("sortBy", sortBy);
        params.append("sortDirection", sortDirection);
        params.append("page", page.toString());
        params.append("size", size.toString());

        return {
          url: `/student/courses?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Course"],
      transformResponse: (response: { data: PaginatedCourses }) => {
        return response.data;
      },
    }),
    // Get enrolled courses without pagination
    getAllEnrolledCourses: builder.query<Course[], void>({
      query: () => ({
        method: "GET",
        url: "/student/courses/all", // Assuming a large size to get all courses
      }),
      providesTags: ["Course"],
      transformResponse: (response: { data: Course[] }) => {
        return response.data;
      },
    }),
    // Get 3 recent enrolled courses for dashboard
    getRecentEnrolledCourses: builder.query<Course[], void>({
      query: () => ({
        url: "/student/courses/recent",
        method: "GET",
      }),
      providesTags: ["Course"],
      transformResponse: (response: { data: Course[] }) => {
        return response.data;
      },
    }),
    // Get student dashboard statistics
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({
        url: "/student/courses/dashboard-stats",
        method: "GET",
      }),
      providesTags: ["Course"],
      transformResponse: (response: { data: DashboardStats }) => {
        return response.data;
      },
    }),
    // Get recent student activities
    getRecentActivities: builder.query<RecentActivity[], void>({
      query: () => ({
        url: "/student/courses/recent-activities",
        method: "GET",
      }),
      providesTags: ["Course"],
      transformResponse: (response: { data: RecentActivity[] }) => {
        return response.data;
      },
    }),
    // Get course progress for a specific course
    getCourseProgress: builder.query<CourseProgress, string>({
      query: (courseId) => ({
        url: `/student/courses/${courseId}/progress`,
        method: "GET",
      }),
      providesTags: (result, error, courseId) => [
        { type: "Course", id: courseId },
        "Lesson",
      ],
      transformResponse: (response: { data: CourseProgress }) => {
        return response.data;
      },
    }),
    // Get course structure for a specific course
    getCourseStructure: builder.query<CourseStructure, string>({
      query: (courseId) => ({
        url: `/student/courses/${courseId}/structure`,
        method: "GET",
      }),
      providesTags: (result, error, courseId) => [
        { type: "Course", id: courseId },
        "Lesson",
      ],
      transformResponse: (response: { data: CourseStructure }) => {
        return response.data;
      },
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

    // Request refund for a course
    requestRefund: builder.mutation<
      RefundResponse,
      { courseId: string; data: RefundRequest }
    >({
      query: ({ courseId, data }) => ({
        url: `/student/courses/${courseId}/refund-request`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment"],
      transformResponse: (response: {
        statusCode: number;
        message: string;
        data: RefundResponse;
        timestamp: string;
      }) => {
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
    // Get root comments for a lesson
    getRootComments: builder.query<
      CommentsResponse["data"],
      { lessonId: string; page?: number; size?: number }
    >({
      query: ({ lessonId, page = 0, size = 5 }) =>
        `/lessons/${lessonId}/comments/roots?page=${page}&size=${size}`,
      // Return both content and pagination metadata so UI can render
      // server-side pagination controls.
      transformResponse: (response: CommentsResponse) => response.data,
      providesTags: (result, error, { lessonId }) => [
        { type: "Comment", id: lessonId },
        { type: "Comment", id: "LIST" },
      ],
    }),

    // Get replies for a comment
    getReplies: builder.query<
      Comment[],
      { lessonId: string; commentId: string }
    >({
      query: ({ lessonId, commentId }) =>
        `/lessons/${lessonId}/comments/${commentId}/replies`,
      transformResponse: (response: { data: Comment[] }) => response.data,
      providesTags: (result, error, { commentId }) => [
        { type: "Comment", id: commentId },
      ],
    }),

    // Get comment count for a lesson
    getCommentCount: builder.query<number, string>({
      query: (lessonId) => `/lessons/${lessonId}/comments/count`,
      transformResponse: (response: CommentCountResponse) => response.data,
      providesTags: (result, error, lessonId) => [
        { type: "CommentCount", id: lessonId },
      ],
    }),

    // Create a new comment
    createComment: builder.mutation<
      Comment,
      { lessonId: string; data: CreateCommentRequest }
    >({
      query: ({ lessonId, data }) => ({
        url: `/lessons/${lessonId}/comments`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: CommentResponse) => response.data,
      // Invalidate both the lesson-level comment list and the parent comment
      // (if this is a reply) so that root lists and reply lists refetch.
      invalidatesTags: (result, error, { lessonId, data }) => {
        const tags: any[] = [
          { type: "Comment", id: lessonId },
          { type: "Comment", id: "LIST" },
          { type: "CommentCount", id: lessonId },
        ];

        if (data && (data as any).parentId) {
          tags.push({ type: "Comment", id: (data as any).parentId });
        }

        return tags;
      },
    }),

    // Update a comment
    updateComment: builder.mutation<
      Comment,
      { lessonId: string; commentId: string; data: UpdateCommentRequest }
    >({
      query: ({ lessonId, commentId, data }) => ({
        url: `/lessons/${lessonId}/comments/${commentId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: CommentResponse) => response.data,
      invalidatesTags: (result, error, { lessonId, commentId }) => [
        { type: "Comment", id: lessonId },
        { type: "Comment", id: commentId },
      ],
    }),

    // Delete a comment
    deleteComment: builder.mutation<
      void,
      { lessonId: string; commentId: string }
    >({
      query: ({ lessonId, commentId }) => ({
        url: `/lessons/${lessonId}/comments/${commentId}`,
        method: "DELETE",
      }),
      // Invalidate the lesson-level list, the comment count and the deleted
      // comment id so any replies/getReplies cache for that id will update.
      invalidatesTags: (result, error, { lessonId, commentId }) => [
        { type: "Comment", id: lessonId },
        { type: "Comment", id: "LIST" },
        { type: "CommentCount", id: lessonId },
        { type: "Comment", id: commentId },
      ],
    }),

    // ==============================
    // Discount Usage APIs
    // ==============================
    getDiscountUsages: builder.query<PaginatedDiscountUsages, void>({
      query: () => ({
        url: "/student/discount-usage",
        method: "GET",
      }),
      providesTags: ["DiscountUsage"],
      transformResponse: (response: { data: PaginatedDiscountUsages }) => {
        return response.data;
      },
    }),

    // ==============================
    // Affiliate Payout APIs
    // ==============================
    getAffiliatePayouts: builder.query<PaginatedAffiliatePayouts, void>({
      query: () => ({
        url: "/student/affiliate-payout",
        method: "GET",
      }),
      providesTags: ["AffiliatePayout"],
      transformResponse: (response: { data: PaginatedAffiliatePayouts }) => {
        return response.data;
      },
    }),

    getAffiliatePayoutStats: builder.query<AffiliatePayoutStats, void>({
      query: () => ({
        url: "/student/affiliate-payout/statistics",
        method: "GET",
      }),
      providesTags: ["AffiliatePayout"],
      transformResponse: (response: { data: AffiliatePayoutStats }) => {
        return response.data;
      },
    }),
    getQuizResultStatistics: builder.query<QuizResultStats, void>({
      query: () => ({
        url: "/student/quiz-stats",
        method: "GET",
      }),
      providesTags: ["Quiz"],
      transformResponse: (response: { data: QuizResultStats }) => {
        return response.data;
      },
    }),

    getPaymentStatistics: builder.query<PaymentStats, void>({
      query: () => ({
        url: "/student/payment-stats",
        method: "GET",
      }),
      providesTags: ["Payment"],
      transformResponse: (response: { data: PaymentStats }) => {
        return response.data;
      },
    }),
    getReviewStatistics: builder.query<ReviewStats, void>({
      query: () => ({
        url: "/student/review-stats",
        method: "GET",
      }),
      providesTags: ["Review"],
      transformResponse: (response: { data: ReviewStats }) => {
        return response.data;
      },
    }),
  }),
});

export const {
  useGetEnrolledCoursesQuery,
  useGetRecentEnrolledCoursesQuery,
  useGetAllEnrolledCoursesQuery,
  useGetCourseProgressQuery,
  useGetCourseStructureQuery,
  useGetDashboardStatsQuery,
  useGetRecentActivitiesQuery,
  useCompleteLessonMutation,
  useGetPaymentsQuery,
  useGetPaymentDetailQuery,
  useRequestRefundMutation,
  useGetStudentReviewsQuery,
  useUpdateReviewMutation,
  useGetQuizResultsQuery,
  useGetQuizResultDetailsQuery,
  useSubmitQuizMutation,
  useGetRootCommentsQuery,
  useGetRepliesQuery,
  useGetCommentCountQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetDiscountUsagesQuery,
  useGetAffiliatePayoutsQuery,
  useGetAffiliatePayoutStatsQuery,
  useGetQuizResultStatisticsQuery,
  useGetPaymentStatisticsQuery,
  useGetReviewStatisticsQuery,
} = studentApi;
