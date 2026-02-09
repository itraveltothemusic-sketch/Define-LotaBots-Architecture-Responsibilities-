/**
 * Logout API Route
 * 
 * Handles user logout and session destruction.
 */

import { destroySession } from '@/lib/auth/session';
import { successResponse, handleApiError } from '@/lib/utils/api';

export async function POST() {
  try {
    await destroySession();
    return successResponse({ message: 'Logged out successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
