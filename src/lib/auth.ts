import type { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

interface UserType {
  id: string;
  accessToken: string;
  refreshToken: string;
}

interface DecodedToken {
  exp: number; // expires at
  iat: number; // issued at
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
          const res = await fetch(`${baseUrl}/api/auth/login`, {
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
            return {
              id: response.data.user.id,
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
    
    async jwt({ token, user} : { token: JWT; user: User }) {
      if (user) {
        return {
          ...token,
          userId: user.id,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        };
      }

      // Don't auto-refresh here - let baseQueryWithReauth handle it
      // This prevents loops when getSession() is called
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      // Create a user object with token properties
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
    const res = await fetch(`${baseUrl}/api/auth/refresh`, {
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