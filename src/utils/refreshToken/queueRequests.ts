import { FetchArgs } from "@reduxjs/toolkit/query";
import { baseQuery } from "@/lib/baseQueryWithReauth";

export let pendingRequests: Array<{ 
  resolve: (value: any) => void; 
  reject: (error: any) => void; 
  args: string | FetchArgs; 
  api: any; 
  extraOptions: any; 
}> = [];

export const processPendingRequests = async (refreshSuccess: boolean) => {
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