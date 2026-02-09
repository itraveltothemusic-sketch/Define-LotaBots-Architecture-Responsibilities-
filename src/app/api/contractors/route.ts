import { NextResponse } from "next/server";

import { ensureApiSession } from "@/lib/auth/api";
import {
  listComplianceRecords,
  listContractors,
  listProgressVerifications,
  listScopeAssignments,
} from "@/lib/db/repositories";
import { generateModuleGuidance } from "@/lib/intelligence/atos";

export async function GET() {
  const unauthorized = await ensureApiSession();
  if (unauthorized) {
    return unauthorized;
  }

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
