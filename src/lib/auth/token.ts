import { SignJWT, jwtVerify } from "jose";

import { APP_ROLES } from "@/lib/auth/roles";
import type { SessionUser } from "@/types/domain";

const encoder = new TextEncoder();
const authSecret =
  process.env.AUTH_SECRET ?? "local-dev-secret-change-me-before-production";
const secretKey = encoder.encode(authSecret);

export interface SessionToken {
  user: SessionUser;
}

export const SESSION_COOKIE_NAME = "eb_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 12;

export async function issueSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ user } satisfies SessionToken)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    const user = (payload as { user?: unknown }).user;
    if (!isSessionUser(user)) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

function isSessionUser(user: unknown): user is SessionUser {
  if (!user || typeof user !== "object") {
    return false;
  }

  const candidate = user as Partial<SessionUser>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.role === "string" &&
    APP_ROLES.includes(candidate.role)
  );
}
