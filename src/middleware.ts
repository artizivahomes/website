import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect all /admin routes except /admin/login
  if (path.startsWith("/admin") && path !== "/admin/login") {
    const sessionCookie = request.cookies.get("artiziva_admin_session")?.value;

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    // Note: Full JWT verification happens in the server components or API routes
    // Middleware here just checks for existence of the cookie for a quick redirect
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
