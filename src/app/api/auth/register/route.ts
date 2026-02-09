/**
 * Registration API Route
 * 
 * Handles new user registration.
 */

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/api';
import { registerSchema } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid input', validation.error.errors);
    }

    const { email, password, name, role, phone } = validation.data;

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return errorResponse('EMAIL_EXISTS', 'Email already registered', null, 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name,
        role,
        phone: phone || null,
        isActive: true,
      })
      .returning();

    // Create session
    await createSession({
      userId: newUser.id,
      role: newUser.role,
      email: newUser.email,
    });

    return successResponse(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      undefined
    );
  } catch (error) {
    return handleApiError(error);
  }
}
