import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, publicBaseQuery } from "@/lib/baseQueryWithReauth";
import {
  CertificatesResponse,
  CertificateDetailResponse,
  CertificateQueryParams,
} from "@/types/certificate";

export const certificateApi = createApi({
  reducerPath: "certificateApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Certificate"],
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

export const { useGetMyCertificatesQuery } = certificateApi;
export const { useGetCertificateByCodeQuery } = publicCertificateApi;

// Export both APIs for store configuration
export { publicCertificateApi };