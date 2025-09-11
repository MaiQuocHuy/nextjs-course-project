import { createApi } from '@reduxjs/toolkit/query/react';
import { publicBaseQuery } from '@/lib/baseQueryWithReauth';

// Certificate types for public API
export interface PublicCertificate {
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

export interface PublicApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export const publicCertificatesApi = createApi({
  reducerPath: 'publicCertificatesApi',
  baseQuery: publicBaseQuery,
  tagTypes: ['PublicCertificate'],
  endpoints: (builder) => ({
    // Get certificate by certificate code (public endpoint - no auth required)
    getCertificateByCode: builder.query<PublicCertificate, string>({
      query: (certificateCode) => ({
        url: `/certificates/code/${encodeURIComponent(certificateCode)}`,
        method: 'GET',
      }),
      transformResponse: (response: PublicApiResponse<PublicCertificate>) => {
        console.log('Public certificate API response:', response);
        if (response.statusCode !== 200) {
          throw new Error(response.message || 'Failed to fetch certificate');
        }
        return response.data;
      },
      transformErrorResponse: (response: { status: number; data: any }) => {
        console.error('Public certificate API error:', response);
        return {
          status: response.status,
          message: response.data?.message || 'Certificate not found',
          data: response.data,
        };
      },
      providesTags: (_result, _error, certificateCode) => [
        { type: 'PublicCertificate', id: certificateCode },
      ],
    }),
  }),
});

export const {
  useGetCertificateByCodeQuery,
  useLazyGetCertificateByCodeQuery,
} = publicCertificatesApi;
