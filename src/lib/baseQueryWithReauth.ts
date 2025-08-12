import { fetchBaseQuery, FetchArgs, BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { getSession, signOut } from "next-auth/react";
import { isAccessTokenValid } from "./auth";

const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL;

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;
let pendingRequests: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
  args: string | FetchArgs;
  api: any;
  extraOptions: any;
}> = [];

export const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers, { arg }) => {
    try {
      const session = await getSession();
      
      if (session?.user?.accessToken) {
        headers.set("Authorization", `Bearer ${session.user.accessToken}`);
      }
      
      // Check if the request body is FormData
      const isFormData = (arg as any)?.body instanceof FormData;
      
      if (!isFormData) {
        headers.set("Content-Type", "application/json");
      }
  
      return headers;
    } catch (error) {
      console.error("Error preparing headers:", error);
      return headers;
    }
  },
});

// Xep hang cho token 
async function processPendingRequests(success: boolean) {
  const requests = [...pendingRequests];
  pendingRequests.length = 0; //reset
  
  for (const { resolve, reject, args, api, extraOptions } of requests) {
    try {
      if (success) {
        const result = await baseQuery(args, api, { ...extraOptions, isRetry: true });
        resolve(result);
      } else {
        reject({ error: { status: 401, data: "Authentication failed after refresh" } });
      }
    } catch (error) {
      reject({ error });
    }
  }
}


export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args: string | FetchArgs, api: any, extraOptions: any) => {

  if (extraOptions?.isRetry) {
    return await baseQuery(args, api, extraOptions);
  }

  if (typeof window === 'undefined') {
    return await baseQuery(args, api, extraOptions);
  }

  const session = await getSession();
  
  if (!session?.user?.accessToken && !session?.user?.refreshToken) {
    return { error: { status: 401, data: "No authentication tokens" } as FetchBaseQueryError };
  }

  let result = await baseQuery(args, api, extraOptions);

  //retry on 401/403 
  if (result.error && 
      (result.error.status === 401 || result.error.status === 403)) {

    // xep hang
    if (isRefreshing && refreshPromise) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject, args, api, extraOptions });
      });
    }

    // thang nao toi dau tien thi di lay token
    if (!isRefreshing) {
      isRefreshing = true;
      
      try {
        console.log('Token refresh needed, attempting refresh via NextAuth...');
        
        refreshPromise = new Promise(async (resolve) => {
          try {
            
            const { getSession } = await import('next-auth/react');
            
            const newSession = await getSession();
            
            if (newSession?.user?.accessToken) {
              console.log('Token refreshed successfully via NextAuth');
              resolve(true);
            } else {
              console.log('Token refresh failed via NextAuth');
              resolve(false);
            }
          } catch (error) {
            console.error('Error during NextAuth token refresh:', error);
            resolve(false);
          }
        });
        
        const refreshSuccess = await refreshPromise;
        
        if (refreshSuccess) {

          result = await baseQuery(args, api, { ...extraOptions, isRetry: true });
          
          await processPendingRequests(true);
        } else {

          await processPendingRequests(false);
          
          console.log('Refresh failed, signing out user');
          await signOut({ callbackUrl: '/login' });
        }
      } catch (error) {
        console.error('Error during token refresh process:', error);
        await processPendingRequests(false);
        await signOut({ callbackUrl: '/login' });
      } finally {
        // Reset flags
        isRefreshing = false;
        refreshPromise = null;
      }
    }
  }

  return result;
};

//query ko can token
export const publicBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});



// chekc logged in
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await getSession();
    return !!(session?.user?.accessToken || session?.user?.refreshToken);
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
}

// lay token hien tai
export async function getCurrentAccessToken(): Promise<string | null> {
  try {
    const session = await getSession();
    return session?.user?.accessToken || null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

export const localBaseQuery = fetchBaseQuery({
  baseUrl: "", // goi den front-end thay vi backend
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});