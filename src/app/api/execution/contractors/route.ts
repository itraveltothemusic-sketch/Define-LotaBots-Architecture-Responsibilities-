import { NextResponse } from "next/server";

import { getExecutionSnapshot } from "@/lib/services/execution";

export async function GET() {
  const snapshot = await getExecutionSnapshot();
  return NextResponse.json(snapshot);
}
