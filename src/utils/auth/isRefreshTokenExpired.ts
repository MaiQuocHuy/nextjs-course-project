export function isRefreshTokenExpired(refreshTokenExpires: number): boolean {
  if (!refreshTokenExpires) return false;
  const currentTime = Math.floor(Date.now() / 1000);
  return refreshTokenExpires < currentTime;
}