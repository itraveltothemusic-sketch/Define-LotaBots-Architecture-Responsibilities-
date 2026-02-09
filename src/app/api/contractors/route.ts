/**
 * Contractors API Route.
 * 
 * CRUD operations for contractor entities and assignments.
 * Includes compliance verification logic.
 * 
 * GET /api/contractors — List all contractors (with filtering)
 * POST /api/contractors — Register a new contractor
 */

import { NextRequest, NextResponse } from 'next/server';
import { contractors, assignments } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const specialty = searchParams.get('specialty');

  let filtered = [...contractors];

  if (status) {
    filtered = filtered.filter(c => c.status === status);
  }

  if (specialty) {
    filtered = filtered.filter(c =>
      c.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
    );
  }

  return NextResponse.json({
    contractors: filtered,
    total: filtered.length,
    assignments: assignments,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Validate contractor data
    // TODO: Initiate insurance verification workflow
    // TODO: Insert into database
    // TODO: Send welcome email with onboarding instructions

    const newContractor = {
      id: `ctr-${Date.now()}`,
      ...body,
      status: 'pending',
      insuranceVerified: false,
      completedProjects: 0,
      activeAssignments: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ contractor: newContractor }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to register contractor' },
      { status: 500 }
    );
  }
}
