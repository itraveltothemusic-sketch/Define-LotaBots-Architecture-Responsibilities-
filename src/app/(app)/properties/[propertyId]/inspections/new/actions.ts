"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { getSession } from "@/lib/auth/session";
import { canEditProperty } from "@/lib/security/roles";
import { CreateInspectionSchema } from "@/lib/validation/inspection";

export async function createInspection(propertyId: string, formData: FormData) {
  const session = await getSession();
  if (!session?.user || !session.user.orgId) redirect("/sign-in");
  if (!session.user.role || !canEditProperty(session.user.role)) {
    redirect(`/properties/${propertyId}?error=forbidden`);
  }

  const raw = {
    performedAt: String(formData.get("performedAt") || ""),
    inspectorName: String(formData.get("inspectorName") || ""),
    summary: String(formData.get("summary") || ""),
  };

  const parsed = CreateInspectionSchema.safeParse(raw);
  if (!parsed.success) redirect(`/properties/${propertyId}/inspections/new?error=invalid`);

  const property = await prisma.property.findFirst({
    where: { id: propertyId, orgId: session.user.orgId },
    select: { id: true },
  });
  if (!property) redirect("/properties");

  const performedAt = new Date(parsed.data.performedAt);
  if (Number.isNaN(performedAt.getTime())) {
    redirect(`/properties/${propertyId}/inspections/new?error=invalid`);
  }

  const inspection = await prisma.inspection.create({
    data: {
      propertyId,
      performedAt,
      inspectorName: parsed.data.inspectorName,
      summary: parsed.data.summary,
    },
  });

  await prisma.auditEvent.create({
    data: {
      orgId: session.user.orgId,
      userId: session.user.id,
      actorType: "USER",
      eventType: "INSPECTION_RECORDED",
      resourceType: "inspection",
      resourceId: inspection.id,
      metadata: { propertyId, performedAt: inspection.performedAt.toISOString() },
    },
  });

  redirect(`/properties/${propertyId}`);
}

