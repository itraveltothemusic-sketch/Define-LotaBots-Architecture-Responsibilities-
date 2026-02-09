import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/db/prisma";
import { generateGuidance } from "@/lib/atos/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const orgId = session.user.orgId;
  if (!orgId) {
    return NextResponse.json(
      { error: "no_active_organization" },
      { status: 400 },
    );
  }

  const [properties, inspections, evidenceItems, claims, org] = await Promise.all([
    prisma.property.count({ where: { orgId } }),
    prisma.inspection.count({ where: { property: { orgId } } }),
    prisma.evidence.count({ where: { property: { orgId } } }),
    prisma.claim.count({ where: { property: { orgId } } }),
    prisma.organization.findUnique({ where: { id: orgId } }),
  ]);

  const guidance = generateGuidance({
    orgName: org?.name ?? session.user.orgName,
    stats: { properties, inspections, evidenceItems, claims },
  });

  return NextResponse.json(guidance);
}

