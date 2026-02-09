import { NextResponse } from "next/server";

import { ensureApiSession } from "@/lib/auth/api";
import { listEquityOutcomes } from "@/lib/db/repositories";
import { generateModuleGuidance } from "@/lib/intelligence/atos";

export async function GET() {
  const unauthorized = await ensureApiSession();
  if (unauthorized) {
    return unauthorized;
  }

  const [outcomes, guidance] = await Promise.all([
    listEquityOutcomes(),
    generateModuleGuidance("equity-outcome"),
  ]);

  return NextResponse.json({
    outcomes,
    guidance,
    generatedAt: new Date().toISOString(),
  });
}
