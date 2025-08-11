import type { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL;

interface UserType {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  thumbnailUrl?: string;
  bio?: string;
  isActive?: boolean;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires?: number;
  refreshTokenExpires?: number;
}

interface DecodedToken {
  exp: number; // expires at
  iat: number; // issued at
  sub?: string; // subject (user id)
  email?: string;
  role?: string; // user role
}

// Helper function to decode JWT token
function decodeJWT(token: string): DecodedToken | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

// Check if token is expired or will expire soon
function isTokenExpired(token: string, bufferMinutes: number = 5): boolean {
  const decoded = decodeJWT(token);
  if (!decoded?.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const bufferTime = bufferMinutes * 60; // Convert minutes to seconds
  return decoded.exp < (currentTime + bufferTime);
}

// Check if refresh token is expired
function isRefreshTokenExpired(refreshTokenExpires: number): boolean {
  if (!refreshTokenExpires) return false;
  const currentTime = Math.floor(Date.now() / 1000);
  return refreshTokenExpires < currentTime;
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour (matches access token)
    updateAge: 60 * 10, // Update session every 10 minutes
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days (matches refresh token)
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Backend authentication - connecting to Spring Boot server
        try {
          const res = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
              errorData.message || "Something went wrong, please try again"
            );
          }

          const response = await res.json();

          if (response && response.data) {
            // Decode access token to get expiration time
            const accessTokenDecoded = decodeJWT(response.data.accessToken);

            return {
              id: response.data.user.id,
              email: response.data.user.email || credentials.email,
              name: response.data.user.name,
              role: response.data.user.role,
              thumbnailUrl: response.data.user.thumbnailUrl,
              bio: response.data.user.bio,
              isActive: response.data.user.isActive,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
              accessTokenExpires: accessTokenDecoded?.exp,
              refreshTokenExpires: response.data.refreshTokenExpires,
            } as UserType;
          }
        } catch (error) {
          console.error("Backend authentication failed:", error);
          return null;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }): Promise<JWT> {
      // Initial sign in - store fresh tokens
      if (user) { 
       
        return {
          ...token,
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          thumbnailUrl: user.thumbnailUrl,
          bio: user.bio,
          isActive: user.isActive,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          refreshTokenExpires: user.refreshTokenExpires,
          error: undefined, // Clear any previous errors
        };
      }

      // If this is a manual session update, fetch fresh user data
      if (trigger === 'update') {
        console.log('Manual session update - fetching fresh user data');
        try {
          const response = await fetch(`${baseUrl}/users/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token.accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userData = await response.json();
            if (userData.data) {
              console.log('Successfully fetched fresh user data');
              return {
                ...token,
                name: userData.data.name || token.name,
                bio: userData.data.bio || token.bio,
                thumbnailUrl: userData.data.thumbnailUrl || token.thumbnailUrl,
                email: userData.data.email || token.email,
              };
            }
          }
        } catch (error) {
          console.error('Failed to fetch fresh user data:', error);
        }
      }

      // Check if refresh token is expired first
      if (token.refreshTokenExpires && isRefreshTokenExpired(token.refreshTokenExpires as number)) {
        console.log('Refresh token expired - forcing logout');
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }

      // Return previous token if the access token is still valid (with 5-minute buffer)
      if (token.accessToken && !isTokenExpired(token.accessToken as string, 5)) {
        return token;
      }

      // Access token has expired or will expire soon, try to refresh it
      console.log('Access token expired or expiring soon - attempting refresh...');
      return await refreshAccessToken(token);
    },

    async session({ session, token }): Promise<Session> {
      // If there's a refresh error, return empty session to force logout
      if (token.error === "RefreshAccessTokenError") {
        console.log('Session callback: Refresh token error detected - invalidating session');
        return {} as Session;
      }

      // Only return session if we have valid tokens
      if (!token.accessToken || !token.refreshToken) {
        console.log('Session callback: Missing tokens - invalidating session');
        return {} as Session;
      }

      // Create enhanced user object with token properties
      const userObject: UserType = {
        id: token.userId as string,
        email: token.email as string,
        name: token.name as string,
        role: token.role as string,
        thumbnailUrl: token.thumbnailUrl as string,
        bio: token.bio as string,
        isActive: token.isActive as boolean,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
        accessTokenExpires: token.accessTokenExpires as number,
        refreshTokenExpires: token.refreshTokenExpires as number,
      };

      // Add the user object to the session
      session.user = userObject;
      return session;
    },
  },
  events: {
    async signOut({ token }) {
     
      try {        
        if (token?.refreshToken) {
          const response = await fetch(`${baseUrl}/auth/logout`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.accessToken}`,
            },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
          });

          if (response.ok) {
            console.log('Server-side logout successful');
          } else {
            console.warn('Server-side logout failed:', response.status);
          }
        }
      } catch (error) {
        console.error("Error during server logout:", error);
      }
    },
    async signIn({ user }) {
      console.log('Sign in event triggered for user:', user?.email);
    },
  },
};

// Enhanced refresh access token function
export async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    console.log('Attempting to refresh access token...');
    
    // Check if refresh token exists
    if (!token.refreshToken) {
      throw new Error("No refresh token available");
    }

    // Check if refresh token is expired
    if (token.refreshTokenExpires && isRefreshTokenExpired(token.refreshTokenExpires as number)) {
      throw new Error('Refresh token expired');
    }

   
    const res = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(` Refresh request failed: ${res.status} - ${errorText}`);
      throw new Error(`Failed to refresh access token: ${res.status}`);
    }

    const response = await res.json();

    if (!response.data?.accessToken) {
      console.error(' Invalid refresh response - missing access token');
      throw new Error('Invalid refresh response');
    }

    console.log(" Successfully refreshed access token"); 

    // Decode new access token to get expiration time
    const newAccessTokenDecoded = decodeJWT(response.data.accessToken);

    if (!newAccessTokenDecoded?.exp) {
      console.warn('New access token missing expiration - using 1 hour default');
    }

    // Update token with new values and optionally updated user info
    const updatedToken: JWT = {
      ...token,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken ?? token.refreshToken, // Use new if provided, otherwise keep existing
      accessTokenExpires: newAccessTokenDecoded?.exp ?? (Math.floor(Date.now() / 1000) + 3600), // Default to 1 hour if not provided
      refreshTokenExpires: response.data.refreshTokenExpires ?? token.refreshTokenExpires,
      error: undefined, // Clear any previous errors
    };

    // If backend sends updated user info during refresh, update it
    if (response.data.user) {
      updatedToken.email = response.data.user.email ?? token.email;
      updatedToken.name = response.data.user.name ?? token.name;
      updatedToken.role = response.data.user.role ?? token.role;
      updatedToken.thumbnailUrl =
        response.data.user.thumbnailUrl ?? token.thumbnailUrl;
      updatedToken.bio = response.data.user.bio ?? token.bio;
      updatedToken.isActive = response.data.user.isActive ?? token.isActive;
    }

    return updatedToken;
  } catch (error) {
    console.error("Refresh token error:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// Helper function to manually trigger token refresh (for use in components)
export async function forceTokenRefresh(): Promise<boolean> {
  try {
    const { getSession } = await import("next-auth/react");
    const session = await getSession();

    if (!session?.user?.refreshToken) {
      return false;
    }

    // Create a mock JWT token object for refresh
    const mockToken: JWT = {
      id: session.user.id,
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      thumbnailUrl: session.user.thumbnailUrl,
      bio: session.user.bio,
      isActive: session.user.isActive,
      accessToken: session.user.accessToken,
      refreshToken: session.user.refreshToken,
      accessTokenExpires: session.user.accessTokenExpires,
      refreshTokenExpires: session.user.refreshTokenExpires,
    };

    const refreshedToken = await refreshAccessToken(mockToken);

    return !refreshedToken.error;
  } catch (error) {
    console.error("Manual token refresh failed:", error);
    return false;
  }
}

// RTK Query integration helpers
// export const getAuthHeaders = async (): Promise<{ [key: string]: string }> => {
//   try {
//     const { getSession } = await import('next-auth/react');
//     const session = await getSession();
    
//     if (!session?.user?.accessToken) {
//       throw new Error('No access token available');
//     }

//     return {
//       'Authorization': `Bearer ${session.user.accessToken}`,
//       'Content-Type': 'application/json',
//     };
//   } catch (error) {
//     console.error('Failed to get auth headers:', error);
//     throw error;
//   }
// };

// Token validation utility for RTK Query
export const isAccessTokenValid = async (): Promise<boolean> => {
  try {
    const { getSession } = await import('next-auth/react');
    const session = await getSession();
    
    if (!session?.user?.accessToken) {
      return false;
    }

    // Check if token is expired (with 1-minute buffer)
    return !isTokenExpired(session.user.accessToken, 1);
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

// Enhanced type declarations
declare module "next-auth" {
  interface User extends UserType {}
  interface Session {
    user: UserType;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends UserType {
    userId?: string;
    error?: string;
  }
}
