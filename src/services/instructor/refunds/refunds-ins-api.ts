import { Api, createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import { ApiResponse, PaginatedData } from '@/types/common';
import {
  RefundDetailResponse,
  RefundResponse,
  UpdateRefundStatusRequest,
  UpdateRefundStatusResponse,
} from '@/types/instructor/refunds';
import { RefundsFilter } from '@/types/instructor/refunds';

export const refundsInstSlice = createApi({
  reducerPath: 'refundsInstSlice',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Refunds'],
  endpoints: (builder) => ({
    // Get all refunds for instructor with pagination
    getAllRefunds: builder.query<PaginatedData<RefundResponse>, RefundsFilter>({
      query: (params = {}) => {        
        let url = `/instructor/refund?page=${params.page || 0}&size=${
          params.size || 10
        }`;

        if (params.search) {
          url += `&search=${params.search}`;
        }

        if (params.status) {
          url += `&status=${params.status}`;
        }

        if (params.fromDate) {
          url += `&fromDate=${params.fromDate}`;
        }

        if (params.toDate) {
          url += `&toDate=${params.toDate}`;
        }

        return {
          url,
          method: 'GET',
        };
      },
      transformResponse: (
        response: ApiResponse<PaginatedData<RefundResponse>>
      ) => {
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({
                type: 'Refunds' as const,
                id,
              })),
              { type: 'Refunds', id: 'LIST' },
            ]
          : [{ type: 'Refunds', id: 'LIST' }],
    }),

    // Get refund by id
    getRefundById: builder.query<RefundDetailResponse, string>({
      query: (refundId) => `/instructor/refund/${refundId}`,
      providesTags: (_result, _error, refundId) => [
        { type: 'Refunds', id: refundId },
      ],
      transformResponse: (response: ApiResponse<RefundDetailResponse>) => {
        return response.data;
      }
    }),

    // Update refund status
    updateRefundStatus: builder.mutation<
      ApiResponse<UpdateRefundStatusResponse>,
      UpdateRefundStatusRequest
    >({
      query: ({ id, status, rejectedReason }) => ({
        url: `/instructor/refund/${id}/status`,
        method: 'PATCH',
        body: status === 'COMPLETED' ? { status } : { status, rejectedReason },
      }),
      invalidatesTags: (result, error, data) => [
        { type: 'Refunds', id: 'LIST' },
        { type: 'Refunds', id: data.id },
      ],
      transformErrorResponse: (response: { status: number; data: any }) => {
        return {
          message: response.data.message || 'Failed to update refund status',
        };
      },
    }),
  }),
});

export const {
  useGetAllRefundsQuery,
  useGetRefundByIdQuery,
  useUpdateRefundStatusMutation,
} = refundsInstSlice;
