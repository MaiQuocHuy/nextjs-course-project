import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  prepareHeaders: async (headers, api) => {
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

interface RegisterStudentRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}
interface RegisterInstructorRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  portfolioUrl: string;
  certificateFiles: File[];
  cvFile: File[];
  supportingFiles?: File[];
}

interface RegisterUserResponse {
  data: User;
  message?: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    // Define your endpoints here

    //* Register for Instructor
    registerInstructor: builder.mutation<RegisterUserResponse, RegisterInstructorRequest>({
      query: ({ name, email, password, role, portfolioUrl, certificateFiles, cvFile, supportingFiles }) => {
        const formData = new FormData();
        
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);
        formData.append('portfolio', portfolioUrl); 
        
        if (certificateFiles.length > 0) {
          formData.append('certificate', certificateFiles[0]); // Backend expects single certificate file
        }
        
        if (cvFile.length > 0) {
          formData.append('cv', cvFile[0]); 
        }

        if (supportingFiles && supportingFiles.length > 0) {
          formData.append('other', supportingFiles[0]);
        }
        
        for (let [key, value] of formData.entries()) {
          console.log(key, value instanceof File ? `File: ${value.name}` : value);
        }
        
        return {
          url: "/auth/register-application",
          method: "POST",
          body: formData,
        };
      },
    }),

    //* Register for Student
    registerStudent: builder.mutation<RegisterUserResponse, RegisterStudentRequest>({
      query: ({ name, email, password, role }) => ({
        url: "/auth/register",
        method: "POST",
        body: { name, email, password, role },
      }),
    }),
    
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

export const { useRegisterStudentMutation, useRegisterInstructorMutation, useLogoutMutation } = authApi;
