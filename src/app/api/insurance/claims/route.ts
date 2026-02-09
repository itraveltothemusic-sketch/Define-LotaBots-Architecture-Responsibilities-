import { NextResponse } from "next/server";

import { getInsuranceSnapshot } from "@/lib/services/insurance";

export async function GET() {
  const snapshot = await getInsuranceSnapshot();
  return NextResponse.json(snapshot);
}
