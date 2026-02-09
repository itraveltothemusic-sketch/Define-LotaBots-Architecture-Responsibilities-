/**
 * Properties API Route.
 * 
 * CRUD operations for property entities.
 * In production: queries Postgres via Prisma/Drizzle.
 * Current: returns mock data with the correct API contract.
 * 
 * GET /api/properties — List all properties (with filtering)
 * POST /api/properties — Create a new property
 */

import { NextRequest, NextResponse } from 'next/server';
import { properties } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  let filtered = [...properties];

  // Filter by status if provided
  if (status) {
    filtered = filtered.filter(p => p.status === status);
  }

  // Filter by search term if provided
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.address.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term) ||
      p.ownerName.toLowerCase().includes(term)
    );
  }

  return NextResponse.json({
    properties: filtered,
    total: filtered.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Validate request body against Property schema
    // TODO: Insert into Postgres database
    // TODO: Generate property ID
    // TODO: Create audit log entry

    // Return the created property (mock)
    const newProperty = {
      id: `prop-${Date.now()}`,
      ...body,
      status: 'intake',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ property: newProperty }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
