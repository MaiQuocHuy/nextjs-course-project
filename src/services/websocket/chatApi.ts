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

    // Update a message
    updateMessage: builder.mutation<
      UpdateMessageResponse,
      UpdateMessageRequest
    >({
      query: ({ messageId, content }) => ({
        url: `/chat/messages/${messageId}`,
        method: "PATCH",
        body: { content },
      }),
    }),

    // Delete a message
    deleteMessage: builder.mutation<
      DeleteMessageResponse,
      { messageId: string }
    >({
      query: ({ messageId }) => ({
        url: `/chat/messages/${messageId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetCourseMessagesQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = chatApi;
