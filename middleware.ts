import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth callback through always
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Check for Supabase session cookies
  // Supabase sets cookies with different names depending on version
  const cookies = request.cookies.getAll();

  const hasAuthCookie = cookies.some(
    (c) =>
      c.name.startsWith("sb-") &&
      (c.name.endsWith("-auth-token") ||
        c.name.endsWith("-auth-token.0") ||
        c.name.endsWith("-auth-token.1")),
  );

  // Also check for the newer Supabase cookie format
  const hasAccessToken = cookies.some(
    (c) => c.name.includes("access_token") || c.name.includes("auth-token"),
  );

  if (!hasAuthCookie && !hasAccessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/library/:path*", "/watch/:path*", "/admin/:path*"],
};