import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './base-query';

export const coursesInstSlice = createApi({
  reducerPath: 'coursesInstSlice',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    // Fetch courses for instructor
    getCourses: builder.query({
      query: (courseParams) => ({
        url: `/instructor/courses?page=${courseParams.page || 0}&size=${
          courseParams.size || 10
        }&sort=${courseParams.sort || 'createdAt,desc'}`,
        method: 'GET',
        credentials: 'include', // Include credentials if needed
      }),
      transformResponse: (response) => {
        // console.log('Response data:', response);
        return response.data;
      },
    }),

    // Fetch course details
    getCourseDetails: builder.query({
      query: (courseId) => ({
        url: `/instructor/courses/${courseId}`,
        method: 'GET',
        credentials: 'include', // Include credentials if needed
      }),
      transformResponse: (response) => {
        // console.log('Course details response:', response);
        return response.data;
      },
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
        if (BasicInfoData.thumbnail) {
          formData.append('thumbnail', BasicInfoData.thumbnail);
        }
        return {
          url: '/instructor/courses',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response) => {
        // console.log('Created course response:', response);
        return response.data;
      },
    }),

    // Update an existing course
    updateCourse: builder.mutation({
      query: (courseData) => {
        const formData = new FormData();
        formData.append('title', courseData.title);
        formData.append('description', courseData.description);
        formData.append('price', courseData.price.toString());
        if (courseData.categoryIds) {
          courseData.categoryIds.forEach((id: string) => {
            formData.append('categoryIds', id);
          });
        }
        formData.append('level', courseData.level);
        if (courseData.thumbnail) {
          formData.append('thumbnail', courseData.thumbnail);
        }
        return {
          url: `/instructor/courses/${courseData.id}`,
          method: 'PUT',
          body: formData,
        };
      },
      transformResponse: (response) => {
        console.log('Updated course response:', response);
        return response.data;
      },
    }),

    // Delete a course
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/instructor/courses/${courseId}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => {
        console.log('Deleted course response:', response);
        return response.data;
      },
    }),

    getSections: builder.query({
      query: (courseId) => ({
        url: `/instructor/courses/${courseId}/sections`,
        method: 'GET',
      }),
      transformResponse: (response) => response.data,
    }),

    createSection: builder.mutation({
      query: ({ courseId, sectionData }) => ({
        url: `/instructor/courses/${courseId}/sections`,
        method: 'POST',
        body: sectionData,
      }),
      transformResponse: (response) => {
        console.log(response);

        return response;
      },
    }),

    updateSection: builder.mutation({
      query: ({ courseId, sectionId, sectionData }) => ({
        url: `/instructor/courses/${courseId}/sections/${sectionId}`,
        method: 'PUT',
        body: sectionData,
      }),
      transformResponse: (response) => response.data,
    }),

    deleteSection: builder.mutation({
      query: ({ courseId, sectionId }) => ({
        url: `/instructor/courses/${courseId}/sections/${sectionId}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.data,
    }),

    // Fetch lessons for a specific section
    getLessons: builder.query({
      query: (sectionId) => ({
        url: `/instructor/sections/${sectionId}/lessons`,
        method: 'GET',
      }),
      transformResponse: (response) => response.data,
    }),

    // Create a new lesson in a specific section
    createLesson: builder.mutation({
      query: ({ sectionId, lessonData }) => {
        const formData = new FormData();
        if (lessonData.videoFile) {
          formData.append('videoFile', lessonData.videoFile);
        }
        // Send title and type as query params, not in formData
        const params = new URLSearchParams({
          title: lessonData.title,
          type: lessonData.type,
        }).toString();

        return {
          url: `/instructor/sections/${sectionId}/lessons?${params}`,
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response) => {
        console.log(response);
        return response;
      },
    }),

    // Update an existing lesson
    updateLesson: builder.mutation({
      query: ({ sectionId, lessonId, lessonData }) => ({
        url: `/instructor/sections/${sectionId}/lessons/${lessonId}`,
        method: 'PUT',
        body: lessonData,
      }),
      transformResponse: (response) => response.data,
    }),

    // Delete a lesson from a specific section
    deleteLesson: builder.mutation({
      query: ({ sectionId, lessonId }) => ({
        url: `/instructor/sections/${sectionId}/lessons/${lessonId}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseDetailsQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetSectionsQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useGetLessonsQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = coursesInstSlice;
