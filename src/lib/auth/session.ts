import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { SESSION_TTL_SECONDS, signSessionToken, verifySessionToken } from "@/lib/auth/token";
import type { PlatformUser } from "@/types/domain";

const DEFAULT_DEMO_PASSWORD = "EquityBuilders-2026";

type DemoDirectoryEntry = PlatformUser & { password: string };

// Bootstrap identity directory for local environments.
// In production this should be replaced by SSO / IdP-backed authentication.
const demoDirectory: DemoDirectoryEntry[] = [
  {
    id: "usr_owner_01",
    name: "Olivia Rivera",
    email: "owner@equitybuilders.local",
    role: "OWNER",
    password: DEFAULT_DEMO_PASSWORD,
  },
  {
    id: "usr_adjuster_01",
    name: "Liam Shaw",
    email: "adjuster@equitybuilders.local",
    role: "ADJUSTER",
    password: DEFAULT_DEMO_PASSWORD,
  },
  {
    id: "usr_contractor_01",
    name: "Mina Patel",
    email: "contractor@equitybuilders.local",
    role: "CONTRACTOR",
    password: DEFAULT_DEMO_PASSWORD,
  },
  {
    id: "usr_internal_01",
    name: "Marcus Long",
    email: "internal@equitybuilders.local",
    role: "INTERNAL",
    password: DEFAULT_DEMO_PASSWORD,
  },
];

export function authenticateFromDemoDirectory(
  email: string,
  password: string,
): PlatformUser | null {
  const user = demoDirectory.find(
    (entry) =>
      entry.email.toLowerCase() === email.toLowerCase() &&
      entry.password === password,
  );

  if (!user) {
    return null;
  }

  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export async function signSession(user: PlatformUser) {
  return signSessionToken(user);
}

export async function verifySession(token: string): Promise<PlatformUser | null> {
  return verifySessionToken(token);
}

export function buildSessionCookieConfig() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}

export function clearSessionOnResponse(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    ...buildSessionCookieConfig(),
    expires: new Date(0),
    maxAge: 0,
  });
}

export function buildSafeRedirectPath(pathValue: string | null | undefined) {
  if (!pathValue) {
    return "/platform";
  }

  if (!pathValue.startsWith("/platform")) {
    return "/platform";
  }

  return pathValue;
}

export function getDemoDirectoryUsers() {
  return demoDirectory.map(({ password: _password, ...safeUser }) => safeUser);
}
