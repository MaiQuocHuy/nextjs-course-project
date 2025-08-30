import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import { InsEarningsResponse } from '@/types/instructor/earnings';
import { ApiResponse } from '@/types/common';
import { MonthlyRevenue } from '@/types/instructor/dashboard';

interface GetInsEarningsParams {
  courseId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const earningsInstSlice = createApi({
  reducerPath: 'earningsInstSlice',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Earnings'],
  endpoints: (builder) => ({
    getInsEarnings: builder.query<InsEarningsResponse, GetInsEarningsParams>({
      query: (params: GetInsEarningsParams = {}) => {
        const {
          courseId,
          dateFrom,
          dateTo,
          page = 0,
          size = 10,
          sort = 'createdAt,asc',
        } = params;

        const queryParams = new URLSearchParams();
        if (courseId) queryParams.append('courseId', courseId);
        if (dateFrom) queryParams.append('dateFrom', dateFrom);
        if (dateTo) queryParams.append('dateTo', dateTo);
        queryParams.append('page', page.toString());
        queryParams.append('size', size.toString());
        queryParams.append('sort', sort);

        return {
          url: `/instructor/earnings?${queryParams.toString()}`,
        };
      },
      transformResponse: (response: any) => response.data,
      providesTags: ['Earnings'],
    }),

    getRecentEarnings: builder.query<MonthlyRevenue[], void>({
      query: () => `/instructor/earnings/recent-revenues`,
      transformResponse: (response: any) => response.data,
      providesTags: ['Earnings'],
    })
  }),
});

export const { useGetInsEarningsQuery, useGetRecentEarningsQuery } = earningsInstSlice;
