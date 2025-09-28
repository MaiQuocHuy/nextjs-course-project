import { CommonFilters } from "../common";

// Get all refunds
export interface RefundsFilter {
  page?: number;
  size?: number;
  search?: string;
  status?: "PENDING" | "COMPLETED" | "FAILED";
  fromDate?: string;
  toDate?: string;
}

export interface PaymentUser {
  id: string;
  name: string;
  email: string;
  thumbnailUrl: string;
}

export interface RefundedCourse {
  id: string;
  title: string;
  thumbnailUrl: string;
  price: number;
}

export interface RefundPaymentBasic {
  id: string;
  amount: number;
  status: string;
  user: PaymentUser;
  course: RefundedCourse;
  createdAt: string;
}

export interface RefundResponse {
  id: string;
  payment: RefundPaymentBasic;
  reason: string;
  rejectedReason: string | null;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  requestedAt: string;
  processedAt: string | null;
}

// ========================================

// Get refund details
export interface PaymentCourse {
  id: string;
  title: string;
  thumbnailUrl: string;
}

export interface PaymentCourseDetail extends PaymentCourse {
  instructor: {
    id: string;
    name: string;
    email: string;
    thumbnailUrl: string;
  };
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  price: number;
}

export interface PaymentDetailResponse {
  id: string;
  user: PaymentUser;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  paymentMethod: string;
  createdAt: string;
  paidAt: string | null;
  updatedAt: string;
  transactionId: string | null;
  stripeSessionId: string | null;
  receiptUrl: string | null;
  course: PaymentCourseDetail;
}

export interface RefundDetailResponse {
  id: string;
  payment: PaymentDetailResponse;
  reason: string;
  rejectedReason: string | null;
  amount: number;
  status: string;
  requestedAt: string;
  processedAt: string | null;
}

// ========================================

// Update Refund Status
export interface UpdateRefundStatusRequest {
  id: string;
  status: "COMPLETED" | "FAILED";
  rejectedReason?: string;
}

export interface UpdateRefundStatusResponse {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
  reason: string;
  rejectedReason: string;
}

export interface RefundStatistics {
  total: number;
  completed: number;
  pending: number;
  failed: number;
}

export interface RefundStatisticsResponse {
  statusCode: number;
  message: string;
  data: RefundStatistics;
  timestamp: string;
}
