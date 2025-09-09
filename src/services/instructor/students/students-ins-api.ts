import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import { ApiResponse, PaginatedData } from '@/types/common';
import { CoursesFilter } from '@/types/common';
import { StudentDetails, Students } from '@/types/instructor/students';
import { PaginatedQuizResults, QuizResultDetails } from '@/types/student';

interface EnrolledStudentFilters extends CoursesFilter {
  studentId: string;
}

export const studentsInstSlice = createApi({
  reducerPath: 'studentsInstSlice',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['StudentsIns'],
  endpoints: (builder) => ({
    // Get enrolled students
    getEnrolledStudents: builder.query<PaginatedData<Students>, CoursesFilter>({
      query: (courseParams) => ({
        url: `/instructor/enrolled-students?page=${
          courseParams.page || 0
        }&size=${courseParams.size || 10}&sort=${
          courseParams.sort || 'createdAt,desc'
        }`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<PaginatedData<Students>>) => {
        return response.data;
      },
      providesTags: (result) =>
        result && result.content
          ? [
              ...result.content.map((_, index) => {
                return {
                  type: 'StudentsIns' as const,
                  id: index,
                };
              }),
              { type: 'StudentsIns', id: 'LIST' },
            ]
          : [{ type: 'StudentsIns', id: 'LIST' }],
    }),

    // Get student details
    getStudentDetails: builder.query<StudentDetails, EnrolledStudentFilters>({
      query: (params) => ({
        url: `/instructor/enrolled-students/${params.studentId}?page=${
          params.page || 0
        }&size=${params.size || 10}&sort=${params.sort || 'completedAt,desc'}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<StudentDetails>) => {
        return response.data;
      },
      providesTags: (result, error, arg) => [{ type: 'StudentsIns', id: arg.studentId }],
    }),

    // Get student quiz results
    getStudentQuizResults: builder.query<
      PaginatedQuizResults,
      { studentId: string; page?: number; size?: number; sort?: string }
    >({
      query: (params) => ({
        url: `/instructor/enrolled-students/${params.studentId}/quiz-scores?page=${
          params.page || 0
        }&size=${params.size || 10}&sort=${params.sort || 'completedAt,desc'}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<PaginatedQuizResults>) => {
        return response.data;
      },
      providesTags: (result, error, arg) => [
        { type: 'StudentsIns', id: arg.studentId },
      ],
    }),

    // Get student quiz results details
    getStudentQuizResultsDetails: builder.query<
      QuizResultDetails,
      { studentId: string; quizResultId: string }
    >({
      query: (params) => ({
        url: `/instructor/enrolled-students/${params.studentId}/quiz-scores/${params.quizResultId}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<QuizResultDetails>) => {
        return response.data;
      },
      providesTags: (result, error, arg) => [
        { type: 'StudentsIns', id: arg.studentId },
      ],
    }),
  }),
});

export const {
  useGetEnrolledStudentsQuery,
  useGetStudentDetailsQuery,
  useGetStudentQuizResultsQuery,
  useGetStudentQuizResultsDetailsQuery
} = studentsInstSlice;
