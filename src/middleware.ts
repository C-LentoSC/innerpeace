import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow access to sign-in and sign-up pages when not authenticated
  if (!req.auth && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to sign-in page for protected routes
  if (!req.auth && pathname.startsWith("/dashboard")) {
    const signInUrl = new URL("/signin", req.nextUrl.origin);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users away from auth pages
  if (req.auth && (pathname === "/signin" || pathname === "/signup")) {
    const homeUrl = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
