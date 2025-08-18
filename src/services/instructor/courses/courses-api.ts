import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import type { Course } from '@/types/instructor/courses';
import { ApiResponse, PaginatedData } from '@/types/apiResponse';
import { CoursesFilter } from '@/services/coursesApi';

const errorsHandler = (response: { status: number; data: any }) => {
  let errorMessage = 'Failed to create course';
  if (response.status === 409) {
    errorMessage = 'A course with this title already exists';
  } else {
    errorMessage = response.data.message;
  }
  return {
    status: response.status,
    message: errorMessage,
    data: response.data,
  };
};

export const coursesInstSlice = createApi({
  reducerPath: 'coursesInstSlice',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Courses'],
  endpoints: (builder) => ({
    // Fetch courses for instructor
    getCourses: builder.query<PaginatedData<Course>, CoursesFilter>({
      query: (courseParams) => ({
        url: `/instructor/courses?page=${courseParams.page || 0}&size=${
          courseParams.size || 10
        }&sort=${courseParams.sort || 'createdAt,desc'}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<PaginatedData<Course>>) => {
        // console.log('Response data:', response);
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }: { id: string }) => ({
                type: 'Courses' as const,
                id,
              })),
              { type: 'Courses', id: 'LIST' },
            ]
          : [{ type: 'Courses', id: 'LIST' }],
    }),

    // Fetch course details
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/instructor/courses/${courseId}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
        // console.log('Course details response:', response.data);
        return response.data;
      },
      providesTags: (result) =>
        result ? [{ type: 'Courses', id: result.id }] : [],
    }),

    // Create a new course
    createCourse: builder.mutation({
      query: (BasicInfoData) => {
        const formData = new FormData();
        formData.append('title', BasicInfoData.title);
        formData.append('description', BasicInfoData.description);
        formData.append('price', BasicInfoData.price.toString());
        if (BasicInfoData.categoryIds) {
          BasicInfoData.categoryIds.forEach((id: string) => {
            formData.append('categoryIds', id);
          });
        }
        formData.append('level', BasicInfoData.level);
        if (BasicInfoData.file) {
          formData.append('thumbnail', BasicInfoData.file);
        }
        return {
          url: '/instructor/courses',
          method: 'POST',
          body: formData,
        };
      },
      transformErrorResponse: (response: { status: number; data: any }) =>
        errorsHandler(response),
      invalidatesTags: [{ type: 'Courses', id: 'LIST' }],
    }),

    // Update an existing course
    updateCourse: builder.mutation({
      query: (courseData) => {
        const formData = new FormData();
        formData.append('id', courseData.id);
        if (courseData.title) {
          formData.append('title', courseData.title);
        }
        if (courseData.description) {
          formData.append('description', courseData.description);
        }
        if (courseData.price) {
          formData.append('price', courseData.price.toString());
        }
        if (courseData.categoryIds) {
          courseData.categoryIds.forEach((id: string) => {
            formData.append('categoryIds', id);
          });
        }
        if (courseData.level) {
          formData.append('level', courseData.level);
        }
        if (courseData.file) {
          formData.append('thumbnail', courseData.file);
        }
        return {
          url: `/instructor/courses/${courseData.id}`,
          method: 'PATCH',
          body: formData,
        };
      },
      transformErrorResponse: (response: { status: number; data: any }) =>
        errorsHandler(response),
      invalidatesTags: (result, error, data) => [
        { type: 'Courses', id: 'LIST' },
        { type: 'Courses', id: data.id },
      ],
    }),

    // Delete a course
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/instructor/courses/${courseId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, courseId) => [
        { type: 'Courses', id: 'LIST' },
        { type: 'Courses', id: courseId },
      ],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = coursesInstSlice;
