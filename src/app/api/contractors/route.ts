import { NextResponse } from "next/server";

import {
  listComplianceRecords,
  listContractors,
  listProgressVerifications,
  listScopeAssignments,
} from "@/lib/db/repositories";
import { generateModuleGuidance } from "@/lib/intelligence/atos";

export async function GET() {
  const [contractors, assignments, verifications, compliance, guidance] =
    await Promise.all([
      listContractors(),
      listScopeAssignments(),
      listProgressVerifications(),
      listComplianceRecords(),
      generateModuleGuidance("contractor-execution"),
    ]);

  return NextResponse.json({
    contractors,
    assignments,
    verifications,
    compliance,
    guidance,
    generatedAt: new Date().toISOString(),
  });
}
