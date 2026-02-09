/**
 * Properties API Route
 * 
 * Handles CRUD operations for property records.
 * In production, this connects to Neon Postgres.
 * Currently returns mock data for frontend development.
 */

import { NextRequest, NextResponse } from "next/server";
import { properties } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let result = [...properties];

  if (status) {
    result = result.filter((p) => p.status === status);
  }

  return NextResponse.json({
    data: result,
    total: result.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Validate input with Zod schema
    // TODO: Insert into Postgres via Neon
    // TODO: Trigger ATOS initial analysis
    
    return NextResponse.json(
      { message: "Property created", data: { id: `prop_${Date.now()}`, ...body } },
      { status: 201 },
    );
  } catch (error) {
    console.error("Property creation error:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 },
    );
  }
}
