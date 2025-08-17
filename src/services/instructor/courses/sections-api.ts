import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';

export const sectionsInstSlice = createApi({
  reducerPath: 'sectionsInstSlice',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Courses'],
  endpoints: (builder) => ({
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
      invalidatesTags: (result, error, data) => {
        return [
          { type: 'Courses', id: 'LIST' },
          { type: 'Courses', id: `${data.courseId}` },
        ];
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
      invalidatesTags: (result, error, data) => [
        { type: 'Courses', id: 'LIST' },
        { type: 'Courses', id: `${data.courseId}` },
      ],
    }),

    deleteSection: builder.mutation({
      query: ({ courseId, sectionId }) => ({
        url: `/instructor/courses/${courseId}/sections/${sectionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, data) => [
        { type: 'Courses', id: 'LIST' },
        { type: 'Courses', id: `${data.courseId}` },
      ],
    }),

    reorderSections: builder.mutation({
      query: ({ courseId, sectionOrder }) => {
        return {
          url: `/instructor/courses/${courseId}/sections/reorder`,
          method: 'PATCH',
          body: { sectionOrder },
        };
      },
      invalidatesTags: (result, error, data) => [
        { type: 'Courses', id: 'LIST' },
        { type: 'Courses', id: `${data.courseId}` },
      ],
    }),
  }),
});

export const {
  useGetSectionsQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useReorderSectionsMutation,
} = sectionsInstSlice;
