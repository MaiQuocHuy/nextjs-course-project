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

// Check if token is expired or will expire in the next 5 minutes
function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded?.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const bufferTime = 5 * 60; // 5 minutes buffer
  return decoded.exp < currentTime + bufferTime;
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days (matches refresh token)
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
      // Initial sign in
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
        };
      }

      // Return previous token if the access token has not expired yet
      if (token.accessToken && !isTokenExpired(token.accessToken as string)) {
        return token;
      }

      // Access token has expired, try to update it using refresh token
      console.log("Access token expired, attempting refresh...");
      return await refreshAccessToken(token);
    },

    async session({ session, token }): Promise<Session> {
      // If there's an error, force logout
      if (token.error === "RefreshAccessTokenError") {
        // Session will be invalid, user will be logged out
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
      // Perform server-side logout if needed
      try {
        if (token?.refreshToken) {
          await fetch(`${baseUrl}/auth/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.accessToken}`,
            },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
          });
        }
      } catch (error) {
        console.error("Error during server logout:", error);
      }
    },
  },
};

// Enhanced refresh access token function
export async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    console.log("Attempting to refresh access token...");

    // Check if refresh token exists and is not expired
    if (!token.refreshToken) {
      throw new Error("No refresh token available");
    }

    // Check if refresh token is expired (using backend-provided expiry)
    if (token.refreshTokenExpires) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (token.refreshTokenExpires < currentTime) {
        throw new Error("Refresh token expired");
      }
    }

    const res = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    if (!res.ok) {
      throw new Error(`Failed to refresh access token: ${res.status}`);
    }

    const response = await res.json();

    if (!response.data?.accessToken) {
      throw new Error("Invalid refresh response");
    }

    console.log("Successfully refreshed access token");

    // Decode new access token to get expiration time
    const newAccessTokenDecoded = decodeJWT(response.data.accessToken);

    // Update token with new values and optionally updated user info
    const updatedToken = {
      ...token,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken ?? token.refreshToken,
      accessTokenExpires: newAccessTokenDecoded?.exp,
      refreshTokenExpires:
        response.data.refreshTokenExpires ?? token.refreshTokenExpires,
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
