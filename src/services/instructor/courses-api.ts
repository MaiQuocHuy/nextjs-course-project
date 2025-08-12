import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';

export const coursesInstSlice = createApi({
  reducerPath: 'coursesInstSlice',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Fetch courses for instructor
    getCourses: builder.query({
      query: (courseParams) => ({
        url: `/instructor/courses?page=${courseParams.page || 0}&size=${
          courseParams.size || 10
        }&sort=${courseParams.sort || 'createdAt,desc'}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
        // console.log('Response data:', response);
        return response.data;
      },
    }),

    // Fetch course details
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/courses/${courseId}`,
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
        if (BasicInfoData.file) {
          formData.append('thumbnail', BasicInfoData.file);
        }
        return {
          url: '/instructor/courses',
          method: 'POST',
          body: formData,
        };
      },
    }),

    // Update an existing course
    updateCourse: builder.mutation({
      query: (courseData) => {
        const formData = new FormData();
        formData.append('id', courseData.id);
        formData.append('title', courseData.title);
        formData.append('description', courseData.description);
        formData.append('price', courseData.price.toString());
        if (courseData.categoryIds) {
          courseData.categoryIds.forEach((id: string) => {
            formData.append('categoryIds', id);
          });
        }
        formData.append('level', courseData.level);
        if (courseData.file) {
          formData.append('thumbnail', courseData.file);
        }
        return {
          url: `/instructor/courses/${courseData.id}`,
          method: 'PATCH',
          body: formData,
        };
      },
    }),

    // Delete a course
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/instructor/courses/${courseId}`,
        method: 'DELETE',
      }),
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
        // console.log(response);
        return response;
      },
    }),

    updateSection: builder.mutation({
      query: ({ courseId, sectionId, sectionData }) => {
        return {
          url: `/instructor/courses/${courseId}/sections/${sectionId}`,
          method: 'PATCH',
          body: sectionData,
        };
      },
      // transformResponse: (response) => response.data,
    }),

    deleteSection: builder.mutation({
      query: ({ courseId, sectionId }) => ({
        url: `/instructor/courses/${courseId}/sections/${sectionId}`,
        method: 'DELETE',
      }),
      // transformResponse: (response) => response.data,
    }),

    reorderSections: builder.mutation({
      query: ({ courseId, sectionOrder }) => {
        return {
          url: `/instructor/courses/${courseId}/sections/reorder`,
          method: 'PATCH',
          body: { sectionOrder },
        };
      },
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
        // console.log(response);
        return response;
      },
    }),

    // Update an existing lesson
    updateLesson: builder.mutation({
      query: ({ sectionId, lessonId, title, type, videoFile }) => {
        const formData = new FormData();

        // Add title if provided
        if (title) {
          formData.append('title', title);
        }

        // Add type if provided
        if (type) {
          formData.append('type', type);
        }

        // Add video file if provided
        if (videoFile) {
          formData.append('videoFile', videoFile);
        }

        return {
          url: `/instructor/sections/${sectionId}/lessons/${lessonId}`,
          method: 'PATCH',
          body: formData,
        };
      },
    }),

    // Delete a lesson from a specific section
    deleteLesson: builder.mutation({
      query: ({ sectionId, lessonId }) => ({
        url: `/instructor/sections/${sectionId}/lessons/${lessonId}`,
        method: 'DELETE',
      }),
      // transformResponse: (response) => response.data,
    }),

    reorderLessons: builder.mutation({
      query: ({ sectionId, lessonOrder }) => {
        return {
          url: `/instructor/sections/${sectionId}/lessons/reorder`,
          method: 'PATCH',
          body: { lessonOrder },
        };
      },
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetSectionsQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useReorderSectionsMutation,
  useGetLessonsQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useReorderLessonsMutation,
} = coursesInstSlice;
