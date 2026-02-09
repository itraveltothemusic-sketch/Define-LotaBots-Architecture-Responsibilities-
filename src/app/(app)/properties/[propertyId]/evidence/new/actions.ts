"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { getSession } from "@/lib/auth/session";
import { canEditProperty } from "@/lib/security/roles";
import { CreateEvidenceSchema } from "@/lib/validation/evidence";

export async function createEvidence(propertyId: string, formData: FormData) {
  const session = await getSession();
  if (!session?.user || !session.user.orgId) redirect("/sign-in");
  if (!session.user.role || !canEditProperty(session.user.role)) {
    redirect(`/properties/${propertyId}?error=forbidden`);
  }

  const raw = {
    type: String(formData.get("type") || ""),
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    capturedAt: String(formData.get("capturedAt") || ""),
    sourceUrl: String(formData.get("sourceUrl") || ""),
    sha256: String(formData.get("sha256") || ""),
  };

  const parsed = CreateEvidenceSchema.safeParse(raw);
  if (!parsed.success) redirect(`/properties/${propertyId}/evidence/new?error=invalid`);

  const property = await prisma.property.findFirst({
    where: { id: propertyId, orgId: session.user.orgId },
    select: { id: true },
  });
  if (!property) redirect("/properties");

  const capturedAt =
    parsed.data.capturedAt && parsed.data.capturedAt.trim()
      ? new Date(parsed.data.capturedAt)
      : null;
  if (capturedAt && Number.isNaN(capturedAt.getTime())) {
    redirect(`/properties/${propertyId}/evidence/new?error=invalid`);
  }

  const evidence = await prisma.evidence.create({
    data: {
      propertyId,
      type: parsed.data.type,
      title: parsed.data.title,
      description: parsed.data.description?.trim() ? parsed.data.description.trim() : null,
      capturedAt,
      sourceUrl: parsed.data.sourceUrl?.trim() ? parsed.data.sourceUrl.trim() : null,
      sha256: parsed.data.sha256?.trim() ? parsed.data.sha256.trim().toLowerCase() : null,
    },
  });

  await prisma.auditEvent.create({
    data: {
      orgId: session.user.orgId,
      userId: session.user.id,
      actorType: "USER",
      eventType: "EVIDENCE_ADDED",
      resourceType: "evidence",
      resourceId: evidence.id,
      metadata: { propertyId, type: evidence.type, title: evidence.title },
    },
  });

  redirect(`/properties/${propertyId}`);
}

