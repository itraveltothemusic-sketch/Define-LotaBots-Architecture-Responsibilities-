import "server-only";

import type { Role } from "@prisma/client";
import { EvidenceType, VerificationStatus } from "@prisma/client";

import { getDb } from "@/server/db";
import type { IntelligenceSnapshot } from "@/modules/intelligence-center/types";

function stubSnapshot(): IntelligenceSnapshot {
  // This stub is intentionally conservative: it provides structure without claiming real-world facts.
  // ATOS will mark guidance as "derived from stub data" via snapshot.mode.
  return {
    mode: "stub",
    property: {
      id: "stub-property",
      displayName: "Example Property (stub)",
      addressLine1: null,
      city: null,
      region: null,
      postalCode: null,
    },
    evidence: [
      {
        id: "stub-evidence-1",
        type: EvidenceType.NOTE,
        title: "Stub intake note",
        description:
          "This is non-authoritative stub data shown because DATABASE_URL is not configured.",
        verificationStatus: VerificationStatus.UNVERIFIED,
        capturedAt: null,
        createdAt: new Date(),
      },
    ],
  };
}

export async function getIntelligenceSnapshot(input: {
  userId: string;
  role: Role;
}): Promise<IntelligenceSnapshot> {
  const db = getDb();
  if (!db) return stubSnapshot();

  const property =
    input.role === "OWNER"
      ? await db.property.findFirst({
          where: { ownerId: input.userId },
          orderBy: { createdAt: "desc" },
        })
      : await db.property.findFirst({
          orderBy: { createdAt: "desc" },
        });

  if (!property) {
    return { mode: "live", property: null, evidence: [] };
  }

  const evidence = await db.evidenceItem.findMany({
    where: { propertyId: property.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return {
    mode: "live",
    property: {
      id: property.id,
      displayName: property.displayName,
      addressLine1: property.addressLine1,
      city: property.city,
      region: property.region,
      postalCode: property.postalCode,
    },
    evidence: evidence.map((e) => ({
      id: e.id,
      type: e.type,
      title: e.title,
      description: e.description,
      verificationStatus: e.verificationStatus,
      capturedAt: e.capturedAt,
      createdAt: e.createdAt,
    })),
  };
}

