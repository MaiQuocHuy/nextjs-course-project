import { decodeJWT } from "./decodeJWT";

export function isTokenExpired(token: string, bufferMinutes: number = 5): boolean {
  const decoded = decodeJWT(token);
  if (!decoded?.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const bufferTime = bufferMinutes * 60; // Convert minutes to seconds
  return decoded.exp < (currentTime + bufferTime);
}