import { NextResponse } from "next/server";

import { clearSession } from "@/lib/auth/session";

function redirectToLogin(request: Request) {
  return NextResponse.redirect(new URL("/login", request.url));
}

export async function GET(request: Request) {
  await clearSession();
  return redirectToLogin(request);
}

export async function POST(request: Request) {
  await clearSession();
  return redirectToLogin(request);
}
