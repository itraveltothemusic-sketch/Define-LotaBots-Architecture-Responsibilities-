import { NextResponse } from "next/server";

import { getForensicSnapshot } from "@/lib/services/forensic";

export async function GET() {
  const snapshot = await getForensicSnapshot();
  return NextResponse.json(snapshot);
}
