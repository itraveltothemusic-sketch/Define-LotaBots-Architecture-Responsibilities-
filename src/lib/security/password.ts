import bcrypt from "bcryptjs";

/**
 * WHY: Password handling must be explicit, minimal, and testable.
 * We use bcryptjs for portability in serverless environments.
 */
export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

