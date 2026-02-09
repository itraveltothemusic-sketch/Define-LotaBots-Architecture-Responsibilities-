/**
 * Insurance Claims API Route.
 * 
 * CRUD operations for insurance claim entities.
 * Includes scope discrepancy detection logic.
 * 
 * GET /api/insurance — List all claims (with filtering)
 * POST /api/insurance — Create a new claim
 */

import { NextRequest, NextResponse } from 'next/server';
import { insuranceClaims } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const propertyId = searchParams.get('propertyId');

  let filtered = [...insuranceClaims];

  if (status) {
    filtered = filtered.filter(c => c.status === status);
  }

  if (propertyId) {
    filtered = filtered.filter(c => c.propertyId === propertyId);
  }

  return NextResponse.json({
    claims: filtered,
    total: filtered.length,
    // Aggregate metrics useful for dashboard
    summary: {
      totalClaimed: filtered.reduce((sum, c) => sum + c.amountClaimed, 0),
      totalApproved: filtered.reduce((sum, c) => sum + (c.amountApproved || 0), 0),
      totalPaid: filtered.reduce((sum, c) => sum + (c.amountPaid || 0), 0),
      withDiscrepancies: filtered.filter(c => c.scopeDiscrepancy && c.scopeDiscrepancy > 10).length,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Validate claim data
    // TODO: Insert into database
    // TODO: Trigger ATOS analysis for scope discrepancy detection
    // TODO: Create audit log entry
    // TODO: Send notification to assigned adjuster

    const newClaim = {
      id: `clm-${Date.now()}`,
      ...body,
      status: 'draft',
      interactions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ claim: newClaim }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create claim' },
      { status: 500 }
    );
  }
}
