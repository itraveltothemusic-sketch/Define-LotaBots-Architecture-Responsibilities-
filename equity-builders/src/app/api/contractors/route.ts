/**
 * Contractors API Route
 * 
 * Manages contractor profiles, assignments, and compliance tracking.
 */
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const contractors = [
    {
      id: "1",
      userId: "demo-user-003",
      companyName: "Rivera Construction LLC",
      licenseNumber: "TX-CON-2024-1847",
      specialties: ["Roofing", "HVAC", "General Repair"],
      status: "ACTIVE",
      rating: 4.8,
      completedProjects: 12,
      createdAt: "2023-08-15T00:00:00Z",
    },
    {
      id: "2",
      userId: "demo-user-004",
      companyName: "Summit Roofing Solutions",
      licenseNumber: "TX-CON-2023-9912",
      specialties: ["Roofing", "Waterproofing", "Facade"],
      status: "ACTIVE",
      rating: 4.9,
      completedProjects: 18,
      createdAt: "2023-05-20T00:00:00Z",
    },
  ];

  return NextResponse.json({
    success: true,
    data: contractors,
    total: contractors.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const contractor = {
      id: crypto.randomUUID(),
      ...body,
      status: "PENDING",
      rating: null,
      completedProjects: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: contractor,
    }, { status: 201 });
  } catch (error) {
    console.error("Contractor creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create contractor" },
      { status: 500 }
    );
  }
}
