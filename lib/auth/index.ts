/**
 * Authentication and Authorization Utilities
 * 
 * Provides JWT-based authentication with role-based access control (RBAC)
 * for the Equity Builders platform.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { User, UserRole } from '@/types';
import { query, queryOne } from '@/lib/db';

// ============================================
// CONFIGURATION
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || 'your-development-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;
const COOKIE_NAME = 'eb_auth_token';

interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// ============================================
// PASSWORD UTILITIES
// ============================================

/**
 * Hash a plaintext password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ============================================
// JWT UTILITIES
// ============================================

/**
 * Create a JWT token for a user
 */
export function createToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// ============================================
// COOKIE MANAGEMENT
// ============================================

/**
 * Set authentication cookie
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Get authentication token from cookie
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  return cookie?.value ?? null;
}

/**
 * Clear authentication cookie
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ============================================
// USER AUTHENTICATION
// ============================================

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  // Find user by email
  const dbUser = await queryOne<User & { password_hash: string }>(
    'SELECT * FROM users WHERE email = $1 AND is_active = true',
    [email]
  );

  if (!dbUser) {
    return null;
  }

  // Verify password
  const isValid = await verifyPassword(password, dbUser.password_hash);
  if (!isValid) {
    return null;
  }

  // Update last login
  await query(
    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
    [dbUser.id]
  );

  // Remove password_hash before returning
  const { password_hash: _, ...user } = dbUser;
  return user as User;
}

/**
 * Register a new user
 */
export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  company?: string;
  licenseNumber?: string;
}): Promise<User | null> {
  try {
    // Check if user already exists
    const existing = await queryOne(
      'SELECT id FROM users WHERE email = $1',
      [data.email]
    );

    if (existing) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Insert user
    const user = await queryOne<User>(
      `INSERT INTO users (
        email, password_hash, first_name, last_name, role, 
        phone, company, license_number, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
      RETURNING *`,
      [
        data.email,
        passwordHash,
        data.firstName,
        data.lastName,
        data.role,
        data.phone || null,
        data.company || null,
        data.licenseNumber || null,
      ]
    );

    return user;
  } catch (error) {
    console.error('User registration failed:', error);
    return null;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  return queryOne<User>(
    'SELECT * FROM users WHERE id = $1 AND is_active = true',
    [userId]
  );
}

/**
 * Get current authenticated user from request
 */
export async function getCurrentUser(): Promise<User | null> {
  const token = await getAuthToken();
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  return getUserById(payload.userId);
}

// ============================================
// AUTHORIZATION (RBAC)
// ============================================

/**
 * Check if user has required role
 */
export function hasRole(user: User, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(user.role);
}

/**
 * Check if user can access a resource
 */
export function canAccessResource(
  user: User,
  resourceOwnerId: string
): boolean {
  // Admins and internal users can access all resources
  if (user.role === 'admin' || user.role === 'internal') {
    return true;
  }

  // Users can access their own resources
  return user.id === resourceOwnerId;
}

/**
 * Require authentication middleware
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Require specific role middleware
 */
export async function requireRole(roles: UserRole[]): Promise<User> {
  const user = await requireAuth();
  if (!hasRole(user, roles)) {
    throw new Error('Insufficient permissions');
  }
  return user;
}

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Create a new session for user
 */
export async function createSession(user: User): Promise<string> {
  const token = createToken(user);
  await setAuthCookie(token);
  return token;
}

/**
 * Destroy current session
 */
export async function destroySession(): Promise<void> {
  await clearAuthCookie();
}

/**
 * Refresh session (extend expiration)
 */
export async function refreshSession(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }

  await createSession(user);
  return true;
}

// ============================================
// PASSWORD RESET
// ============================================

/**
 * Update user password
 */
export async function updatePassword(
  userId: string,
  newPassword: string
): Promise<boolean> {
  try {
    const passwordHash = await hashPassword(newPassword);
    await query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, userId]
    );
    return true;
  } catch (error) {
    console.error('Password update failed:', error);
    return false;
  }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
