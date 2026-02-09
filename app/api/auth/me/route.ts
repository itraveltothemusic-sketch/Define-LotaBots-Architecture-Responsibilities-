import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import type { ApiResponse } from '@/types';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
        },
      }, { status: 401 });
    }

    // Remove sensitive data
    const { passwordHash, ...safeUser } = user as unknown as { passwordHash: string; [key: string]: unknown };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { user: safeUser },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred',
      },
    }, { status: 500 });
  }
}
