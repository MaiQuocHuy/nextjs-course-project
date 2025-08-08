import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import { createApi } from '@reduxjs/toolkit/query/react';

type User = {
    thumbnailUrl: string;
    name: string;
    role: string;
    email: string;
    bio: string; 
}

type UserResponse = {
    statusCode: number;
    message: string;
    data: User;
    timestamp: string;
}

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