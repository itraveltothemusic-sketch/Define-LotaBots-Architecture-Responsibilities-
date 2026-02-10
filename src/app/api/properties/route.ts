/**
 * Properties API Route
 * 
 * Handles property CRUD operations.
 */

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { properties } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/session';
import { successResponse, errorResponse, handleApiError, paginate, paginationMeta } from '@/lib/utils/api';
import { createPropertySchema } from '@/lib/utils/validation';

/**
 * GET /api/properties - List all properties for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    // Get pagination params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const { offset } = paginate(page, limit);

    // Fetch properties (owners see their own, internal users see all)
    const query = session.role === 'OWNER'
      ? db.select().from(properties).where(eq(properties.ownerId, session.userId))
      : db.select().from(properties);

    const items = await query.limit(limit).offset(offset);

    // Get total count for pagination
    const [countResult] = await db
      .select({ count: properties.id })
      .from(properties);

    return successResponse(
      { properties: items },
      paginationMeta(countResult?.count || 0, page, limit)
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/properties - Create a new property
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    // Only owners and internal users can create properties
    if (!['OWNER', 'INTERNAL'].includes(session.role)) {
      return errorResponse('FORBIDDEN', 'Permission denied', null, 403);
    }

    const body = await request.json();

    // Validate input
    const validation = createPropertySchema.safeParse(body);
    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid input', validation.error.errors);
    }

    const data = validation.data;

    // Determine and validate ownerId based on role
    let ownerId: string;
    if (session.role === 'OWNER') {
      ownerId = session.userId;
    } else {
      // INTERNAL users must explicitly provide a valid ownerId
      if (typeof body.ownerId !== 'string' || !body.ownerId.trim()) {
        return errorResponse(
          'VALIDATION_ERROR',
          'Invalid input',
          [{ path: ['ownerId'], message: 'ownerId is required for INTERNAL users', code: 'custom' }]
        );
      }
      ownerId = body.ownerId.trim();
    }

    // Create property
    const [property] = await db
      .insert(properties)
      .values({
        ownerId,
        name: data.name,
        addressStreet: data.addressStreet,
        addressCity: data.addressCity,
        addressState: data.addressState,
        addressZip: data.addressZip,
        addressCountry: data.addressCountry,
        propertyType: data.propertyType,
        squareFootage: data.squareFootage || null,
        yearBuilt: data.yearBuilt || null,
        stories: data.stories || null,
      })
      .returning();

    return successResponse({ property });
  } catch (error) {
    return handleApiError(error);
  }
}
