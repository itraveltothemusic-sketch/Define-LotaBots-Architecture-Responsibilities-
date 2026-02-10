import { NextResponse, type NextRequest } from "next/server";
import { canAccessRoute } from "@/lib/auth/authorization";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/token";

function redirectToLogin(request: NextRequest) {
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const loginUrl = new URL(`/login?next=${encodeURIComponent(nextPath)}`, request.url);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/platform")) {
    if (!token) {
      return redirectToLogin(request);
    }

    const session = await verifySessionToken(token);
    if (!session) {
      const response = redirectToLogin(request);
      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: "",
        expires: new Date(0),
        path: "/",
      });
      return response;
    }

    if (!canAccessRoute(pathname, session.role)) {
      const fallbackUrl = new URL("/", request.url);
      fallbackUrl.searchParams.set("denied", "1");
      return NextResponse.redirect(fallbackUrl);
    }
  }

  if (pathname === "/login" && token) {
    const session = await verifySessionToken(token);
    if (session) {
      return NextResponse.redirect(new URL("/platform/intelligence", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/platform/:path*", "/login"],
};
