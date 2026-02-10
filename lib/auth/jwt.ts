/**
 * JWT Token Management
 * 
 * Create and verify JSON Web Tokens for stateless authentication.
 */

import jwt from "jsonwebtoken";
import type { User } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET ?? process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT secret is not set. Please define the JWT_SECRET (preferred) or NEXTAUTH_SECRET environment variable."
  );
}
const TOKEN_EXPIRY = "7d"; // 7 days

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

/**
 * Create a JWT token for a user
 */
export function createToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}
