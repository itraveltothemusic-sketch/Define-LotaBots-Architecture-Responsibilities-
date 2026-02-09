import { NextResponse } from "next/server";
import { mockProperties } from "@/lib/db/mock-data";

/**
 * Properties API Route
 *
 * In production: queries Postgres via Neon for property data.
 * Current: returns mock data for development.
 *
 * Supports:
 * - GET: List all properties (with optional status filter)
 * - POST: Create a new property
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const ownerId = searchParams.get("ownerId");

    let properties = [...mockProperties];

    // Apply filters
    if (status) {
      properties = properties.filter((p) => p.status === status);
    }
    if (ownerId) {
      properties = properties.filter((p) => p.ownerId === ownerId);
    }

    return NextResponse.json({ properties, total: properties.length });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // TODO: Validate input with Zod schema
    // TODO: Insert into Postgres via Neon
    const newProperty = {
      id: `prop_${Date.now()}`,
      ...body,
      status: "intake",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ property: newProperty }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
