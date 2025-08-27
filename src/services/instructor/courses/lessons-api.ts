import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';

export const lessonsInstSlice = createApi({
  reducerPath: 'lessonsInstSlice',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Courses'],
  endpoints: (builder) => ({
    // Fetch lessons for a specific section
    getLessons: builder.query({
      query: (sectionId) => ({
        url: `/instructor/sections/${sectionId}/lessons`,
        method: 'GET',
      }),
      transformResponse: (response) => response.data,
    }),

    // Create a new video lesson in a specific section
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
      invalidatesTags: [{ type: 'Courses', id: 'LIST' }],
    }),

    createLessonWithQuiz: builder.mutation({
      query: ({ sectionId, data }) => ({
        url: `/instructor/sections/${sectionId}/lessons/with-quiz`,
        method: 'POST',
        body: data,
      }),
     invalidatesTags: [{ type: 'Courses', id: 'LIST' }],
    }),

    // Update an existed video lesson
    updateVideoLesson: builder.mutation({
      query: ({ sectionId, lessonId, title, type, videoFile }) => {
        const formData = new FormData();

        // Add video file if provided
        if (videoFile) {
          formData.append('videoFile', videoFile);
        }

        // Build query parameters for title and type
        const params = new URLSearchParams();
        if (title) {
          params.append('title', title);
        }
        if (type) {
          params.append('type', type.toUpperCase()); // Ensure type is uppercase
        }
        const queryString = params.toString();

        return {
          url: `/instructor/sections/${sectionId}/lessons/${lessonId}${
            queryString ? `?${queryString}` : ''
          }`,
          method: 'PATCH',
          body: formData,
          headers: {
            accept: 'application/json',
          },
        };
      },
      invalidatesTags: [{ type: 'Courses', id: 'LIST' }],
    }),

    // Update an existed quiz lesson
    updateQuizLesson: builder.mutation({
      query: ({ sectionId, lessonId, questions }) => {
        const params = new URLSearchParams();
        if (lessonId) {
          params.append('lessonId', lessonId);
        }
        const queryString = params.toString();
        return {
          url: `/instructor/sections/${sectionId}/lessons/quiz${
            queryString ? `?${queryString}` : ''
          }`,
          method: 'PUT',
          body: { questions },
          headers: {
            accept: 'application/json',
          },
        };
      },
      invalidatesTags: [{ type: 'Courses', id: 'LIST' }],
    }),

    // Delete a lesson from a specific section
    deleteLesson: builder.mutation({
      query: ({ sectionId, lessonId }) => ({
        url: `/instructor/sections/${sectionId}/lessons/${lessonId}`,
        method: 'DELETE',
      }),
      // transformResponse: (response) => response.data,
      invalidatesTags: [{ type: 'Courses', id: 'LIST' }],
    }),

    reorderLessons: builder.mutation({
      query: ({ sectionId, lessonOrder }) => {
        return {
          url: `/instructor/sections/${sectionId}/lessons/reorder`,
          method: 'PATCH',
          body: { lessonOrder },
        };
      },
      invalidatesTags: [{ type: 'Courses', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetLessonsQuery,
  useCreateLessonMutation,
  useCreateLessonWithQuizMutation,
  useUpdateVideoLessonMutation,
  useUpdateQuizLessonMutation,
  useDeleteLessonMutation,
  useReorderLessonsMutation,
} = lessonsInstSlice;
