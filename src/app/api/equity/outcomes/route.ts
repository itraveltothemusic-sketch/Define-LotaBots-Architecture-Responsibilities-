import { NextResponse } from "next/server";

import { getEquitySnapshot } from "@/lib/services/equity";

export async function GET() {
  const snapshot = await getEquitySnapshot();
  return NextResponse.json(snapshot);
}
