import { NextResponse } from "next/server";

import { listEquityOutcomes } from "@/lib/db/repositories";
import { generateModuleGuidance } from "@/lib/intelligence/atos";

export async function GET() {
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
