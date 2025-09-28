export interface DiscountUsageUser {
  name: string;
  email: string;
  bio: string;
  thumbnailUrl: string;
}

export interface DiscountUsageCourse {
  id: string;
  title: string;
  price: number;
}

export interface DiscountUsageDiscount {
  id: string;
  code: string;
  description: string;
  type: "REFERRAL" | "GENERAL";
}

export interface DiscountUsage {
  id: string;
  discount: DiscountUsageDiscount;
  user: DiscountUsageUser;
  course: DiscountUsageCourse;
  referredByUser: DiscountUsageUser | null;
  usedAt: string;
  discountPercent: number;
  discountAmount: number;
}

export interface DiscountUsageResponse {
  statusCode: number;
  message: string;
  data: {
    content: DiscountUsage[];
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

export interface DiscountUsageQueryParams {
  page: number;
  size: number;
  search?: string;
  type?: "REFERRAL" | "GENERAL";
  fromDate?: string;
  toDate?: string;
}
