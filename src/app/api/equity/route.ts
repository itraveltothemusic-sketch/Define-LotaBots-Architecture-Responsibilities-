import { NextResponse } from "next/server";
import { mockEquityOutcomes } from "@/lib/db/mock-data";

/**
 * Equity Outcomes API Route
 *
 * Generates and retrieves equity outcome reports.
 * Every equity figure must be traceable back to documented evidence.
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    let outcomes = [...mockEquityOutcomes];

    if (propertyId) {
      outcomes = outcomes.filter((eo) => eo.propertyId === propertyId);
    }

    return NextResponse.json({ outcomes, total: outcomes.length });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch equity outcomes" },
      { status: 500 }
    );
  }
}
