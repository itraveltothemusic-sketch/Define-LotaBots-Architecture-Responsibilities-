/**
 * Equity Outcomes API Route.
 * 
 * CRUD operations for equity outcome entities.
 * Includes equity calculation logic.
 * 
 * GET /api/equity — List all equity outcomes
 * POST /api/equity — Create/calculate a new equity outcome
 */

import { NextRequest, NextResponse } from 'next/server';
import { equityOutcomes } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const propertyId = searchParams.get('propertyId');

  let filtered = [...equityOutcomes];

  if (status) {
    filtered = filtered.filter(e => e.status === status);
  }

  if (propertyId) {
    filtered = filtered.filter(e => e.propertyId === propertyId);
  }

  // Calculate portfolio-wide metrics
  const portfolioMetrics = {
    totalEquityGain: filtered.reduce((sum, e) => sum + e.equityGain, 0),
    verifiedGain: filtered.filter(e => e.status === 'verified').reduce((sum, e) => sum + e.equityGain, 0),
    avgGainPercent: filtered.length > 0
      ? filtered.reduce((sum, e) => sum + e.equityGainPercent, 0) / filtered.length
      : 0,
    totalInsurancePayout: filtered.reduce((sum, e) => sum + e.insurancePayout, 0),
    totalRepairCost: filtered.reduce((sum, e) => sum + e.repairCost, 0),
  };

  return NextResponse.json({
    outcomes: filtered,
    total: filtered.length,
    portfolioMetrics,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, valueBefore, valueAfter, insurancePayout, repairCost } = body;

    // Calculate equity gain
    const equityGain = valueAfter - valueBefore;
    const equityGainPercent = valueBefore > 0 ? (equityGain / valueBefore) * 100 : 0;

    // TODO: Generate AI narrative explaining the equity gain
    // TODO: Cross-reference with inspection reports and claim data
    // TODO: Insert into database
    // TODO: Trigger verification workflow if gain exceeds threshold

    const newOutcome = {
      id: `eq-${Date.now()}`,
      propertyId,
      valueBefore,
      valueAfter,
      insurancePayout,
      repairCost,
      equityGain,
      equityGainPercent: Math.round(equityGainPercent * 10) / 10,
      status: 'calculating',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ outcome: newOutcome }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create equity outcome' },
      { status: 500 }
    );
  }
}
