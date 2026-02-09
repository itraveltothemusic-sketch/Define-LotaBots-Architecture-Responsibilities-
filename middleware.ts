import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import type { AppRole } from "@/lib/auth/roles";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/token";

const routePolicies: Array<{ prefix: string; roles: AppRole[] }> = [
  { prefix: "/dashboard/forensic", roles: ["OWNER", "ADJUSTER", "INTERNAL"] },
  { prefix: "/dashboard/insurance", roles: ["OWNER", "ADJUSTER", "INTERNAL"] },
  { prefix: "/dashboard/execution", roles: ["OWNER", "CONTRACTOR", "INTERNAL"] },
  { prefix: "/dashboard/equity", roles: ["OWNER", "INTERNAL"] },
  { prefix: "/api/forensic", roles: ["OWNER", "ADJUSTER", "INTERNAL"] },
  { prefix: "/api/insurance", roles: ["OWNER", "ADJUSTER", "INTERNAL"] },
  { prefix: "/api/execution", roles: ["OWNER", "CONTRACTOR", "INTERNAL"] },
  { prefix: "/api/equity", roles: ["OWNER", "INTERNAL"] },
];

function isApiRequest(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

function unauthorizedResponse(
  request: NextRequest,
  status: 401 | 403,
  message: string,
) {
  if (isApiRequest(request.nextUrl.pathname)) {
    return NextResponse.json({ error: message }, { status });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return unauthorizedResponse(
      request,
      401,
      "Authentication required for this resource.",
    );
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return unauthorizedResponse(
      request,
      401,
      "Session is invalid or has expired.",
    );
  }

  const policy = routePolicies.find((candidate) =>
    request.nextUrl.pathname.startsWith(candidate.prefix),
  );

  if (policy && !policy.roles.includes(session.role)) {
    if (isApiRequest(request.nextUrl.pathname)) {
      return NextResponse.json(
        { error: "Insufficient role permissions for this endpoint." },
        { status: 403 },
      );
    }

    return NextResponse.redirect(new URL("/dashboard?access=denied", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/intelligence/:path*",
    "/api/forensic/:path*",
    "/api/insurance/:path*",
    "/api/execution/:path*",
    "/api/equity/:path*",
  ],
};
