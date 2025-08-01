import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  prepareHeaders: (headers, { getState }) => {
    headers.set(
      'Authorization',
      `Bearer eyJhbGciOiJIUzM4NCJ9.eyJyb2xlcyI6WyJJTlNUUlVDVE9SIl0sInN1YiI6ImNoYXJsaWVAZXhhbXBsZS5jb20iLCJpYXQiOjE3NTQwMzE1ODcsImV4cCI6MTc1NDAzNTE4N30.OFNTK_r35BbJfuZKL9kA-sc49q1stIjv7cp5tegAndbgU0E645MJoLNZgP4rF4Rl`
    );
    return headers;
  },
});

// export const courseApi = createApi({
//   reducerPath: 'courseApi',
//   baseQuery: baseQuery,
//   endpoints: (builder) => ({
//     getInstructorCourses: builder.query<User[], void>({
//       query: () => ({
//         url: '/admin/users',
//         method: 'GET',
//         credentials: 'include', // Include credentials if needed
//       }),
//       transformResponse: (response: { data: User[] }) => {
//         console.log('Response data:', response);
//         return response.data;
//       },
//     }),
//   }),
// });
