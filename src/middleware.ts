import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const roleRouteMap = [
    // Admin routes
    { path: "/manage-users", roles: ["ADMIN"] },

    // Instructor routes  
    { path: "/courses/create", roles: ["INSTRUCTOR"] },

    // Student routes
    { path: "/dashboard", roles: ["STUDENT"] },
    { path: "/dashboard/my-courses", roles: ["STUDENT"] },
    { path: "/dashboard/payments", roles: ["STUDENT"] },
    { path: "/dashboard/quiz-results", roles: ["STUDENT"] },
    { path: "/dashboard/reviews", roles: ["STUDENT"] },
    { 
      path: /^\/dashboard\/learning\/[\w-]+$/, 
      roles: ["STUDENT"],
      isDynamic: true,
      description: "Course learning page"
    },
];

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register", 
  "/forgot-password",
  "/about",
  "/contact",
  "/courses", 
  "/access-denied",
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Always allow NextAuth API routes - CRITICAL FIX
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") // Static files like .ico, .svg, .png, etc.
  ) {
    return NextResponse.next();
  }

  // Check if path is public
  const isPublicPath = PUBLIC_PATHS.some(publicPath => {
    return pathname === publicPath || 
           (publicPath !== "/" && pathname.startsWith(publicPath + "/"));
  });

  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET,
    });

    // CRITICAL: Check for auth errors in token
    if (token?.error) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("error", "session_expired");
      return NextResponse.redirect(loginUrl);
    }

    // If user is logged in, redirect away from auth pages
    if (token && (pathname === "/login" || pathname === "/register")) {
      
      // Redirect based on user role
      const userRole = token.role as string;
      let redirectPath = "/";
      
      if (userRole === "STUDENT") {
        redirectPath = "/";
      } else if (userRole === "INSTRUCTOR") {
        redirectPath = "/";
      } else if (userRole === "ADMIN") {
        redirectPath = "/manage-users";
      }
      
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    // Allow public paths to proceed
    if (isPublicPath) {
      return NextResponse.next();
    }

    // CRITICAL FIX: For protected routes, check authentication
    if (!token || !token.accessToken) {
      const loginUrl = new URL("/access-denied", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access for protected routes
    const userRole = token.role as string;

    // Find matching protected route
    const protectedRoute = roleRouteMap.find(route => {
      if (route.isDynamic && route.path instanceof RegExp) {
        // Kiểm tra dynamic route với regex
        const isMatch = route.path.test(pathname);
        console.log(`🔍 Testing regex ${route.path} against ${pathname}: ${isMatch}`);
        return isMatch;
      } else {
        return pathname.startsWith(route.path as string);
      }
    });

    if (protectedRoute) {
      if (!protectedRoute.roles.includes(userRole)) {
        return NextResponse.redirect(new URL("/access-denied", req.url));
      }
    }

    return NextResponse.next();

  } catch (error) {
    console.error("🔴 Middleware error:", error);
    
    // If there's an error getting the token, redirect to login for protected routes
    if (!isPublicPath) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("error", "middleware_error");
      return NextResponse.redirect(loginUrl);
    }
    
    // Allow public paths even if there's an error
    return NextResponse.next();
  }
}



export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     * - Any file with extension (images, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};