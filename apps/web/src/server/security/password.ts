import bcrypt from "bcryptjs";

/**
 * Password hashing is used only for Credentials auth.
 *
 * WHY bcryptjs:
 * - Pure JS implementation (works in more runtimes)
 * - Reasonably secure when configured with sufficient cost
 *
 * NOTE: For high-security environments, consider Argon2id with calibrated parameters.
 */

const BCRYPT_COST = 12;

export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, BCRYPT_COST);
}

export async function verifyPassword(
  plaintext: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plaintext, passwordHash);
}

