import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSession } from '@/lib/auth';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Email and password are required',
        },
      }, { status: 400 });
    }

    // Authenticate user
    const user = await authenticateUser(email, password);
    
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      }, { status: 401 });
    }

    // Create session
    const token = await createSession(user);

    // Remove sensitive data before sending
    const { passwordHash, ...safeUser } = user as unknown as { passwordHash: string; [key: string]: unknown };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred during login',
      },
    }, { status: 500 });
  }
}
