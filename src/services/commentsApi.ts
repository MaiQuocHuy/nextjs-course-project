import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";
import type {
  Comment,
  CommentResponse,
  CommentsResponse,
  CommentCountResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "@/types/comments";

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Comment", "CommentCount"],
  endpoints: (builder) => ({
    // Get root comments for a lesson
    getRootComments: builder.query<
      CommentsResponse["data"],
      { lessonId: string; page?: number; size?: number }
    >({
      query: ({ lessonId, page = 0, size = 5 }) =>
        `/lessons/${lessonId}/comments/roots?page=${page}&size=${size}`,
      // Return both content and pagination metadata so UI can render
      // server-side pagination controls.
      transformResponse: (response: CommentsResponse) => response.data,
      providesTags: (result, error, { lessonId }) => [
        { type: "Comment", id: lessonId },
        { type: "Comment", id: "LIST" },
      ],
    }),

    // Get replies for a comment
    getReplies: builder.query<
      Comment[],
      { lessonId: string; commentId: string }
    >({
      query: ({ lessonId, commentId }) =>
        `/lessons/${lessonId}/comments/${commentId}/replies`,
      transformResponse: (response: { data: Comment[] }) => response.data,
      providesTags: (result, error, { commentId }) => [
        { type: "Comment", id: commentId },
      ],
    }),

    // Get comment count for a lesson
    getCommentCount: builder.query<number, string>({
      query: (lessonId) => `/lessons/${lessonId}/comments/count`,
      transformResponse: (response: CommentCountResponse) => response.data,
      providesTags: (result, error, lessonId) => [
        { type: "CommentCount", id: lessonId },
      ],
    }),

    // Create a new comment
    createComment: builder.mutation<
      Comment,
      { lessonId: string; data: CreateCommentRequest }
    >({
      query: ({ lessonId, data }) => ({
        url: `/lessons/${lessonId}/comments`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: CommentResponse) => response.data,
      // Invalidate both the lesson-level comment list and the parent comment
      // (if this is a reply) so that root lists and reply lists refetch.
      invalidatesTags: (result, error, { lessonId, data }) => {
        const tags: any[] = [
          { type: "Comment", id: lessonId },
          { type: "Comment", id: "LIST" },
          { type: "CommentCount", id: lessonId },
        ];

        if (data && (data as any).parentId) {
          tags.push({ type: "Comment", id: (data as any).parentId });
        }

        return tags;
      },
    }),

    // Update a comment
    updateComment: builder.mutation<
      Comment,
      { lessonId: string; commentId: string; data: UpdateCommentRequest }
    >({
      query: ({ lessonId, commentId, data }) => ({
        url: `/lessons/${lessonId}/comments/${commentId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: CommentResponse) => response.data,
      invalidatesTags: (result, error, { lessonId, commentId }) => [
        { type: "Comment", id: lessonId },
        { type: "Comment", id: commentId },
      ],
    }),

    // Delete a comment
    deleteComment: builder.mutation<
      void,
      { lessonId: string; commentId: string }
    >({
      query: ({ lessonId, commentId }) => ({
        url: `/lessons/${lessonId}/comments/${commentId}`,
        method: "DELETE",
      }),
      // Invalidate the lesson-level list, the comment count and the deleted
      // comment id so any replies/getReplies cache for that id will update.
      invalidatesTags: (result, error, { lessonId, commentId }) => [
        { type: "Comment", id: lessonId },
        { type: "Comment", id: "LIST" },
        { type: "CommentCount", id: lessonId },
        { type: "Comment", id: commentId },
      ],
    }),
  }),
});

export const {
  useGetRootCommentsQuery,
  useGetRepliesQuery,
  useGetCommentCountQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
