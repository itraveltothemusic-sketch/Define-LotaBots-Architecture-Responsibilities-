/**
 * Inspections API Route
 * 
 * Handles forensic inspection records including damage items
 * and associated media.
 */
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");

  // Demo inspection data
  const inspections = [
    {
      id: "insp-1",
      propertyId: "1",
      inspectorId: "demo-user-001",
      type: "INITIAL",
      scheduledDate: "2024-01-22T09:00:00Z",
      completedDate: "2024-01-22T15:30:00Z",
      findings: "Significant hail damage to roofing membrane with multiple puncture points. HVAC condenser units show denting consistent with 2-inch hail.",
      overallSeverity: "SEVERE",
      damageItems: [
        { id: "d1", damageType: "ROOF", severity: "SEVERE", location: "Main roof - Sections A, B", estimatedCost: 87000 },
        { id: "d2", damageType: "HVAC", severity: "MODERATE", location: "Rooftop units 1-4", estimatedCost: 58200 },
        { id: "d3", damageType: "FACADE", severity: "MINOR", location: "North wall exterior", estimatedCost: 12400 },
        { id: "d4", damageType: "WATER", severity: "MODERATE", location: "2nd floor interior", estimatedCost: 18000 },
      ],
      photoCount: 47,
      createdAt: "2024-01-22T00:00:00Z",
    },
  ];

  const filtered = propertyId
    ? inspections.filter((i) => i.propertyId === propertyId)
    : inspections;

  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Validate and create in database
    const inspection = {
      id: crypto.randomUUID(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: inspection,
    }, { status: 201 });
  } catch (error) {
    console.error("Inspection creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create inspection" },
      { status: 500 }
    );
  }
}
