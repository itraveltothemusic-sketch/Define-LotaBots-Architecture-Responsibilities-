import { NextResponse } from "next/server";

import {
  listDamageClassifications,
  listEvidence,
  listInspectionRecords,
  listPropertyProfiles,
} from "@/lib/db/repositories";
import { generateModuleGuidance } from "@/lib/intelligence/atos";

export async function GET() {
  const [properties, inspections, evidence, damage, guidance] = await Promise.all([
    listPropertyProfiles(),
    listInspectionRecords(),
    listEvidence(),
    listDamageClassifications(),
    generateModuleGuidance("forensic-property"),
  ]);

  return NextResponse.json({
    properties,
    inspections,
    evidence,
    damage,
    guidance,
    generatedAt: new Date().toISOString(),
  });
}
