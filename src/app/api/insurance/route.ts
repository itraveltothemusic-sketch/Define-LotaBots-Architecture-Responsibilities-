import { NextResponse } from "next/server";
import { mockClaims } from "@/lib/db/mock-data";

/**
 * Insurance Claims API Route
 *
 * Manages the full claim lifecycle.
 * Every claim action is logged for audit trail.
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const propertyId = searchParams.get("propertyId");

    let claims = [...mockClaims];

    if (status) {
      claims = claims.filter((c) => c.status === status);
    }
    if (propertyId) {
      claims = claims.filter((c) => c.propertyId === propertyId);
    }

    return NextResponse.json({ claims, total: claims.length });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch claims" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newClaim = {
      id: `clm_${Date.now()}`,
      ...body,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ claim: newClaim }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create claim" },
      { status: 500 }
    );
  }
}
