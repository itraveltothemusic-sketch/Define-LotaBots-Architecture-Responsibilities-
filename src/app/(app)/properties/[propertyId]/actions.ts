"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { getSession } from "@/lib/auth/session";
import { canEditProperty } from "@/lib/security/roles";

export async function addEvidenceNote(propertyId: string, formData: FormData) {
  const session = await getSession();
  if (!session?.user || !session.user.orgId) redirect("/sign-in");

  const role = session.user.role;
  if (!role || !canEditProperty(role)) redirect(`/properties/${propertyId}?error=forbidden`);

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!title) redirect(`/properties/${propertyId}?error=invalid`);

  // Ensure property belongs to org boundary.
  const property = await prisma.property.findFirst({
    where: { id: propertyId, orgId: session.user.orgId },
    select: { id: true },
  });
  if (!property) redirect("/properties");

  const evidence = await prisma.evidence.create({
    data: {
      propertyId,
      type: "NOTE",
      title,
      description: description || null,
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
      metadata: { propertyId, type: "NOTE", title },
    },
  });

  redirect(`/properties/${propertyId}`);
}

