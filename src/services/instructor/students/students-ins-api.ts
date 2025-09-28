import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import { ApiResponse, PaginatedData } from '@/types/common';
import {
  StudentDetailsFilters,
  StudentDetails,
  Students,
  StudentsFilters,
} from '@/types/instructor/students';
import { PaginatedQuizResults, QuizResultDetails } from '@/types/student';

export const studentsInstSlice = createApi({
  reducerPath: 'studentsInstSlice',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['StudentsIns'],
  endpoints: (builder) => ({
    // Get enrolled students
    getEnrolledStudents: builder.query<
      PaginatedData<Students>,
      StudentsFilters
    >({
      query: (params) => {
        let url = `/instructor/enrolled-students?page=${
          params.page || 0
        }&size=${params.size || 10}&sort=${params.sort || 'createdAt,desc'}`;

        // Add search term if provided
        if (params.search) {
          url += `&search=${encodeURIComponent(params.search)}`;
        }
        
        return {
          url,
          method: 'GET',
        };
      },
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

    // Get total number of enrolled students
    getNumOfEnrolledStudents: builder.query<number, void>({
      query: () => ({
        url: `/instructor/enrolled-students/count`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<number>) => {
        return response.data;
      },
      providesTags: [{ type: 'StudentsIns', id: 'LIST' }],
    }),

    // Get student details
    getStudentDetails: builder.query<StudentDetails, StudentDetailsFilters>({
      query: (params) => ({
        url: `/instructor/enrolled-students/${params.studentId}?page=${
          params.page || 0
        }&size=${params.size || 10}&sort=${params.sort || 'completedAt,desc'}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<StudentDetails>) => {
        return response.data;
      },
      providesTags: (_result, _error, arg) => [
        { type: 'StudentsIns', id: arg.studentId },
      ],
    }),

    // Get student quiz results
    getStudentQuizResults: builder.query<
      PaginatedQuizResults,
      { studentId: string; page?: number; size?: number; sort?: string }
    >({
      query: (params) => ({
        url: `/instructor/enrolled-students/${
          params.studentId
        }/quiz-scores?page=${params.page || 0}&size=${params.size || 10}&sort=${
          params.sort || 'completedAt,desc'
        }`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<PaginatedQuizResults>) => {
        return response.data;
      },
      providesTags: (_result, _error, arg) => [
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
      providesTags: (_result, _error, arg) => [
        { type: 'StudentsIns', id: arg.studentId },
      ],
    }),
  }),
});

export const {
  useGetEnrolledStudentsQuery,
  useGetNumOfEnrolledStudentsQuery,
  useGetStudentDetailsQuery,
  useGetStudentQuizResultsQuery,
  useGetStudentQuizResultsDetailsQuery,
} = studentsInstSlice;
