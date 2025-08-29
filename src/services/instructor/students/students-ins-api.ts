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
    // Fetch courses for instructor
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
  }),
});

export const { useGetEnrolledStudentsQuery } = studentsInstSlice;
