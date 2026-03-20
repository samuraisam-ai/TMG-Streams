import { NextRequest, NextResponse } from "next/server";
 
export function middleware(request: NextRequest) {
  const hasCookie = request.cookies.getAll().some(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"),
  );

  if (!hasCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/library/:path*", "/watch/:path*", "/admin/:path*"],
};