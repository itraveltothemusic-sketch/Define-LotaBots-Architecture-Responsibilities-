import { NextRequest, NextResponse } from 'next/server';
import { registerUser, createSession, validatePassword } from '@/lib/auth';
import { isValidEmail } from '@/lib/utils';
import type { ApiResponse, UserRole } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, role, phone, company } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'All required fields must be provided',
        },
      }, { status: 400 });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'INVALID_EMAIL',
          message: 'Invalid email format',
        },
      }, { status: 400 });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: passwordValidation.errors.join(', '),
        },
      }, { status: 400 });
    }

    // Register user
    const user = await registerUser({
      email,
      password,
      firstName,
      lastName,
      role: role as UserRole,
      phone,
      company,
    });

    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: 'User registration failed. Email may already be in use.',
        },
      }, { status: 400 });
    }

    // Create session
    const token = await createSession(user);

    // Remove sensitive data
    const { passwordHash, ...safeUser } = user as unknown as { passwordHash: string; [key: string]: unknown };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: safeUser,
        token,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred during registration',
      },
    }, { status: 500 });
  }
}
