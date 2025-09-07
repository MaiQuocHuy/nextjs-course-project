import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, publicBaseQuery } from "@/lib/baseQueryWithReauth";
import {
  CertificatesResponse,
  CertificateDetailResponse,
  CertificateQueryParams,
} from "@/types/certificate";
import { ApiResponse, PaginatedData } from "@/types";
// import { CertificateFilter, InstructorCertificate, InstructorCertificateDetail } from "../instructor/certificates/certificatesApi";

export interface InstructorCertificate {
  id: string;
  certificateCode: string;
  issuedAt: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  instructorName: string;
  fileStatus: 'GENERATED' | 'PENDING';
}

export interface InstructorCertificateDetail {
  id: string;
  certificateCode: string;
  issuedAt: string;
  fileUrl?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    instructorName: string;
  };
}

export interface CertificateFilter {
  page?: number;
  size?: number;
  sort?: string;
}


export const certificateApi = createApi({
  reducerPath: "certificateApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Certificate",'InstructorCertificates', 'CourseCertificates'],
  endpoints: (builder) => ({
    // Get user's certificates (for authenticated users)
    getMyCertificates: builder.query<CertificatesResponse, CertificateQueryParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        
        if (params && params.page !== undefined) searchParams.append("page", params.page.toString());
        if (params && params.size !== undefined) searchParams.append("size", params.size.toString());
        if (params && params.sort) searchParams.append("sort", params.sort);

        const queryString = searchParams.toString();
        return `certificates/my-certificates${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Certificate"]
    }),

    getCertificatesByCourse: builder.query<
          PaginatedData<InstructorCertificate>,
          { courseId: string } & CertificateFilter
        >({
          query: ({ courseId, page = 0, size = 10, sort = 'issuedAt,desc' }) => ({
            url: `/certificates/course/${courseId}?page=${page}&size=${size}&sort=${sort}`,
            method: 'GET',
          }),
          transformResponse: (response: ApiResponse<PaginatedData<InstructorCertificate>>) => {
            return response.data;
          },
          providesTags: (result, error, { courseId }) =>
            result
              ? [
                  ...result.content.map(({ id }) => ({
                    type: 'CourseCertificates' as const,
                    id,
                  })),
                  { type: 'CourseCertificates', id: `course-${courseId}` },
                ]
              : [{ type: 'CourseCertificates', id: `course-${courseId}` }],
        }),
    
        // Get certificate details by ID
        getCertificateById: builder.query<InstructorCertificateDetail, string>({
          query: (certificateId) => ({
            url: `/certificates/${certificateId}`,
            method: 'GET',
          }),
          transformResponse: (response: ApiResponse<InstructorCertificateDetail>) => {
            return response.data;
          },
          providesTags: (result, error, id) => [
            { type: 'InstructorCertificates', id },
          ],
        }),
        
  }),
});

// Create a separate query for public certificate endpoint without auth
const publicCertificateApi = createApi({
  reducerPath: "publicCertificateApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getCertificateByCode: builder.query<CertificateDetailResponse, string>({
      query: (certificateCode) => `certificates/code/${certificateCode}`,
    }),
  }),
});

export const { useGetMyCertificatesQuery,useGetCertificatesByCourseQuery,
  useGetCertificateByIdQuery, } = certificateApi;
export const { useGetCertificateByCodeQuery } = publicCertificateApi;

// Export both APIs for store configuration
export { publicCertificateApi };