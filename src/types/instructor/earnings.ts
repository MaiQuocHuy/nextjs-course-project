import { Page } from '../common';

export interface InsEarningsDetail {
  id: string;
  courseId: string;
  courseTitle: string;
  courseThumbnailUrl: string;
  paymentId: string;
  amount: number;
  platformCut: number;
  instructorShare: number;
  status: string;
  paidAt: string;
}

export interface InsEarnings {
  content: InsEarningsDetail[];
  page: Page;
}

export interface InsEarningsResponse {
  earnings: InsEarnings;
  summary: {
    totalEarnings: number;
    paidAmount: number;
    totalTransactions: number;
  };
}
