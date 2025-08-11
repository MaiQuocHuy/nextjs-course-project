import { useSession, signIn, signOut, getSession } from 'next-auth/react';

import { useCallback, useEffect, useState } from 'react';


export const useAuth = () => {
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset loading state when authentication status changes
  useEffect(() => {
    if (status === 'authenticated' || status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  // Login function
  const login = useCallback(async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);

      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false); // Reset loading immediately on error
        return { success: false, error: result.error };
      }

      // Don't reset loading here - let the useEffect handle it when status changes
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      setLoading(false); // Reset loading immediately on error
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout function
  const logout = useCallback(async (redirectUrl: string = '/') => {
    try {
      setLoading(true);
      
      // Use the enhanced logout function
      await signOut({ callbackUrl: redirectUrl });
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect if normal logout fails
      window.location.href = redirectUrl;
    } finally {
      setLoading(false);
    }
  }, []);

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
  

  // Refresh session using NextAuth's built-in update function
  const refreshSession = useCallback(async () => {
    try {
      await update();
      return true;
    } catch (error) {
      console.error('Session refresh failed:', error);
      return false;
    }
  }, [update]);

  
  const isTokenValid = useCallback(() => {
    if (!session?.user?.accessToken) return false;
    
    
    const tokenExpires = session.user.accessTokenExpires;
    if (!tokenExpires) return true; 
    
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = 1 * 60; // 1 minute

    return tokenExpires > (currentTime + bufferTime);
  }, [session]);

  return {
    // Session data
    session,
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || loading,
    error,
    
    // Auth actions
    login,
    logout,
    refreshSession,
    
    isTokenValid,
    
    // Status checks
    isLoggedIn: status === 'authenticated',
    isLoggedOut: status === 'unauthenticated',
    isSessionLoading: status === 'loading',
  };
};

// Hook for checking authentication status
export const useAuthStatus = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    isReady: !isLoading,
  };
};

// Hook for protected routes
export const useRequireAuth = (redirectUrl: string = '/login') => {
  const { isAuthenticated, isLoading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShouldRedirect(true);
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (shouldRedirect) {
      window.location.href = redirectUrl;
    }
  }, [shouldRedirect, redirectUrl]);

  return {
    isAuthenticated,
    isLoading,
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
      console.error('Token refresh failed:', error);
      return false;
    }
  }, [update]);

  const isTokenExpired = useCallback(() => {
    if (!session?.user?.accessTokenExpires) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return session.user.accessTokenExpires < currentTime;
  }, [session]);

  const isTokenExpiringSoon = useCallback((bufferMinutes: number = 5) => {
    if (!session?.user?.accessTokenExpires) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = bufferMinutes * 60;
    
    return session.user.accessTokenExpires < (currentTime + bufferTime);
  }, [session]);

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
          console.error('Auto refresh failed:', error);
        } finally {
          setIsRefreshing(false);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [enabled, isTokenExpiringSoon, refreshTokens, isRefreshing]);

  return { isRefreshing };
};
