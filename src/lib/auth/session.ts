import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { UserRole, UserSession } from "@/types/domain";

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "eb_session";
const KNOWN_ROLES: UserRole[] = ["Owner", "Contractor", "Adjuster", "Internal"];

interface SessionPayload {
  userId: string;
  displayName: string;
  role: UserRole;
  lastAuthenticatedAt: string;
}

export function isUserRole(value: string): value is UserRole {
  return KNOWN_ROLES.includes(value as UserRole);
}

function isSessionPayload(value: unknown): value is SessionPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SessionPayload>;
  return Boolean(
    candidate.userId &&
      candidate.displayName &&
      candidate.lastAuthenticatedAt &&
      candidate.role &&
      isUserRole(candidate.role),
  );
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isSessionPayload(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<UserSession> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function writeSession(input: {
  displayName: string;
  role: UserRole;
}): Promise<void> {
  const cookieStore = await cookies();
  const payload: SessionPayload = {
    userId: crypto.randomUUID(),
    displayName: input.displayName.trim(),
    role: input.role,
    lastAuthenticatedAt: new Date().toISOString(),
  };

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
