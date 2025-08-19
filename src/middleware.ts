import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/about",
    "/contact",
    "/gallery",
    "/packages",
    "/signin",
    "/signup",
    "/api/auth",
  ];

  // Admin routes that require ADMIN or SUPERADMIN role
  const adminRoutes = [
    "/admin",
  ];

  // User routes that require authentication (any authenticated user)
  const protectedUserRoutes = [
    "/dashboard",
    "/user",
    "/account",
    "/book",
    "/checkout",
  ];

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current path is admin route
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current path is protected user route
  const isProtectedUserRoute = protectedUserRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Allow access to public routes
  if (isPublicRoute) {
    // Redirect authenticated users away from auth pages
    if (isAuthenticated && (pathname === "/signin" || pathname === "/signup")) {
      const homeUrl = new URL("/", req.nextUrl.origin);
      return NextResponse.redirect(homeUrl);
    }
    return NextResponse.next();
  }

  // Handle admin routes
  if (isAdminRoute) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/signin", req.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Check if user has admin privileges
    if (userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
      const unauthorizedUrl = new URL("/", req.nextUrl.origin);
      return NextResponse.redirect(unauthorizedUrl);
    }

    return NextResponse.next();
  }

  // Handle protected user routes
  if (isProtectedUserRoute) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/signin", req.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  // For all other routes, allow access
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - but include /api/auth for authentication
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     * - uploads (uploaded files)
     */
    "/((?!api(?!/auth)|_next/static|_next/image|favicon.ico|assets|uploads).*)",
  ],
};
