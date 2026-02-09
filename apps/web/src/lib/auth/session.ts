import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionUser } from "./types";
import { EB_DEMO_MODE, getRequiredEnv } from "@/lib/env";

const COOKIE_NAME = "eb_session";

function getSessionSecret(): string {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length > 0) {
    return process.env.SESSION_SECRET;
  }

  // In development, we allow a deterministic fallback so the repo boots
  // without requiring secrets. This is intentionally unsafe for production.
  if (EB_DEMO_MODE && process.env.NODE_ENV !== "production") {
    return "insecure-dev-session-secret_change-me";
  }

  return getRequiredEnv("SESSION_SECRET");
}

function secretKey(): Uint8Array {
  return new TextEncoder().encode(getSessionSecret());
}

export type SessionClaims = {
  user: SessionUser;
};

export async function createSessionCookie(user: SessionUser): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 60 * 60 * 24 * 7; // 7 days

  const token = await new SignJWT({ user } satisfies SessionClaims)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(user.id)
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(secretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(exp * 1000),
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export async function readSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify<SessionClaims>(token, secretKey());
    return verified.payload.user ?? null;
  } catch {
    return null;
  }
}

