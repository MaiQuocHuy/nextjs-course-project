// src/services/geminiApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, localBaseQuery } from '@/lib/baseQueryWithReauth';

export interface QuestionType {
  id: string;
  questionText: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation?: string;
}

export const geminiApi = createApi({
  reducerPath: 'geminiApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['GeminiQuestions'],
  endpoints: (builder) => ({
    // Gọi backend để generate câu hỏi từ text
    generateQuestions: builder.mutation<
      QuestionType[],
      {
        sectionId: string;
        lessonId: string;
        text: string;
        numQuestions: number;
      }
    >({
      queryFn: async (data, api, extraOptions, baseQuery) => {
        try {
          const result = await localBaseQuery(
            { url: '/api/test-gemini', method: 'POST', body: data },
            api,
            extraOptions
          );

          console.log('Raw localBaseQuery result:', result);

          // localBaseQuery trả về { data: response } hoặc { error: errorData }
          if (result.error) {
            return { error: result.error };
          }

          // Xử lý response data
          let questions = [];
          const responseData = result.data as any;

          if (Array.isArray(responseData)) {
            questions = responseData;
          } else if (responseData?.mcqs && Array.isArray(responseData.mcqs)) {
            questions = responseData.mcqs;
          } else if (
            responseData?.data?.mcqs &&
            Array.isArray(responseData.data.mcqs)
          ) {
            questions = responseData.data.mcqs;
          } else if (responseData?.data && Array.isArray(responseData.data)) {
            questions = responseData.data;
          } else {
            console.warn('Unexpected response structure:', responseData);
            questions = [];
          }

          console.log('Processed questions:', questions);

          return { data: questions };
        } catch (error) {
          console.error('Error in generateQuestions queryFn:', error);
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
    }),

    // Lưu câu hỏi vào DB
    saveQuestions: builder.mutation<
      any,
      { sectionId: string; lessonId: string; questions: QuestionType[] }
    >({
      queryFn: async (data, api, extraOptions, baseQuery) => {
        try {
          console.log('Saving questions with data:', data);

          // Format dữ liệu theo cấu trúc backend yêu cầu
          const formattedQuestions = data.questions.map((question) => ({
            questionText: question.questionText,
            options: question.options, // Giữ nguyên Map<string, string> format
            correctAnswer: question.correctAnswer,
            explanation: question.explanation || '',
          }));

          const requestBody = {
            questions: formattedQuestions,
          };

          console.log('Formatted request body:', requestBody);

          // Sử dụng baseQueryWithReauth thay vì localBaseQuery để gọi Spring Boot backend
          const result = await baseQueryWithReauth(
            {
              url: `/instructor/sections/${data.sectionId}/lessons/quiz?lessonId=${data.lessonId}`,
              method: 'PUT',
              body: requestBody,
            },
            api,
            extraOptions
          );

          console.log('Save questions result:', result);

          if (result.error) {
            console.error('Save questions error:', result.error);
            return { error: result.error };
          }

          return { data: result.data };
        } catch (error) {
          console.error('Error in saveQuestions queryFn:', error);
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['GeminiQuestions'],
    }),
  }),
});

export const { useGenerateQuestionsMutation, useSaveQuestionsMutation } =
  geminiApi;
