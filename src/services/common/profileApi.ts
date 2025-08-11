import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import { createApi } from '@reduxjs/toolkit/query/react';
import { UserResponse } from '@/types'; 

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query<UserResponse, void>({
      query: () => {
        return {
          url: '/users/profile',
          method: 'GET',
        };
      },
      providesTags: ['Profile'],
      // no cache
      keepUnusedDataFor: 0,
    }),

  }),
});

export const { useGetProfileQuery } = profileApi;