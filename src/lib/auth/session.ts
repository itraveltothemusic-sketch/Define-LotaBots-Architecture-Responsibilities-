import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { z } from "zod";

import { ROLE_VALUES, type AuthSession } from "@/lib/auth/types";

const SESSION_COOKIE_NAME = "eb.session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

const sessionSchema = z.object({
  userId: z.string().min(1),
  fullName: z.string().min(2),
  email: z.string().email(),
  role: z.enum(ROLE_VALUES),
});

function getSessionSecret(): string {
  return process.env.AUTH_SESSION_SECRET ?? "dev-local-session-secret-change-me";
}

function signSessionPayload(payloadBase64: string): string {
  return createHmac("sha256", getSessionSecret()).update(payloadBase64).digest("hex");
}

function encodePayload(session: AuthSession): string {
  return Buffer.from(JSON.stringify(session), "utf-8").toString("base64url");
}

function decodePayload(payloadBase64: string): AuthSession | null {
  try {
    const decodedJson = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const parsed = JSON.parse(decodedJson) as unknown;
    return sessionSchema.parse(parsed);
  } catch {
    return null;
  }
}

function validateSignature(payloadBase64: string, signature: string): boolean {
  const expectedSignature = signSessionPayload(payloadBase64);
  const signatureBytes = Buffer.from(signature, "utf-8");
  const expectedBytes = Buffer.from(expectedSignature, "utf-8");

  if (signatureBytes.length !== expectedBytes.length) {
    return false;
  }

  return timingSafeEqual(signatureBytes, expectedBytes);
}

function createSessionToken(session: AuthSession): string {
  const payload = encodePayload(session);
  const signature = signSessionPayload(payload);
  return `${payload}.${signature}`;
}

function parseSessionToken(token: string): AuthSession | null {
  const [payloadBase64, signature] = token.split(".");

  if (!payloadBase64 || !signature || !validateSignature(payloadBase64, signature)) {
    return null;
  }

  return decodePayload(payloadBase64);
}

export async function establishSession(session: AuthSession): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawToken) {
    return null;
  }

  return parseSessionToken(rawToken);
}
