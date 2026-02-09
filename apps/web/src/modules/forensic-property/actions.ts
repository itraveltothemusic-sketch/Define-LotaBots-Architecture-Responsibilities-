"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/server/auth/require-user";
import { getDb } from "@/server/db";

const createPropertySchema = z.object({
  displayName: z.string().min(3).max(140),
  addressLine1: z.string().min(3).max(200).optional(),
  city: z.string().min(2).max(120).optional(),
  region: z.string().min(2).max(120).optional(),
  postalCode: z.string().min(3).max(20).optional(),
});

/**
 * Create a property case file.
 *
 * This is the canonical anchor for:
 * - evidence
 * - inspections
 * - claims
 * - execution verification
 * - equity outcome reporting
 */
export async function createPropertyAction(formData: FormData) {
  const session = await requireUser();
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not configured.");

  const parsed = createPropertySchema.safeParse({
    displayName: String(formData.get("displayName") ?? ""),
    addressLine1: String(formData.get("addressLine1") ?? "").trim() || undefined,
    city: String(formData.get("city") ?? "").trim() || undefined,
    region: String(formData.get("region") ?? "").trim() || undefined,
    postalCode: String(formData.get("postalCode") ?? "").trim() || undefined,
  });
  if (!parsed.success) {
    throw new Error("Invalid property details. Please check required fields.");
  }

  const p = await db.property.create({
    data: {
      displayName: parsed.data.displayName,
      addressLine1: parsed.data.addressLine1,
      city: parsed.data.city,
      region: parsed.data.region,
      postalCode: parsed.data.postalCode,
      ownerId: session.user.role === "OWNER" ? session.user.id : null,
    },
    select: { id: true },
  });

  revalidatePath("/dashboard/properties");
  redirect(`/dashboard/properties/${p.id}`);
}

