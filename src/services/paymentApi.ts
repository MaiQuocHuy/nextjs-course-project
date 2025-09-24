import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";

export interface CreateCheckoutSessionRequest {
  courseId: string;
  discountCode?: string;
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

export interface ValidateDiscountRequest {
  discountCode: string;
  courseId: string;
}

export interface ValidateDiscountResponse {
  isValid: boolean;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  discountPercent: number;
  appliedDiscountCode?: string;
  discountApplied: boolean;
  currency?: string;
  message?: string;
}

export interface CreateReferralDiscountRequest {
  // No parameters needed - will be created for current user
}

export interface CreateReferralDiscountResponse {
  id: string;
  code: string;
  discountPercent: number;
  description: string;
  type: string;
  ownerUser: {
    id: string;
    name: string;
    email: string;
  };
  perUserLimit: number;
  isActive: boolean;
  currentUsageCount: number;
  remainingUsageCount?: number;
}

export interface AvailableDiscount {
  id: string;
  code: string;
  discountPercent: number;
  description: string;
  type: "GENERAL";
  usageLimit?: number;
  currentUsageCount: number;
  remainingUsageCount?: number; // -1 = unlimited, 0+ = limited
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Payment", "ReferralDiscount", "AvailableDiscounts"],
  endpoints: (builder) => ({
    // Create checkout session
    createCheckoutSession: builder.mutation<
      CreateCheckoutSessionResponse,
      CreateCheckoutSessionRequest
    >({
      query: (data) => {
        console.log("Creating checkout session with data:", data);
        return {
          url: "/stripe/create-checkout-session",
          method: "POST",
          body: data,
        };
      },
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

    // Validate discount code
    validateDiscount: builder.mutation<
      ValidateDiscountResponse,
      ValidateDiscountRequest
    >({
      query: (data) => ({
        url: "/stripe/calculate-price",
        method: "POST",
        body: {
          courseId: data.courseId,
          discountCode: data.discountCode,
        },
      }),
      transformResponse: (response: any) => {
        console.log("Calculate price API response:", response);
        const priceData = response.data;
        return {
          isValid: priceData.discountApplied || false,
          originalPrice: priceData.originalPrice || 0,
          discountAmount: priceData.discountAmount || 0,
          finalPrice: priceData.finalPrice || priceData.originalPrice || 0,
          discountPercent: priceData.discountPercent || 0,
          discountApplied: priceData.discountApplied || false,
          appliedDiscountCode: priceData.appliedDiscountCode,
          currency: priceData.currency || "VND",
          message: priceData.discountApplied
            ? "Discount applied successfully"
            : "Invalid discount code or discount has expired",
        };
      },
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
      transformErrorResponse: (error: any) => {
        // console.error("Payment history API error:", error);
        // Handle error response
        return error.data;
      },
      providesTags: ["Payment"],
    }),

    // Create personal referral discount code
    createReferralDiscount: builder.mutation<
      CreateReferralDiscountResponse,
      CreateReferralDiscountRequest
    >({
      query: () => ({
        url: "/common/discounts/induction",
        method: "POST",
        body: {},
      }),
      transformResponse: (response: any) => {
        console.log("Create referral discount API response:", response);
        // Backend returns wrapped response with ApiResponse structure
        return response.data;
      },
      transformErrorResponse: (error: any) => {
        // console.error("Create referral discount API error:", error);
        return error.data;
      },
      invalidatesTags: ["ReferralDiscount"],
    }),

    // Get user's existing referral discount code
    getUserReferralDiscount: builder.query<
      CreateReferralDiscountResponse,
      void
    >({
      query: () => ({
        url: "/common/discounts/my-induction",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        console.log("Get user referral discount API response:", response);
        // Backend returns wrapped response with ApiResponse structure
        return response.data;
      },
      transformErrorResponse: (error: any) => {
        // console.error("Get user referral discount API error:", error);
        return error.data;
      },
      providesTags: ["ReferralDiscount"],
    }),

    // Get available public discount codes
    getAvailableDiscounts: builder.query<AvailableDiscount[], void>({
      query: () => ({
        url: "/common/discounts/available",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        console.log("Get available discounts API response:", response);
        // Backend returns wrapped response with ApiResponse structure
        return response.data;
      },
      transformErrorResponse: (error: any) => {
        // console.error("Get available discounts API error:", error);
        return error.data;
      },
      providesTags: ["AvailableDiscounts"],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetPaymentStatusQuery,
  useGetPaymentHistoryQuery,
  useValidateDiscountMutation,
  useCreateReferralDiscountMutation,
  useGetUserReferralDiscountQuery,
  useGetAvailableDiscountsQuery,
} = paymentApi;
