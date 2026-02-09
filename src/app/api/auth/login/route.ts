import { NextResponse } from "next/server";
import {
  authenticateFromDemoDirectory,
  buildSafeRedirectPath,
  buildSessionCookieConfig,
  signSession,
} from "@/lib/auth/session";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const next = buildSafeRedirectPath(String(formData.get("next") ?? ""));

  if (!email || !password) {
    const redirectUrl = new URL(`/login?error=missing_credentials&next=${next}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  const user = authenticateFromDemoDirectory(email, password);
  if (!user) {
    const redirectUrl = new URL(`/login?error=invalid_credentials&next=${next}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  const token = await signSession(user);
  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    ...buildSessionCookieConfig(),
  });
  return response;
}
