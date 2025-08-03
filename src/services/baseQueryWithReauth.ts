
import { fetchBaseQuery, FetchArgs, BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { signOut } from "next-auth/react";

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;
let pendingRequests: Array<{ 
  resolve: (value: any) => void; 
  reject: (error: any) => void; 
  args: string | FetchArgs; 
  api: any; 
  extraOptions: any; 
}> = [];

const baseQuery = fetchBaseQuery({
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

const refreshToken = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!refreshToken) {
      return false;
    }

    const refreshUrl = `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/auth/refresh`;
    const refreshRes = await fetch(refreshUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      
      localStorage.setItem("accessToken", data.data.accessToken);
      if (data.data.refreshToken) {
        localStorage.setItem("refreshToken", data.data.refreshToken);
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const handleAuthFailure = async () => {
  // Check if we actually have tokens before attempting signOut
  const hasAccessToken = localStorage.getItem("accessToken");
  const hasRefreshToken = localStorage.getItem("refreshToken");
  
  // Clear tokens first
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("isAuthenticated");
  
  // Only call signOut if we had tokens (to prevent loops with already signed out users)
  if (hasAccessToken || hasRefreshToken) {
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Error during signOut:", error);
    }
  }
};

const processPendingRequests = async (refreshSuccess: boolean) => {
  const requests = [...pendingRequests];
  pendingRequests = [];
  
  for (const request of requests) {
    try {
      if (refreshSuccess) {
        const result = await baseQuery(request.args, request.api, { ...request.extraOptions, isRetry: true });
        request.resolve(result);
      } else {
        request.resolve({ error: { status: 401, data: "Token refresh failed" } });
      }
    } catch (error) {
      request.reject(error);
    }
  }
};

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