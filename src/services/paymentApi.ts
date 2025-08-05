import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface CreateCheckoutSessionRequest {
  courseId: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  sessionUrl: string;
}

export interface PaymentStatus {
  id: string;
  sessionId: string;
  courseId: string;
  userId: string;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  course?: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    price: number;
  };
}

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    // Create checkout session
    createCheckoutSession: builder.mutation<
      CreateCheckoutSessionResponse,
      CreateCheckoutSessionRequest
    >({
      query: (data) => ({
        url: "/stripe/create-checkout-session",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => {
        console.log("Raw API response:", response);
        // Backend returns wrapped response with ApiResponse structure
        return response.data;
      },
      invalidatesTags: ["Payment"],
    }),

    // Get payment status by session ID
    getPaymentStatus: builder.query<PaymentStatus, string>({
      query: (sessionId) => ({
        url: `/stripe/payment-status/${sessionId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        console.log("Payment status API response:", response);
        // Backend returns wrapped response with ApiResponse structure
        return response.data;
      },
      providesTags: (result, error, sessionId) => [
        { type: "Payment", id: sessionId },
      ],
    }),

    // Get user's payment history
    getPaymentHistory: builder.query<PaymentStatus[], void>({
      query: () => ({
        url: "/stripe/payment-history",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        console.log("Payment history API response:", response);
        // Backend returns wrapped response with ApiResponse structure
        return response.data;
      },
      providesTags: ["Payment"],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetPaymentStatusQuery,
  useGetPaymentHistoryQuery,
} = paymentApi;
