import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';
import type { ApiResponse } from '@/types';

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred during logout',
      },
    }, { status: 500 });
  }
}
