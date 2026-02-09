import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "eb_session";

function isTruthyEnv(value: string | undefined): boolean {
  return value === "1" || value?.toLowerCase() === "true";
}

function isDemoMode(): boolean {
  return (
    isTruthyEnv(process.env.EB_DEMO_MODE) ||
    (process.env.EB_DEMO_MODE == null && process.env.NODE_ENV !== "production")
  );
}

function sessionSecret(): string | null {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length > 0) {
    return process.env.SESSION_SECRET;
  }
  if (isDemoMode() && process.env.NODE_ENV !== "production") {
    return "insecure-dev-session-secret_change-me";
  }
  return null;
}

async function hasValidSession(token: string): Promise<boolean> {
  const secret = sessionSecret();
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/app")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (token && (await hasValidSession(token))) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("returnTo", `${pathname}${search}`);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/app/:path*"],
};

