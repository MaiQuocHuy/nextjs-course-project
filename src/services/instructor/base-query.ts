import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  prepareHeaders: (headers) => {
    headers.set(
      'Authorization',
      `Bearer ${
        typeof window !== 'undefined' && localStorage.getItem('accessToken')
      }`
    );
    return headers;
  },
});
