import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";


const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  prepareHeaders: async (headers) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  },
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
    logout: builder.mutation<void, void>({
      query: () => {
        const refreshToken = typeof window !== 'undefined' 
          ? localStorage.getItem("refreshToken") 
          : null;
        
        return {
          url: "/auth/logout",
          method: "POST",
          body: refreshToken ? { refreshToken } : {},
        };
      },
    }),
    
  }),
});

export const { useLogoutMutation } = authApi;
