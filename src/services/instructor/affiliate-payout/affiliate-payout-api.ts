import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AffiliatePayoutResponse,
  AffiliatePayoutQueryParams,
} from "@/types/instructor/affiliate-payout";

export const affiliatePayoutApi = createApi({
  reducerPath: "affiliatePayoutApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["AffiliatePayout"],
  endpoints: (builder) => ({
    getAllAffiliatePayouts: builder.query<
      AffiliatePayoutResponse,
      AffiliatePayoutQueryParams
    >({
      query: ({ page, size, search, status, fromDate, toDate }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
        });

        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (fromDate) params.append("fromDate", fromDate);
        if (toDate) params.append("toDate", toDate);

        return {
          url: `/instructor/affiliate-payout?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["AffiliatePayout"],
    }),

    getAffiliatePayoutById: builder.query<any, string>({
      query: (id) => ({
        url: `/instructor/affiliate-payout/${id}`,
        method: "GET",
      }),
      providesTags: ["AffiliatePayout"],
    }),
  }),
});

export const {
  useGetAllAffiliatePayoutsQuery,
  useGetAffiliatePayoutByIdQuery,
} = affiliatePayoutApi;
