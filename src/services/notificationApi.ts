import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";
import type {
  ApiResponse,
  NotificationParams,
  PaginatedNotifications,
} from "@/types";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotificationsByUserId: builder.query<
      ApiResponse<PaginatedNotifications>,
      { userId: string } & NotificationParams
    >({
      query: ({ userId, page = 0, size = 10, sortBy = "createdAt", sortDir = "DESC" }) => ({
        url: `/notifications/user/${userId}`,
        params: { page, size, sortBy, sortDir },
      }),
      providesTags: ["Notification"],
    }),

    markNotificationAsRead: builder.mutation<
      ApiResponse<void>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteNotification: builder.mutation<
      ApiResponse<void>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsByUserIdQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
