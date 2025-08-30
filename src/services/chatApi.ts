import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";
import type {
  ChatMessage,
  ChatMessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
  UpdateMessageRequest,
  ChatApiResponse,
} from "@/types/chat";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ChatMessages"],
  endpoints: (builder) => ({
    // Get messages for a course with pagination
    getChatMessages: builder.query<
      ChatMessagesResponse,
      { courseId: string; page?: number; size?: number }
    >({
      query: ({ courseId, page = 0, size = 50 }) => ({
        url: `/chat/${courseId}/messages`,
        params: { page, size },
      }),
      providesTags: (result, error, { courseId }) => [
        { type: "ChatMessages", id: courseId },
      ],
    }),

    // Send a new message
    sendMessage: builder.mutation<
      SendMessageResponse,
      { courseId: string; message: SendMessageRequest }
    >({
      query: ({ courseId, message }) => ({
        url: `/chat/${courseId}/messages`,
        method: "POST",
        body: message,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "ChatMessages", id: courseId },
      ],
    }),

    // Delete a message
    deleteMessage: builder.mutation<
      ChatApiResponse,
      { courseId: string; messageId: string }
    >({
      query: ({ courseId, messageId }) => ({
        url: `/chat/${courseId}/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "ChatMessages", id: courseId },
      ],
    }),

    // Update/Edit a message
    updateMessage: builder.mutation<
      ChatMessage,
      {
        courseId: string;
        messageId: string;
        message: UpdateMessageRequest;
      }
    >({
      query: ({ courseId, messageId, message }) => ({
        url: `/chat/${courseId}/messages/${messageId}`,
        method: "PATCH",
        body: message,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "ChatMessages", id: courseId },
      ],
    }),
  }),
});

export const {
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useDeleteMessageMutation,
  useUpdateMessageMutation,
} = chatApi;
