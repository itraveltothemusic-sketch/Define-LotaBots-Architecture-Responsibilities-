"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { getSession } from "@/lib/auth/session";
import { canEditProperty } from "@/lib/security/roles";
import { CreatePropertySchema } from "@/lib/validation/property";

export async function createProperty(formData: FormData) {
  const session = await getSession();
  if (!session?.user || !session.user.orgId) redirect("/sign-in");

  const role = session.user.role;
  if (!role || !canEditProperty(role)) redirect("/dashboard?error=forbidden");

  const raw = {
    displayName: String(formData.get("displayName") || ""),
    address1: String(formData.get("address1") || ""),
    address2: String(formData.get("address2") || ""),
    city: String(formData.get("city") || ""),
    region: String(formData.get("region") || ""),
    postalCode: String(formData.get("postalCode") || ""),
    country: String(formData.get("country") || "US"),
  };

  const parsed = CreatePropertySchema.safeParse(raw);
  if (!parsed.success) redirect("/properties/new?error=invalid");

  const property = await prisma.property.create({
    data: {
      orgId: session.user.orgId,
      displayName: parsed.data.displayName,
      address1: parsed.data.address1,
      address2: parsed.data.address2 || null,
      city: parsed.data.city,
      region: parsed.data.region,
      postalCode: parsed.data.postalCode,
      country: parsed.data.country,
    },
  });

  await prisma.auditEvent.create({
    data: {
      orgId: session.user.orgId,
      userId: session.user.id,
      actorType: "USER",
      eventType: "PROPERTY_CREATED",
      resourceType: "property",
      resourceId: property.id,
      metadata: {
        displayName: property.displayName,
        city: property.city,
        region: property.region,
      },
    },
  });

  redirect(`/properties/${property.id}`);
}

