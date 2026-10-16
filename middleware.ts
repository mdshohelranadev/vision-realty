import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge-safe guard: only uses the Request/Response Web APIs (no Node-only modules).
const ADMIN_COOKIE = "vision_admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page is always reachable.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const authed = request.cookies.get(ADMIN_COOKIE)?.value === "1";
  if (!authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
