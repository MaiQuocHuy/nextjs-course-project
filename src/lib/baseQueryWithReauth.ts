
import { fetchBaseQuery, FetchArgs, BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { pendingRequests, processPendingRequests } from "@/utils/refreshToken/queueRequests";
import { refreshToken, handleAuthFailure } from "@/utils/refreshToken/resetToken";

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;
// let pendingRequests: Array<{ 
//   resolve: (value: any) => void; 
//   reject: (error: any) => void; 
//   args: string | FetchArgs; 
//   api: any; 
//   extraOptions: any; 
// }> = [];

export const baseQuery = fetchBaseQuery({
  baseUrl: (`${process.env.NEXT_PUBLIC_API_BACKEND_URL}`),
  prepareHeaders: async (headers) => {
    // Ensure we're in browser environment
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error("Error accessing localStorage in prepareHeaders:", error);
      }
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args: string | FetchArgs, api: any, extraOptions: any) => {
  // Prevent nested retries
  if (extraOptions?.isRetry) {
    return await baseQuery(args, api, extraOptions);
  }

  // Check if we have any tokens before making authenticated requests
  const hasAccessToken = typeof window !== 'undefined' && localStorage.getItem("accessToken");
  const hasRefreshToken = typeof window !== 'undefined' && localStorage.getItem("refreshToken");
  
  if (!hasAccessToken && !hasRefreshToken && typeof window !== 'undefined') {
    return { error: { status: 401, data: "No authentication tokens" } };
  }
  
  let result = await baseQuery(args, api, extraOptions);

  // Only try to refresh on 401/403
  if (result.error && 
      (result.error.status === 401 || result.error.status === 403) && 
      typeof window !== 'undefined') {

    // If already refreshing, queue this request
    if (isRefreshing && refreshPromise) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject, args, api, extraOptions });
      });
    }

    // Start refresh process
    if (!isRefreshing) {
      isRefreshing = true;
      
      try {
        refreshPromise = refreshToken();
        const refreshSuccess = await refreshPromise;
        
        if (refreshSuccess) {
          result = await baseQuery(args, api, { ...extraOptions, isRetry: true });
          
          // Process any pending requests
          await processPendingRequests(true);
        } else {
          // Process pending requests with failure
          await processPendingRequests(false);
          
          await handleAuthFailure();
        }
      } catch (error) {
        await processPendingRequests(false);
        await handleAuthFailure();
      } finally {
        // Reset flags
        isRefreshing = false;
        refreshPromise = null;
      }
    }
  }

  return result;
};


export const localBaseQuery = fetchBaseQuery({
  baseUrl: "", // goi den front-end thay vi backend
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});