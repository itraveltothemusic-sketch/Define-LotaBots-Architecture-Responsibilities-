"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/server/auth/require-user";
import { getDb } from "@/server/db";

const addNoteSchema = z.object({
  title: z.string().min(3).max(140),
  description: z.string().min(3).max(2000),
});

export async function addEvidenceNoteAction(propertyId: string, formData: FormData) {
  const session = await requireUser();
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not configured.");

  const parsed = addNoteSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
  });
  if (!parsed.success) {
    throw new Error("Invalid note details.");
  }

  // Record-level access (phase 1):
  // - Owners can only write to their own properties.
  // - Internal can write everywhere.
  // - Contractors/Adjusters are read-only until explicit assignment is implemented.
  const property = await db.property.findUnique({
    where: { id: propertyId },
    select: { id: true, ownerId: true },
  });
  if (!property) throw new Error("Property not found.");

  const isOwner = session.user.role === "OWNER";
  const isInternal = session.user.role === "INTERNAL";

  const canWrite =
    isInternal || (isOwner && property.ownerId && property.ownerId === session.user.id);

  if (!canWrite) throw new Error("You do not have permission to add evidence to this property.");

  await db.evidenceItem.create({
    data: {
      propertyId: property.id,
      type: "NOTE",
      title: parsed.data.title,
      description: parsed.data.description,
      createdByUserId: session.user.id,
    },
  });

  revalidatePath(`/dashboard/properties/${propertyId}`);
}

