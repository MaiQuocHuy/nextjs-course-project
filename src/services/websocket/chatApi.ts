import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/baseQueryWithReauth";
import { ChatMessage, SendMessageData } from "./webSocketService";

export interface SendMessageRequest {
  courseId: string;
  tempId: string;
  type: "text" | "file" | "audio" | "video";
  content: string;
  fileName?: string | null;
  fileSize?: number | null;
  duration?: number | null;
  thumbnailUrl?: string | null;
}

export interface SendMessageResponse {
  statusCode: number;
  message: string;
  data: ChatMessage;
  timestamp: string;
}

export interface GetMessagesResponse {
  statusCode: number;
  message: string;
  data: {
    content: ChatMessage[];
    page: {
      number: number;
      size: number;
      totalElements: number;
      totalPages: number;
      first: boolean;
      last: boolean;
    };
  };
  timestamp: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  data: null;
  timestamp: string;
}

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQuery,
  tagTypes: ["ChatMessage"],
  endpoints: (builder) => ({
    // Send a message via REST API
    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: ({ courseId, ...messageData }) => ({
        url: `/chat/${courseId}/messages`,
        method: "POST",
        body: messageData,
      }),
      // Don't invalidate tags since we're using WebSocket for real-time updates
      // invalidatesTags: ["ChatMessage"], 
    }),

    // Get chat messages for a course (paginated)
    getCourseMessages: builder.query<
      GetMessagesResponse,
      {
        courseId: string;
        type?: "text" | "file" | "audio" | "video";
        page?: number;
        size?: number;
      }
    >({
      query: ({ courseId, type, page = 0, size = 20 }) => {
        const params: any = { page, size };
        if (type) params.type = type;

        return {
          url: `/chat/${courseId}/messages`,
          params,
        };
      },
      providesTags: ["ChatMessage"],
    }),
  }),
});

export const { useSendMessageMutation, useGetCourseMessagesQuery } = chatApi;
