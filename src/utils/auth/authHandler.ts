import { decodeJWT } from "./decodeJWT";
import { UserType } from "@/lib/auth";

const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL;

// Helper function xử lý response từ backend (dùng chung)
function processAuthResponse(response: any, fallbackData?: any, provider: 'credentials' | 'google' = 'credentials'): UserType {
  // Decode access token để lấy role và expiration
  const accessTokenDecoded = decodeJWT(response.data.accessToken);
  let userRole = "STUDENT"; // Mặc định
  
  if (accessTokenDecoded?.roles && Array.isArray(accessTokenDecoded.roles)) {
    const role = accessTokenDecoded.roles[0]; 
    if (role.startsWith("ROLE_")) {
      userRole = role.replace("ROLE_", "");
    } else {
      userRole = role;
    }
  }

  return {
    id: response.data.user.id,
    email: response.data.user.email || fallbackData?.email,
    name: response.data.user.name || fallbackData?.name,
    role: userRole,
    thumbnailUrl: response.data.user.thumbnailUrl,
    bio: response.data.user.bio,
    isActive: response.data.user.isActive,
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
    accessTokenExpires: accessTokenDecoded?.exp,
    refreshTokenExpires: response.data.refreshTokenExpires,
    provider,
  } as UserType;
}

// Google OAuth handler - chỉ focus vào logic riêng
export async function handleGoogleSignIn(account: any, profile: any): Promise<UserType | null> {
  try {
    const res = await fetch(`${baseUrl}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: profile.email,
        name: profile.name,
      }),
    });

    if (!res.ok) {
      // console.error("Google OAuth backend integration failed:", res.status);
      return null;
    }

    const response = await res.json();
    
    if (response && response.data) {
      return processAuthResponse(response, {
        email: profile.email,
        name: profile.name,
      }, 'google');
    }
  } catch (error) {
    // console.error("Google OAuth backend integration error:", error);
  }

  return null;
}

// Credentials login handler - chỉ focus vào logic riêng  
export async function handleCredentialsLogin(email: string, password: string): Promise<UserType | null> {
  try {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Something went wrong, please try again");
    }

    const response = await res.json();

    if (response && response.data) {
      return processAuthResponse(response, {
        email,
      }, 'credentials');
    }
  } catch (error) {
    // console.error("Credentials authentication failed:", error);
    throw error; // Re-throw để NextAuth có thể handle error
  }

  return null;
}