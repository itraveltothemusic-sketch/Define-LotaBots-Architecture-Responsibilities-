/**
 * Authentication & Authorization Module
 *
 * Handles JWT-based authentication with role-based access control.
 * Four roles with distinct permission levels:
 * - OWNER: Property owners — can view their properties and outcomes
 * - CONTRACTOR: Contractors — can view assignments and update progress
 * - ADJUSTER: Insurance adjusters — can view claims and inspections
 * - INTERNAL: Platform team — full access to all features
 */
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { UserRole } from "@/types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "equity-builders-dev-secret-change-in-production"
);

const COOKIE_NAME = "eb-session";

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * Create a signed JWT token for the authenticated user.
 */
export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token.
 * Returns null if the token is invalid or expired.
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Get the current authenticated session from cookies.
 * Returns null if no valid session exists.
 */
export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Set the session cookie after successful authentication.
 */
export async function setSession(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Clear the session cookie (logout).
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Role-based access control check.
 * Returns true if the user's role has access to the required level.
 *
 * Permission hierarchy:
 * INTERNAL > ADJUSTER > CONTRACTOR > OWNER
 * (INTERNAL can access everything, OWNER only their own data)
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  OWNER: 1,
  CONTRACTOR: 2,
  ADJUSTER: 3,
  INTERNAL: 4,
};

export function hasPermission(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Check if a user can access a specific resource.
 * INTERNAL users can access everything.
 * Other users can only access resources they own or are assigned to.
 */
export function canAccessResource(
  userRole: UserRole,
  userId: string,
  resourceOwnerId: string
): boolean {
  if (userRole === "INTERNAL") return true;
  return userId === resourceOwnerId;
}
