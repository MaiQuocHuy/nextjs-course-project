import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  DiscountUsageResponse,
  DiscountUsageQueryParams,
} from "@/types/instructor/discount-usage";

export const discountUsageApi = createApi({
  reducerPath: "discountUsageApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["DiscountUsage"],
  endpoints: (builder) => ({
    getAllDiscountUsages: builder.query<
      DiscountUsageResponse,
      DiscountUsageQueryParams
    >({
      query: ({ page, size, search, type, fromDate, toDate }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
        });

        if (search) params.append("search", search);
        if (type) params.append("type", type);
        if (fromDate) params.append("fromDate", fromDate);
        if (toDate) params.append("toDate", toDate);

        return {
          url: `/instructor/discount-usage?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["DiscountUsage"],
    }),

    getDiscountUsageById: builder.query<any, string>({
      query: (id) => ({
        url: `/instructor/discount-usage/${id}`,
        method: "GET",
      }),
      providesTags: ["DiscountUsage"],
    }),
  }),
});

export const { useGetAllDiscountUsagesQuery, useGetDiscountUsageByIdQuery } =
  discountUsageApi;
