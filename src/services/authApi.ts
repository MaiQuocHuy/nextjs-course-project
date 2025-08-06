import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  // prepareHeaders: (headers, { getState }) => {
  //   headers.set(
  //     "Authorization",
  //     `Bearer eyJhbGciOiJIUzM4NCJ9.eyJyb2xlcyI6WyJBRE1JTiJdLCJzdWIiOiJhbGljZUBleGFtcGxlLmNvbSIsImlhdCI6MTc1MzcxMDcxMSwiZXhwIjoxNzUzNzE0MzExfQ.E8KcwjV07UuQh0tXa-y10DUclqX3gzaE94qUZN0kpM-8XKFAQ-CGVMwgrZtBr6_K`
  //   );

  //   return headers;
  // },
});

interface User {
  id: number;
  name: string;
  email: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    // Define your endpoints here
    login: builder.mutation({
      query: ({ email, password }: { email: string; password: string }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: "/admin/users",
        method: "GET",
        credentials: "include", // Include credentials if needed
      }),
      transformResponse: (response: { data: User[] }) => {
        console.log("Response data:", response);
        return response.data;
      },
    }),
  }),
});

export const { useLoginMutation, useGetUsersQuery } = authApi;
