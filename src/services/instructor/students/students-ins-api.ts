import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import { ApiResponse, PaginatedData } from '@/types/common';
import { CoursesFilter } from '@/types/common';
import { Students } from '@/types/instructor/students';

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
    getStudentDetails: builder.query<Students, string>({
      query: (studentId) => ({
        url: `/instructor/enrolled-students/${studentId}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<Students>) => {
        return response.data;
      },
      providesTags: (result, error, id) => [
        { type: 'StudentsIns', id },
      ],
    }),
  }),
});

export const { useGetEnrolledStudentsQuery, useGetStudentDetailsQuery } = studentsInstSlice;
