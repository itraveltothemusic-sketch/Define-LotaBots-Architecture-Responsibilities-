/**
 * Insurance Claims API Route
 * 
 * Handles insurance claim lifecycle operations.
 * In production: Postgres-backed with ATOS discrepancy analysis triggers.
 */

import { NextRequest, NextResponse } from "next/server";
import { insuranceClaims } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const propertyId = searchParams.get("propertyId");

  let result = [...insuranceClaims];

  if (status) result = result.filter((c) => c.status === status);
  if (propertyId) result = result.filter((c) => c.propertyId === propertyId);

  return NextResponse.json({
    data: result,
    total: result.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Validate claim data
    // TODO: Insert into Postgres
    // TODO: Trigger ATOS scope analysis
    
    return NextResponse.json(
      { message: "Claim created", data: { id: `claim_${Date.now()}`, ...body } },
      { status: 201 },
    );
  } catch (error) {
    console.error("Claim creation error:", error);
    return NextResponse.json(
      { error: "Failed to create claim" },
      { status: 500 },
    );
  }
}
