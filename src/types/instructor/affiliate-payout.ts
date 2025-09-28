export interface AffiliatePayoutUser {
  name: string;
  email: string;
  bio: string;
  thumbnailUrl: string;
}

export interface AffiliatePayoutCourse {
  id: string;
  title: string;
  price: number;
}

export interface AffiliatePayoutDiscount {
  id: string;
  code: string;
  description: string;
  type: string;
}

export interface AffiliatePayoutDiscountUsage {
  id: string;
  discount: AffiliatePayoutDiscount;
  user: AffiliatePayoutUser;
  usedAt: string;
  discountPercent: number;
  discountAmount: number;
}

export interface AffiliatePayout {
  id: string;
  referredByUser: AffiliatePayoutUser;
  course: AffiliatePayoutCourse;
  discountUsage: AffiliatePayoutDiscountUsage | null;
  commissionPercent: number;
  commissionAmount: number;
  payoutStatus: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  paidAt: string | null;
  updatedAt: string;
  cancelledAt: string | null;
}

export interface AffiliatePayoutResponse {
  statusCode: number;
  message: string;
  data: {
    content: AffiliatePayout[];
    page: {
      number: number;
      size: number;
      totalPages: number;
      totalElements: number;
      first: boolean;
      last: boolean;
    };
  };
  timestamp: string;
}

export interface AffiliatePayoutQueryParams {
  page: number;
  size: number;
  search?: string;
  status?: "PENDING" | "PAID" | "CANCELLED";
  fromDate?: string;
  toDate?: string;
}
