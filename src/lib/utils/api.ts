/**
 * API Utility Functions
 * 
 * Standardized response formatting and error handling for API routes.
 */

import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

/**
 * Create a successful API response
 */
export function successResponse<T>(data: T, meta?: ApiResponse['meta']): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta,
  });
}

/**
 * Create an error API response
 */
export function errorResponse(
  code: string,
  message: string,
  details?: any,
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error);

  if (error instanceof Error) {
    // Known error types
    if (error.message.includes('Authentication required')) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', null, 401);
    }
    
    if (error.message.includes('Permission denied')) {
      return errorResponse('FORBIDDEN', 'Permission denied', null, 403);
    }

    // Generic error
    return errorResponse(
      'INTERNAL_ERROR',
      process.env.NODE_ENV === 'production' 
        ? 'An internal error occurred' 
        : error.message,
      process.env.NODE_ENV === 'production' ? undefined : error.stack
    );
  }

  // Unknown error type
  return errorResponse('UNKNOWN_ERROR', 'An unknown error occurred', null, 500);
}

/**
 * Pagination helper
 */
export function paginate(page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;
  return {
    offset,
    limit,
  };
}

/**
 * Calculate pagination meta
 */
export function paginationMeta(total: number, page: number, limit: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
