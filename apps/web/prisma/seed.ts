import {
  PrismaClient,
  Role,
  EvidenceType,
  VerificationStatus,
  ClaimStatus,
  InteractionChannel,
} from "@prisma/client";
import { hashPassword } from "../src/server/security/password";

/**
 * Seed data is intentionally small and forensic-friendly:
 * - One internal user (operator)
 * - One owner user
 * - One property + a few evidence items
 *
 * This provides a working "case file" to validate the Intelligence Center UI.
 */
const prisma = new PrismaClient();

async function main() {
  const internalEmail = "internal@equitybuilders.local";
  const ownerEmail = "owner@equitybuilders.local";

  const internal = await prisma.user.upsert({
    where: { email: internalEmail },
    update: { role: Role.INTERNAL, name: "Equity Builders (Internal)" },
    create: {
      email: internalEmail,
      name: "Equity Builders (Internal)",
      role: Role.INTERNAL,
      passwordHash: await hashPassword("ChangeMeNow!"),
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: { role: Role.OWNER, name: "Property Owner" },
    create: {
      email: ownerEmail,
      name: "Property Owner",
      role: Role.OWNER,
      passwordHash: await hashPassword("ChangeMeNow!"),
    },
  });

  const property = await prisma.property.upsert({
    where: { id: "seed-property-1" },
    update: {},
    create: {
      id: "seed-property-1",
      displayName: "Cedar Ridge Commerce Center",
      addressLine1: "1200 Cedar Ridge Pkwy",
      city: "Austin",
      region: "TX",
      postalCode: "78701",
      country: "US",
      ownerId: owner.id,
      evidence: {
        create: [
          {
            type: EvidenceType.NOTE,
            title: "Initial intake summary",
            description:
              "Reported hail impact across membrane roof sections; tenant notes active leaks near loading bay. No contractor scope uploaded yet.",
            verificationStatus: VerificationStatus.UNVERIFIED,
            createdByUserId: internal.id,
          },
          {
            type: EvidenceType.DOCUMENT,
            title: "Carrier correspondence (placeholder ref)",
            description:
              "Attach carrier email thread and any reservation-of-rights letters once received.",
            uri: null,
            verificationStatus: VerificationStatus.UNVERIFIED,
            createdByUserId: internal.id,
          },
        ],
      },
    },
  });

  await prisma.claim.upsert({
    where: { id: "seed-claim-1" },
    update: { status: ClaimStatus.OPEN },
    create: {
      id: "seed-claim-1",
      propertyId: property.id,
      carrierName: "Example Carrier (seed)",
      claimNumber: "CLM-0000001",
      status: ClaimStatus.OPEN,
      lossDate: new Date(),
      interactions: {
        create: [
          {
            occurredAt: new Date(),
            channel: InteractionChannel.EMAIL,
            summary:
              "Seed interaction: request carrier acknowledgement letter and adjuster estimate; capture all attachments for scope comparison.",
            createdByUserId: internal.id,
          },
        ],
      },
    },
  });

  console.log("Seed complete:", {
    internalUserId: internal.id,
    ownerUserId: owner.id,
    propertyId: property.id,
    claimId: "seed-claim-1",
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

