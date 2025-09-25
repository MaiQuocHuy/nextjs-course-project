
interface DecodedToken {
  exp: number; // expires at
  iat: number; // issued at
  sub?: string; // subject (user id)
  email?: string;
  roles?: string[]; // user roles
}

export function decodeJWT(token: string): DecodedToken | null {
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
    // console.error("Error decoding JWT:", error);
    return null;
  }
}