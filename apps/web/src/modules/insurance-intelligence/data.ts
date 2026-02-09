import "server-only";

import type { Role } from "@prisma/client";
import { getDb } from "@/server/db";
import type {
  ClaimDetailSnapshot,
  ClaimListSnapshot,
} from "@/modules/insurance-intelligence/types";

export async function listClaimsForUser(input: {
  userId: string;
  role: Role;
}): Promise<ClaimListSnapshot> {
  const db = getDb();
  if (!db) return { mode: "stub", claims: [] };

  const where =
    input.role === "OWNER"
      ? { property: { ownerId: input.userId } }
      : // Phase 1: Internal/Adjuster can see all; contractor access is handled by module RBAC.
        {};

  const claims = await db.claim.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      property: { select: { id: true, displayName: true } },
      _count: { select: { interactions: true } },
    },
  });

  return {
    mode: "live",
    claims: claims.map((c) => ({
      id: c.id,
      propertyId: c.propertyId,
      propertyDisplayName: c.property.displayName,
      carrierName: c.carrierName,
      claimNumber: c.claimNumber,
      status: c.status,
      updatedAt: c.updatedAt,
      interactionCount: c._count.interactions,
    })),
  };
}

export async function getClaimDetail(input: {
  claimId: string;
  userId: string;
  role: Role;
}): Promise<ClaimDetailSnapshot> {
  const db = getDb();
  if (!db) return { mode: "stub", claim: null };

  const claim = await db.claim.findUnique({
    where: { id: input.claimId },
    include: {
      property: { select: { id: true, displayName: true, ownerId: true } },
      interactions: { orderBy: { occurredAt: "desc" }, take: 200 },
      _count: { select: { interactions: true } },
    },
  });

  if (!claim) return { mode: "live", claim: null };

  // Record-level access (phase 1): owners can only view their own property claims.
  if (input.role === "OWNER" && claim.property.ownerId && claim.property.ownerId !== input.userId) {
    return { mode: "live", claim: null };
  }

  return {
    mode: "live",
    claim: {
      id: claim.id,
      propertyId: claim.propertyId,
      propertyDisplayName: claim.property.displayName,
      carrierName: claim.carrierName,
      claimNumber: claim.claimNumber,
      status: claim.status,
      updatedAt: claim.updatedAt,
      interactionCount: claim._count.interactions,
      interactions: claim.interactions.map((i) => ({
        id: i.id,
        occurredAt: i.occurredAt,
        channel: i.channel,
        summary: i.summary,
        createdAt: i.createdAt,
      })),
    },
  };
}

