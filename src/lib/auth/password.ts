/**
 * Password Hashing and Verification Utilities
 * 
 * Uses bcrypt for secure password hashing with appropriate salt rounds.
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12; // Higher = more secure but slower

/**
 * Hash a plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
