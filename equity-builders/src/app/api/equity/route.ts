/**
 * Equity Outcomes API Route
 * 
 * Manages equity outcome records — the final output of the
 * platform's value chain.
 */
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");

  const outcomes = [
    {
      id: "1",
      propertyId: "4",
      preEventValue: 3200000,
      claimTotal: 389000,
      repairCosts: 342000,
      postRepairValue: 3740000,
      equityGain: 540000,
      roiPercent: 16.9,
      isVerified: true,
      verifiedAt: "2024-02-05T00:00:00Z",
      narrative: "This Class A office property sustained significant wind and hail damage...",
      createdAt: "2024-02-05T00:00:00Z",
    },
  ];

  const filtered = propertyId
    ? outcomes.filter((o) => o.propertyId === propertyId)
    : outcomes;

  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const outcome = {
      id: crypto.randomUUID(),
      ...body,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: outcome,
    }, { status: 201 });
  } catch (error) {
    console.error("Equity outcome creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create equity outcome" },
      { status: 500 }
    );
  }
}
