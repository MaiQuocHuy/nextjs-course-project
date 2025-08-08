import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import {
  logoutState,
  setLoading,
  setError,
} from "@/store/slices/auth/authSlice";
import {
  clearAuthAndSignOut,
  getCurrentAccessToken,
} from "@/lib/baseQueryWithReauth";
import { useCallback, useEffect, useState } from "react";

export const useAuth = () => {
  const { data: session, status, update } = useSession();
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Login function
  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const result = await signIn("credentials", {
          email: credentials.email,
          password: credentials.password,
          redirect: false,
        });

        if (result?.error) {
          dispatch(setError(result.error));
          return { success: false, error: result.error };
        }

        return { success: true, error: null };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        dispatch(setError(errorMessage));
        return { success: false, error: errorMessage };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  // Logout function
  const logout = useCallback(
    async (redirectUrl: string = "/login") => {
      try {
        dispatch(setLoading(true));
        dispatch(logoutState());

        // Use the enhanced logout function
        await clearAuthAndSignOut(redirectUrl);
      } catch (error) {
        console.error("Logout error:", error);
        // Force redirect if normal logout fails
        window.location.href = redirectUrl;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  //* Force session refresh
  //   const refreshSession = useCallback(async () => {
  //     try {
  //       await update();
  //       return true;
  //     } catch (error) {
  //       console.error('Session refresh failed:', error);
  //       return false;
  //     }
  //   }, [update]);

  // * Get current access token
  const getAccessToken = useCallback(async () => {
    return getCurrentAccessToken();
  }, []);

  const isTokenValid = useCallback(() => {
    if (!session?.user?.accessToken) return false;

    const tokenExpires = session.user.accessTokenExpires;
    if (!tokenExpires) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = 1 * 60; // 1 minute

    return tokenExpires > currentTime + bufferTime;
  }, [session]);

  return {
    // Session data
    session,
    user: session?.user || authState.user,
    isAuthenticated: status === "authenticated" && authState.isAuthenticated,
    isLoading: status === "loading" || authState.loading,
    isHydrated: authState.isHydrated,
    error: authState.error,

    // Auth actions
    login,
    logout,
    // refreshSession,
    getAccessToken,
    isTokenValid,

    // Status checks
    isLoggedIn: status === "authenticated",
    isLoggedOut: status === "unauthenticated",
    isSessionLoading: status === "loading",
  };
};

// Hook for checking authentication status
export const useAuthStatus = () => {
  const { isAuthenticated, isLoading, isHydrated } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    isHydrated,
    isReady: isHydrated && !isLoading,
  };
};

// Hook for protected routes
export const useRequireAuth = (redirectUrl: string = "/login") => {
  const { isAuthenticated, isLoading, isHydrated } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (isHydrated && !isLoading && !isAuthenticated) {
      setShouldRedirect(true);
    }
  }, [isAuthenticated, isLoading, isHydrated]);

  useEffect(() => {
    if (shouldRedirect) {
      window.location.href = redirectUrl;
    }
  }, [shouldRedirect, redirectUrl]);

  return {
    isAuthenticated,
    isLoading: isLoading || !isHydrated,
    shouldRedirect,
  };
};

// Hook for token management
export const useTokenManager = () => {
  const { data: session, update } = useSession();

  const refreshTokens = useCallback(async () => {
    try {
      // refresh the session
      const newSession = await update();
      return !!newSession?.user?.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }, [update]);

  const isTokenExpired = useCallback(() => {
    if (!session?.user?.accessTokenExpires) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return session.user.accessTokenExpires < currentTime;
  }, [session]);

  const isTokenExpiringSoon = useCallback(
    (bufferMinutes: number = 5) => {
      if (!session?.user?.accessTokenExpires) return false;

      const currentTime = Math.floor(Date.now() / 1000);
      const bufferTime = bufferMinutes * 60;

      return session.user.accessTokenExpires < currentTime + bufferTime;
    },
    [session]
  );

  return {
    accessToken: session?.user?.accessToken,
    refreshToken: session?.user?.refreshToken,
    accessTokenExpires: session?.user?.accessTokenExpires,
    refreshTokenExpires: session?.user?.refreshTokenExpires,
    refreshTokens,
    isTokenExpired,
    isTokenExpiringSoon,
  };
};

// Hook for automatic token refresh
export const useAutoRefresh = (enabled: boolean = true) => {
  const { refreshTokens, isTokenExpiringSoon } = useTokenManager();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(async () => {
      if (isTokenExpiringSoon() && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await refreshTokens();
        } catch (error) {
          console.error("Auto refresh failed:", error);
        } finally {
          setIsRefreshing(false);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [enabled, isTokenExpiringSoon, refreshTokens, isRefreshing]);

  return { isRefreshing };
};
