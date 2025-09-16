import { ApiResponse, PaginatedData } from "./apiResponse";

export interface Certificate {
  id: string;
  certificateCode: string;
  issuedAt: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  instructorName: string;
  fileStatus: "GENERATED" | "PENDING";
}

export interface CertificateListData {
  content: Certificate[];
  page: {
    number: number;
    size: number;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
  };
}

export interface CertificateDetail {
  id: string;
  certificateCode: string;
  issuedAt: string;
  fileUrl: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    instructorName: string;
  }
}

export type CertificatesResponse = ApiResponse<CertificateListData>;
export type CertificateDetailResponse = ApiResponse<CertificateDetail>;

// Query parameters for fetching certificates
export interface CertificateQueryParams {
  page?: number;
  size?: number;
  sort?: string; // Changed to match API format: "field,direction"
}
