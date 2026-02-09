/**
 * Claims API Route
 * 
 * Handles insurance claim operations including scope comparisons
 * and carrier interaction logging.
 */
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");
  const status = searchParams.get("status");

  const claims = [
    {
      id: "1",
      propertyId: "1",
      claimNumber: "TRV-2024-08847",
      carrier: "Travelers Insurance",
      policyNumber: "POL-8847-2024",
      status: "UNDER_REVIEW",
      filedDate: "2024-01-28T00:00:00Z",
      claimedAmount: 188300,
      approvedAmount: null,
      discrepancyAmount: null,
      adjusterName: "Robert Taylor",
      adjusterEmail: "rtaylor@travelers.com",
      adjusterPhone: "(214) 555-0187",
      createdAt: "2024-01-28T00:00:00Z",
    },
    {
      id: "2",
      propertyId: "2",
      claimNumber: "SF-2024-12045",
      carrier: "State Farm",
      policyNumber: "POL-12045-2024",
      status: "APPROVED",
      filedDate: "2024-01-05T00:00:00Z",
      claimedAmount: 360000,
      approvedAmount: 312000,
      discrepancyAmount: 48000,
      adjusterName: "Jennifer Adams",
      adjusterEmail: "jadams@statefarm.com",
      adjusterPhone: "(713) 555-0291",
      createdAt: "2024-01-05T00:00:00Z",
    },
  ];

  let filtered = [...claims];
  if (propertyId) filtered = filtered.filter((c) => c.propertyId === propertyId);
  if (status) filtered = filtered.filter((c) => c.status === status);

  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const claim = {
      id: crypto.randomUUID(),
      ...body,
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: claim,
    }, { status: 201 });
  } catch (error) {
    console.error("Claim creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create claim" },
      { status: 500 }
    );
  }
}
