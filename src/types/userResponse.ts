export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  thumbnailUrl?: string;
  bio?: string;
  isActive?: boolean;
}

export interface ApplicationDetailResponse {
  id: number;
  status: string;
  documents: string;
  submittedAt: string;
  rejectionReason?: string;
  submitAttemptRemain?: number;
}

export interface apiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
}