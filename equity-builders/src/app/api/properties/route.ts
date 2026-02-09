/**
 * Properties API Route
 * 
 * Handles CRUD operations for properties.
 * In production, all operations validate auth and enforce
 * role-based access controls.
 */
import { NextRequest, NextResponse } from "next/server";

// Demo property data — mirrors the database schema
const DEMO_PROPERTIES = [
  {
    id: "1",
    address: "450 Commerce Blvd",
    city: "Dallas",
    state: "TX",
    zipCode: "75201",
    propertyType: "COMMERCIAL",
    status: "CLAIM_FILED",
    ownerId: "demo-user-002",
    yearBuilt: 2004,
    squareFootage: 28000,
    roofType: "Modified Bitumen",
    estimatedValue: 2400000,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-02-08T00:00:00Z",
  },
  {
    id: "2",
    address: "1200 Industrial Pkwy",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    propertyType: "INDUSTRIAL",
    status: "IN_REPAIR",
    ownerId: "demo-user-002",
    yearBuilt: 1998,
    squareFootage: 65000,
    roofType: "TPO Membrane",
    estimatedValue: 5100000,
    createdAt: "2023-12-10T00:00:00Z",
    updatedAt: "2024-02-07T00:00:00Z",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const ownerId = searchParams.get("ownerId");

  let properties = [...DEMO_PROPERTIES];

  if (status) {
    properties = properties.filter((p) => p.status === status);
  }
  if (ownerId) {
    properties = properties.filter((p) => p.ownerId === ownerId);
  }

  return NextResponse.json({
    success: true,
    data: properties,
    total: properties.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, city, state, zipCode, propertyType, ownerId } = body;

    if (!address || !city || !state || !zipCode || !propertyType) {
      return NextResponse.json(
        { success: false, error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // TODO: In production, create in database
    // const property = await db.property.create({ data: { ... } });

    const newProperty = {
      id: crypto.randomUUID(),
      address,
      city,
      state,
      zipCode,
      propertyType,
      status: "INTAKE",
      ownerId: ownerId || "demo-user-001",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newProperty,
    }, { status: 201 });
  } catch (error) {
    console.error("Property creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create property" },
      { status: 500 }
    );
  }
}
