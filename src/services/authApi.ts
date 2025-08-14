import { createApi } from "@reduxjs/toolkit/query/react";
import { publicBaseQuery } from "@/lib/baseQueryWithReauth";
import type { User, RegisterStudentRequest, RegisterInstructorRequest } from "@/types";

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpires?: number; //* for test
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
    refreshTokenExpires?: number;
    user?: User; // Optional updated user info
  };
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  statusCode: number;
  message: string;
  data: {
    message: string;
    maskedEmail: string;
    expiresAt: string;
    maxAttempts: number;
    previousTokensInvalidated: boolean;
  };
  timestamp: string;
}

interface ForgotPasswordConfirmRequest {
  email: string;
  otpCode: string; 
  newPassword: string;
  confirmPassword: string;
  passwordMatching: boolean;
}

interface ForgotPasswordConfirmResponse {
  statusCode: number;
  message: string;
  data: null;
  timestamp: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: publicBaseQuery,
  endpoints: (builder) => ({

    //forgot password
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    forgotPasswordConfirm: builder.mutation<ForgotPasswordConfirmResponse, ForgotPasswordConfirmRequest>({
      query: (body) => ({
        url: "/auth/forgot-password/confirm",
        method: "POST",
        body,
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
  useRegisterStudentMutation,
  useRegisterInstructorMutation,
  useForgotPasswordMutation,
  useForgotPasswordConfirmMutation
} = authApi;
