"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/server/auth/require-user";
import { getDb } from "@/server/db";
import { canAccessModule } from "@/server/auth/rbac";

const createClaimSchema = z.object({
  propertyId: z.string().min(1),
  carrierName: z.string().min(2).max(160),
  claimNumber: z.string().max(80).optional(),
  lossDate: z.string().optional(), // HTML date input => string
});

const addInteractionSchema = z.object({
  occurredAt: z.string().optional(),
  channel: z.enum(["EMAIL", "PHONE", "IN_PERSON", "PORTAL", "LETTER", "OTHER"]),
  summary: z.string().min(5).max(5000),
});

export async function createClaimAction(formData: FormData) {
  const session = await requireUser();
  if (!canAccessModule(session.user.role, "insurance")) redirect("/unauthorized");

  // Phase 1: Owners + Internal can create claims. Adjusters are read-only until assignment flows exist.
  const canCreate = session.user.role === "OWNER" || session.user.role === "INTERNAL";
  if (!canCreate) throw new Error("You do not have permission to create claims.");

  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not configured.");

  const parsed = createClaimSchema.safeParse({
    propertyId: String(formData.get("propertyId") ?? ""),
    carrierName: String(formData.get("carrierName") ?? ""),
    claimNumber: String(formData.get("claimNumber") ?? "").trim() || undefined,
    lossDate: String(formData.get("lossDate") ?? "").trim() || undefined,
  });
  if (!parsed.success) throw new Error("Invalid claim details.");

  const property = await db.property.findUnique({
    where: { id: parsed.data.propertyId },
    select: { id: true, ownerId: true },
  });
  if (!property) throw new Error("Property not found.");

  if (session.user.role === "OWNER" && property.ownerId && property.ownerId !== session.user.id) {
    throw new Error("You do not have permission to create a claim for this property.");
  }

  const lossDate = parsed.data.lossDate ? new Date(parsed.data.lossDate) : null;

  const claim = await db.claim.create({
    data: {
      propertyId: property.id,
      carrierName: parsed.data.carrierName,
      claimNumber: parsed.data.claimNumber,
      lossDate,
    },
    select: { id: true },
  });

  revalidatePath("/dashboard/claims");
  redirect(`/dashboard/claims/${claim.id}`);
}

export async function addCarrierInteractionAction(claimId: string, formData: FormData) {
  const session = await requireUser();
  if (!canAccessModule(session.user.role, "insurance")) redirect("/unauthorized");

  // Phase 1: Internal + Adjuster can add interactions (carrier-facing work).
  const canWrite = session.user.role === "INTERNAL" || session.user.role === "ADJUSTER";
  if (!canWrite) throw new Error("You do not have permission to add carrier interactions.");

  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not configured.");

  const parsed = addInteractionSchema.safeParse({
    occurredAt: String(formData.get("occurredAt") ?? "").trim() || undefined,
    channel: String(formData.get("channel") ?? "EMAIL"),
    summary: String(formData.get("summary") ?? ""),
  });
  if (!parsed.success) throw new Error("Invalid interaction details.");

  const claim = await db.claim.findUnique({
    where: { id: claimId },
    include: { property: { select: { ownerId: true } } },
  });
  if (!claim) throw new Error("Claim not found.");

  if (session.user.role === "OWNER") {
    // Owners are read-only for interactions in phase 1 (to preserve carrier comms integrity).
    throw new Error("Owners cannot add carrier interactions at this time.");
  }

  const occurredAt = parsed.data.occurredAt ? new Date(parsed.data.occurredAt) : new Date();

  await db.carrierInteraction.create({
    data: {
      claimId: claim.id,
      occurredAt,
      channel: parsed.data.channel,
      summary: parsed.data.summary,
      createdByUserId: session.user.id,
    },
  });

  revalidatePath(`/dashboard/claims/${claimId}`);
}

