import type { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import GoogleProvider from 'next-auth/providers/google'
import { 
  decodeJWT, 
  isTokenExpired, 
  isRefreshTokenExpired, 
  isUnrecoverableError, 
  handleGoogleSignIn,
  handleCredentialsLogin,
  AuthError 
} from "@/utils/auth";


const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export interface UserType {
  id: string;
  email?: string;
  name?: string;
  role: string;
  thumbnailUrl?: string;
  bio?: string;
  isActive?: boolean;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires?: number;
  refreshTokenExpires?: number;

  provider?: 'credentials' | 'google';
}


export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 60 * 10,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Sử dụng helper function - code ngắn gọn hơn
        return await handleCredentialsLogin(credentials.email, credentials.password);
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {      
        const backendUser = await handleGoogleSignIn(account, profile);
        
        if (!(profile as any)?.email_verified) {
          console.error('Google OAuth: Email not verified');
         
          return `/login?error=EmailNotVerified`;
        }

        if (backendUser) {
          Object.assign(user, backendUser);
          return true;
        } else {
          console.error('Failed to integrate Google OAuth with backend');
          return false;
        }
      }
      
      return true;
    },
    
    // Các callbacks khác giữ nguyên...
    async jwt({ token, user, account, trigger }): Promise<JWT> {
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
           provider: user.provider,
           error: undefined, // Clear any previous errors
         };
       }

    //    If this is a manual session update, fetch fresh user data
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

       // Surface transient errors without breaking the session
       if (token.error && !isUnrecoverableError(token.error)) {
         session.error = "SessionRefreshFailed";
         
       }
       return session;
     },
    },

  events: {
     async signOut({ token }) {
       try {        
         if (token?.refreshToken ) {
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
     
   }
  };




// Enhanced refresh access token function with better error handling
export async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    console.log('Attempting to refresh access token...');

    
    // Check if refresh token exists
    if (!token.refreshToken) {
      console.error('No refresh token available');
      return {
        ...token,
        error: "InvalidTokenError" as AuthError,
      };
    }

    // Double-check if refresh token is expired
    if (token.refreshTokenExpires && isRefreshTokenExpired(token.refreshTokenExpires as number)) {
      console.error('Refresh token expired during refresh attempt');
      return {
        ...token,
        error: "RefreshTokenExpiredError" as AuthError,
      };
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
      console.error(`Refresh request failed: ${res.status} - ${errorText}`);
      
      // Categorize the error based on status code
      if (res.status === 401 || res.status === 403) {
        // Unauthorized/Forbidden - likely expired refresh token
        return {
          ...token,
          error: "RefreshTokenExpiredError" as AuthError,
        };
      } else if (res.status >= 500) {
        // Server error - transient
        return {
          ...token,
          error: "TransientRefreshError" as AuthError,
        };
      } else {
        // Other client errors - network issues
        return {
          ...token,
          error: "NetworkError" as AuthError,
        };
      }
    }

    const response = await res.json();

    if (!response.data?.accessToken) {
      console.error('Invalid refresh response - missing access token');
      return {
        ...token,
        error: "TransientRefreshError" as AuthError,
      };
    }

    console.log("Successfully refreshed access token"); 

    // Decode new access token to get expiration time
    const newAccessTokenDecoded = decodeJWT(response.data.accessToken);

    if (!newAccessTokenDecoded?.exp) {
      console.warn('New access token missing expiration - using 1 hour default');
    }

    // Update token with new values and optionally updated user info
    const updatedToken: JWT = {
      ...token,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken ?? token.refreshToken,
      accessTokenExpires: newAccessTokenDecoded?.exp ?? (Math.floor(Date.now() / 1000) + 3600),
      refreshTokenExpires: response.data.refreshTokenExpires ?? token.refreshTokenExpires,
      error: undefined, // Clear any previous errors on successful refresh
    };

    // If backend sends updated user info during refresh, update it
    if (response.data.user) {
      updatedToken.email = response.data.user.email ?? token.email;
      updatedToken.name = response.data.user.name ?? token.name;
      updatedToken.role = response.data.user.role ?? token.role;
      updatedToken.thumbnailUrl = response.data.user.thumbnailUrl ?? token.thumbnailUrl;
      updatedToken.bio = response.data.user.bio ?? token.bio;
      updatedToken.isActive = response.data.user.isActive ?? token.isActive;
    }

    return updatedToken;
  } catch (error) {
    console.error("Refresh token error:", error);
    
    // Network errors are generally transient
    return {
      ...token,
      error: "NetworkError" as AuthError,
    };
  }
}



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
    error?: string; // Add error flag to session
  }
}

declare module "next-auth/jwt" {
  interface JWT extends UserType {
    userId?: string;
    error?: AuthError; // Use typed errors
  }
}
