import { NextResponse } from "next/server";

import { ensureApiSession } from "@/lib/auth/api";
import {
  listCarrierInteractions,
  listClaims,
  listScopeDiscrepancies,
} from "@/lib/db/repositories";
import { generateModuleGuidance } from "@/lib/intelligence/atos";

export async function GET() {
  const unauthorized = await ensureApiSession();
  if (unauthorized) {
    return unauthorized;
  }

  const [claims, interactions, discrepancies, guidance] = await Promise.all([
    listClaims(),
    listCarrierInteractions(),
    listScopeDiscrepancies(),
    generateModuleGuidance("insurance-intelligence"),
  ]);

  return NextResponse.json({
    claims,
    interactions,
    discrepancies,
    guidance,
    generatedAt: new Date().toISOString(),
  });
}
