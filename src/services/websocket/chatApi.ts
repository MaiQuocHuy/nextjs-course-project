import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/baseQueryWithReauth";
import {
  GetMessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
  UpdateMessageRequest,
  UpdateMessageResponse,
  DeleteMessageResponse,
} from "@/types/chat";

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
        type?: "TEXT" | "FILE" | "AUDIO" | "VIDEO";
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

    // Update a message
    updateMessage: builder.mutation<
      UpdateMessageResponse,
      UpdateMessageRequest
    >({
      query: ({ courseId, messageId, type, content }) => ({
        url: `/chat/${courseId}/messages/${messageId}`,
        method: "PATCH",
        body: { type, content },
      }),
      // Invalidate cache to refetch messages after update
      invalidatesTags: ["ChatMessage"],
    }),

    // Delete a message
    deleteMessage: builder.mutation<
      DeleteMessageResponse,
      { courseId: string; messageId: string }
    >({
      query: ({ courseId, messageId }) => ({
        url: `/chat/${courseId}/messages/${messageId}`,
        method: "DELETE",
      }),
      // Invalidate cache to refetch messages after delete
      invalidatesTags: ["ChatMessage"],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetCourseMessagesQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = chatApi;
