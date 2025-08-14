// Enhanced error types for better error handling
export type AuthError = 
  | "RefreshTokenExpiredError"  // Unrecoverable - force logout
  | "TransientRefreshError"     // Recoverable - keep session with error flag
  | "NetworkError"              // Recoverable - network issues
  | "InvalidTokenError";        // Unrecoverable - malformed tokens


export function isUnrecoverableError(error: string): boolean {
  return error === "RefreshTokenExpiredError" || error === "InvalidTokenError";
}