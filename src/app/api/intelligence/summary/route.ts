import { NextResponse } from "next/server";

import { getIntelligenceSnapshot, listEvidence, listPropertyProfiles } from "@/lib/db/repositories";
import { getPortfolioKpis } from "@/lib/intelligence/analytics";
import { generateModuleGuidance } from "@/lib/intelligence/atos";

export async function GET() {
  const [snapshot, kpis, properties, evidence, guidance] = await Promise.all([
    getIntelligenceSnapshot(),
    getPortfolioKpis(),
    listPropertyProfiles(),
    listEvidence(),
    generateModuleGuidance("intelligence"),
  ]);

  return NextResponse.json({
    snapshot,
    kpis,
    properties,
    evidence,
    guidance,
    generatedAt: new Date().toISOString(),
  });
}
