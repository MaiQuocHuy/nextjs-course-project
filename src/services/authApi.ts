import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  // prepareHeaders: (headers, { getState }) => {
  //   headers.set(
  //     "Authorization",
  //     `Bearer eyJhbGciOiJIUzM4NCJ9.eyJyb2xlcyI6WyJBRE1JTiJdLCJzdWIiOiJhbGljZUBleGFtcGxlLmNvbSIsImlhdCI6MTc1Mzk1MDIxOCwiZXhwIjoxNzUzOTUzODE4fQ.V5nYTCx77oNaEEKBoXMbEJWvj2e9b8tWvUTWdbNaprqRz6IMxOFKf2NZMkZrLIQL`
  //   );

  //   return headers;
  // },
});
// const baseQueryWithSession = async (args:any, api:any, extraOptions:any) => {
//   const session = await getSession();
//   const token = session?.user?.accessToken; // lấy token từ session nè

//   const baseQuery = fetchBaseQuery({
//     baseUrl: process.env.NEXT_PUBLIC_API_BACKEND_URL,
//     prepareHeaders: (headers) => {
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`); // gắn token vào
//       }
//       return headers;
//     },
//   });

//   return baseQuery(args, api, extraOptions); // gọi tiếp API
// };

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
