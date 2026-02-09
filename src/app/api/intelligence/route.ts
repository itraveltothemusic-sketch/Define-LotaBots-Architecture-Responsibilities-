import { NextResponse } from "next/server";

import { getIntelligenceSnapshot } from "@/lib/services/intelligence";

export async function GET() {
  const snapshot = await getIntelligenceSnapshot();
  return NextResponse.json(snapshot);
}
