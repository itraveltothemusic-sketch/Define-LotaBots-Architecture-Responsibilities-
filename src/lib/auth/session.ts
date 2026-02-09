/**
 * Session Management Utilities
 * 
 * Handles reading and writing session cookies for authenticated users.
 * Uses httpOnly cookies for security.
 */

import { cookies } from 'next/headers';
import { JWTPayload, verifyToken, createToken } from './jwt';

const SESSION_COOKIE_NAME = 'eb_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  return verifyToken(sessionCookie.value);
}

/**
 * Create a new session (set cookie)
 */
export async function createSession(payload: JWTPayload): Promise<void> {
  const token = createToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

/**
 * Destroy the current session (clear cookie)
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Require authentication (throw if not authenticated)
 */
export async function requireAuth(): Promise<JWTPayload> {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Authentication required');
  }

  return session;
}

/**
 * Check if user has a specific role
 */
export async function hasRole(allowedRoles: string[]): Promise<boolean> {
  const session = await getSession();
  
  if (!session) {
    return false;
  }

  return allowedRoles.includes(session.role);
}
