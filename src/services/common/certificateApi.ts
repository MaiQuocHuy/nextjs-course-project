import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, publicBaseQuery } from "@/lib/baseQueryWithReauth";
import {
  CertificatesResponse,
  CertificateDetailResponse,
  CertificateQueryParams,
} from "@/types/certificate";
import { ApiResponse, PaginatedData } from "@/types";

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

// Interface for the actual API response structure from the public endpoint
export interface PublicCertificateApiResponse {
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
  };
}

// Interface for the transformed response to match the component expectations
export interface TransformedCertificateResponse {
  id: string;
  certificateCode: string;
  issuedAt: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  instructorName: string;
  fileStatus: 'GENERATED' | 'PENDING';
  fileUrl?: string;
  certificateUrl?: string;
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
    
        // Get certificate details by ID (for authenticated users)
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

        // Public certificate search by code (no authentication required)
        getCertificateByCode: builder.query<TransformedCertificateResponse, string>({
          queryFn: async (certificateCode, _queryApi, _extraOptions, baseQuery) => {
            // Use publicBaseQuery for this specific endpoint
            const result = await publicBaseQuery(
              `certificates/code/${certificateCode}`,
              _queryApi,
              _extraOptions
            );

            if (result.error) {
              console.error('Public certificate API error:', result.error);
              return { 
                error: {
                  status: (result.error as any).status || 500,
                  data: { 
                    message: (result.error as any).data?.message || 'Certificate not found' 
                  }
                }
              };
            }

            // Transform the response
            const response = result.data as ApiResponse<PublicCertificateApiResponse>;
            console.log('Public certificate API response:', response);
            
            if (response.statusCode !== 200) {
              return {
                error: {
                  status: response.statusCode,
                  data: { message: response.message || 'Failed to fetch certificate' }
                }
              };
            }

            // Transform the API response to match our interface
            const data = response.data;
            const transformedData: TransformedCertificateResponse = {
              id: data.id,
              certificateCode: data.certificateCode,
              issuedAt: data.issuedAt,
              userName: data.user.name,
              userEmail: data.user.email,
              courseTitle: data.course.title,
              instructorName: data.course.instructorName,
              fileStatus: 'GENERATED' as const, // Assuming if we can retrieve it, it's generated
              fileUrl: data.fileUrl,
              certificateUrl: data.fileUrl, // Use same URL for both
            };

            return { data: transformedData };
          },
        }),
        
  }),
});

export const { 
  useGetMyCertificatesQuery,
  useGetCertificatesByCourseQuery,
  useGetCertificateByIdQuery,
  useGetCertificateByCodeQuery,
  useLazyGetCertificateByCodeQuery 
} = certificateApi;