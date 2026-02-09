import "server-only";

import type { Role } from "@prisma/client";
import { getDb } from "@/server/db";
import type { PropertyListSnapshot } from "@/modules/forensic-property/types";

export async function listPropertiesForUser(input: {
  userId: string;
  role: Role;
}): Promise<PropertyListSnapshot> {
  const db = getDb();
  if (!db) {
    return {
      mode: "stub",
      properties: [],
    };
  }

  const where =
    input.role === "OWNER"
      ? { ownerId: input.userId }
      : // Internal/Adjuster/Contractor can see "all" in phase 1; record-level access comes next.
        {};

  const properties = await db.property.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      _count: {
        select: { evidence: true },
      },
    },
  });

  return {
    mode: "live",
    properties: properties.map((p) => ({
      id: p.id,
      displayName: p.displayName,
      city: p.city,
      region: p.region,
      createdAt: p.createdAt,
      evidenceCount: p._count.evidence,
    })),
  };
}

