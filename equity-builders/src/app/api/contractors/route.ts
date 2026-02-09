/**
 * Contractors API Route
 * 
 * Manages contractor records and scope assignments.
 * In production: includes license verification, insurance checks,
 * and performance rating calculations.
 */

import { NextRequest, NextResponse } from "next/server";
import { contractors, scopeAssignments } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "contractors" | "assignments"

  if (type === "assignments") {
    return NextResponse.json({
      data: scopeAssignments,
      total: scopeAssignments.length,
    });
  }

  return NextResponse.json({
    data: contractors,
    total: contractors.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Validate contractor data
    // TODO: Verify license and insurance
    // TODO: Insert into Postgres
    
    return NextResponse.json(
      { message: "Contractor added", data: { id: `con_${Date.now()}`, ...body } },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contractor creation error:", error);
    return NextResponse.json(
      { error: "Failed to add contractor" },
      { status: 500 },
    );
  }
}
