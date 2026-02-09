/**
 * JSON Web Token (JWT) Utilities
 * 
 * Handles creation and verification of JWTs for user authentication.
 * Tokens are signed with a secret and include user ID and role.
 */

import jwt from 'jsonwebtoken';
import { UserRole } from '@/types';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.SESSION_DURATION || '7d';

export interface JWTPayload {
  userId: string;
  role: UserRole;
  email: string;
}

/**
 * Create a JWT token for a user
 */
export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    issuer: 'equity-builders',
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'equity-builders',
    });
    return decoded as JWTPayload;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Decode a token without verification (useful for debugging)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}
