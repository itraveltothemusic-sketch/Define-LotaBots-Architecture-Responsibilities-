import { NextResponse } from "next/server";

import { ensureApiSession } from "@/lib/auth/api";
import { getIntelligenceSnapshot, listEvidence, listPropertyProfiles } from "@/lib/db/repositories";
import { getPortfolioKpis } from "@/lib/intelligence/analytics";
import { generateModuleGuidance } from "@/lib/intelligence/atos";

export async function GET() {
  const unauthorized = await ensureApiSession();
  if (unauthorized) {
    return unauthorized;
  }

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
