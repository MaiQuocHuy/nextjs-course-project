import { createApi } from "@reduxjs/toolkit/query/react";
import { publicBaseQuery } from "@/lib/baseQueryWithReauth";

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  thumbnailUrl?: string;
  bio?: string;
  isActive?: boolean;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpires?: number; //* for test
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
  certificateFile: File;
  cvFile: File;
  supportingFile?: File;
}

interface RegisterUserResponse {
  data: User;
  message?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  data: AuthResponse;
  message?: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  data: {
    accessToken: string;
    refreshToken?: string;
  };
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: publicBaseQuery, // Use public base query for auth endpoints
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (tokenData) => ({
        url: "/auth/refresh",
        method: "POST",
        body: tokenData,
      }),
    }),

    logout: builder.mutation<{ message: string }, RefreshTokenRequest>({
      query: (tokenData) => ({
        url: "/auth/logout",
        method: "POST",
        body: tokenData,
      }),
    }),

    // Register for Instructor
    registerInstructor: builder.mutation<
      RegisterUserResponse,
      RegisterInstructorRequest
    >({
      query: ({
        name,
        email,
        password,
        role,
        portfolioUrl,
        certificateFile,
        cvFile,
        supportingFile,
      }) => {
        const formData = new FormData();

        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", role);
        formData.append("portfolio", portfolioUrl);
        formData.append("certificate", certificateFile);
        formData.append("cv", cvFile);

        if (supportingFile) {
          formData.append("other", supportingFile);
        }

        return {
          url: "/auth/register-application",
          method: "POST",
          body: formData,
        };
      },
    }),

    // Register for Student
    registerStudent: builder.mutation<
      RegisterUserResponse,
      RegisterStudentRequest
    >({
      query: ({ name, email, password, role }) => ({
        url: "/auth/register",
        method: "POST",
        body: { name, email, password, role },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useRegisterStudentMutation,
  useRegisterInstructorMutation,
} = authApi;
