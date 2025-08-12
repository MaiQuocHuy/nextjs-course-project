import type { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:8080/api";

interface UserType {
  id: string;
  email?: string;
  name?: string;
  role: string;
  thumbnailUrl?: string;
  bio?: string;
  isActive?: boolean;
  accessToken: string;
  refreshToken: string;
}

interface DecodedToken {
  exp: number; // expires at
  sub?: string; // subject (user id)
  email?: string;
  roles?: string[]; // user roles
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

// Enhanced error types for better error handling
type AuthError = 
  | "RefreshTokenExpiredError"  // Unrecoverable - force logout
  | "TransientRefreshError"     // Recoverable - keep session with error flag
  | "NetworkError"              // Recoverable - network issues
  | "InvalidTokenError";        // Unrecoverable - malformed tokens

// Check if error is unrecoverable and requires logout
function isUnrecoverableError(error: string): boolean {
  return error === "RefreshTokenExpiredError" || error === "InvalidTokenError";
}

// Check if refresh token is expired
function isRefreshTokenExpired(refreshTokenExpires: number): boolean {
  if (!refreshTokenExpires) return false;
  const currentTime = Math.floor(Date.now() / 1000);
  return refreshTokenExpires < currentTime;
}

export const authOptions: NextAuthOptions = {
  debug: true,
  pages: {
    signIn: "/login", 
  },
  session: {
    strategy: "jwt",
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
      authorize: async(credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Backend authentication - connecting to Spring Boot server
        try {
          const res = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Unauthorized");
          }  

          const response = await res.json();
          
          if (response && response.data) {
            // Decode access token to get expiration time and roles
            const accessTokenDecoded = decodeJWT(response.data.accessToken);
            let userRole = "STUDENT"; // Mặc định
            if (accessTokenDecoded?.roles && Array.isArray(accessTokenDecoded.roles)) {
              // Chuyển đổi "ROLE_STUDENT" thành "STUDENT"
              const role = accessTokenDecoded.roles[0]; 
              if (role.startsWith("ROLE_")) {
                userRole = role.replace("ROLE_", "");
              } else {
              userRole = role; // Giữ nguyên nếu không bắt đầu bằng "ROLE_"
              }
          }
            return {
              id: response.data.user.id,
              email: response.data.user.email || credentials.email,
              name: response.data.user.name,
              role: userRole,
              thumbnailUrl: response.data.user.thumbnailUrl,
              bio: response.data.user.bio,
              isActive: response.data.user.isActive,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
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
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        };
      }
  //     if (user) {
  //   console.log("🔍 JWT Callback - User object received:", {
  //     id: user.id,
  //     email: user.email,
  //     name: user.name,
  //     role: user.role, // This should now show the role
  //   });

  //   const newToken = {
  //     ...token,
  //     userId: user.id,
  //     email: user.email,
  //     name: user.name,
  //     role: user.role, // This should not be undefined anymore
  //     thumbnailUrl: user.thumbnailUrl,
  //     bio: user.bio,
  //     isActive: user.isActive,
  //     accessToken: user.accessToken,
  //     refreshToken: user.refreshToken,
  //     accessTokenExpires: user.accessTokenExpires,
  //     refreshTokenExpires: user.refreshTokenExpires,
  //     error: undefined,
  //   };

  //   console.log("🔍 JWT Callback - Token being returned:", {
  //     userId: newToken.userId,
  //     email: newToken.email,
  //     role: newToken.role, // Check this
  //   });

  //   return newToken;
  // }
  // console.log("🔍 JWT Callback - Existing token role:", token.role);

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
                error: undefined, // Clear errors on successful update
              };
            }
          }
        } catch (error) {
          console.error('Failed to fetch fresh user data:', error);
        }
      }

      // Check if refresh token is expired first - this is unrecoverable
      if (token.refreshTokenExpires && isRefreshTokenExpired(token.refreshTokenExpires as number)) {
        console.log('Refresh token expired - will force logout');
        return {
          ...token,
          error: "RefreshTokenExpiredError" as AuthError,
        };
      }

      // If we had a previous unrecoverable error, don't attempt refresh
      if (token.error && isUnrecoverableError(token.error)) {
        return token;
      }

      // Return previous token if the access token is still valid (with 5-minute buffer)
      if (token.accessToken && !isTokenExpired(token.accessToken as string, 5)) {
        // Clear any previous transient errors if token is still valid
        return {
          ...token,
          error: undefined,
        };
      }

      // Access token has expired or will expire soon, try to refresh it
      console.log('Access token expired or expiring soon - attempting refresh...');
      return await refreshAccessToken(token);
    },

    async session({ session, token }): Promise<Session> {
      // Only force logout for unrecoverable errors
      if (token.error && isUnrecoverableError(token.error)) {
        console.log('Session callback: Unrecoverable auth error - invalidating session');
        return {} as Session;
      }

      // For missing critical tokens, also force logout
      if (!token.accessToken || !token.refreshToken) {
        console.log('Session callback: Missing critical tokens - invalidating session');
        return {} as Session;
      }

      // Create enhanced user object with token properties
      const userObject: UserType = {
        id: token.userId as string,
        accessToken: (token.accessToken as string) ?? "",
        refreshToken: (token.refreshToken as string) ?? "",
        
      };

      // Add the user object to the session
      session.user = userObject;
      return session;
    },
  },
};

// !refresh access token //

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    if (!res.ok) throw new Error("Failed to refresh access token");

    const response = await res.json();
    console.log("new access token:", response.data.accessToken); 

    return {
      ...token,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Refresh token error:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}


declare module "next-auth" {
  interface User extends UserType {}
  interface Session {
    user: UserType & {
      accessToken?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT extends UserType {}
}