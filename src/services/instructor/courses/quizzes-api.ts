import { createApi } from '@reduxjs/toolkit/query/react';
import { localBaseQuery } from '@/lib/baseQueryWithReauth';
import { QuizQuestion } from '@/types/instructor/courses';

export const quizzesInstSlice = createApi({
  reducerPath: 'quizzesInstSlice',
  baseQuery: localBaseQuery,
  endpoints: (builder) => ({
    generateQuestions: builder.mutation<
      QuizQuestion[],
      {
        text: string;
        numQuestions: number;
      }
    >({
      query: (data) => ({
        url: '/api/test-gemini',
        method: 'POST',
        body: data
      }),
      transformResponse: (response: any) => {
        // Handle different response structures
        if (Array.isArray(response)) {
          return response;
        }
        if (response?.mcqs && Array.isArray(response.mcqs)) {
          return response.mcqs;
        }
        if (response?.data?.mcqs && Array.isArray(response.data.mcqs)) {
          return response.data.mcqs;
        }
        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        }
        console.warn('Unexpected response structure:', response);
        return [];
      },
    }),
  }),
});

export const { useGenerateQuestionsMutation } = quizzesInstSlice;