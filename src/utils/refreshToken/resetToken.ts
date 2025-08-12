import { signOut } from "next-auth/react";

export const refreshToken = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!refreshToken) {
      return false;
    }

    const refreshUrl = `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/auth/refresh`;
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
      console.warn("Token refresh failed:", refreshRes.status);
      return false;
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    return false;
  }
};


export const handleAuthFailure = async () => {
  // Check if we actually have tokens before attempting signOut
  const hasAccessToken = localStorage.getItem("accessToken");
  const hasRefreshToken = localStorage.getItem("refreshToken");
  
  // Clear tokens first
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  
  
  // Only call signOut if we had tokens (to prevent loops with already signed out users)
  if (hasAccessToken || hasRefreshToken) {
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Error during signOut:", error);
    }
  }
};
