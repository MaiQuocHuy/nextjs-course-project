import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import { DashboardStats } from '@/types/instructor/dashboard';
import { ApiResponse } from '@/types/common';

export const dashboardStatsInstSlice = createApi({
  reducerPath: 'dashboardStatsInstSlice',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['DashboardStats'],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, undefined>({
      query: () => ({
        url: '/instructor/statistics',
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<DashboardStats>) => response.data,
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardStatsInstSlice;
