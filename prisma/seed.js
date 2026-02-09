/* eslint-disable no-console */
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Seed philosophy:
 * - Deterministic, explicit, and safe for local/dev environments.
 * - Creates an organization + an OWNER user and an INTERNAL user.
 *
 * NOTE: This is not production provisioning. Production will use invites/SO-based flows.
 */
async function main() {
  const orgName = process.env.SEED_ORG_NAME || "Equity Builders (Dev)";

  const ownerEmail = process.env.SEED_OWNER_EMAIL || "owner@equitybuilders.local";
  const ownerName = process.env.SEED_OWNER_NAME || "Dev Owner";
  const ownerPassword =
    process.env.SEED_OWNER_PASSWORD || "ChangeMeNow_123456";

  const internalEmail =
    process.env.SEED_INTERNAL_EMAIL || "internal@equitybuilders.local";
  const internalName = process.env.SEED_INTERNAL_NAME || "Internal Analyst";
  const internalPassword =
    process.env.SEED_INTERNAL_PASSWORD || "ChangeMeNow_123456";

  const ownerHash = await bcrypt.hash(ownerPassword, 12);
  const internalHash = await bcrypt.hash(internalPassword, 12);

  let org = await prisma.organization.findFirst({ where: { name: orgName } });
  if (!org) {
    org = await prisma.organization.create({ data: { name: orgName } });
  }

  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: { name: ownerName, passwordHash: ownerHash },
    create: { email: ownerEmail, name: ownerName, passwordHash: ownerHash },
  });

  const internal = await prisma.user.upsert({
    where: { email: internalEmail },
    update: { name: internalName, passwordHash: internalHash },
    create: {
      email: internalEmail,
      name: internalName,
      passwordHash: internalHash,
    },
  });

  await prisma.membership.upsert({
    where: { orgId_userId: { orgId: org.id, userId: owner.id } },
    update: { role: "OWNER" },
    create: { orgId: org.id, userId: owner.id, role: "OWNER" },
  });

  await prisma.membership.upsert({
    where: { orgId_userId: { orgId: org.id, userId: internal.id } },
    update: { role: "INTERNAL" },
    create: { orgId: org.id, userId: internal.id, role: "INTERNAL" },
  });

  console.log("Seed complete.");
  console.log(`Org: ${org.name} (${org.id})`);
  console.log(`Owner: ${owner.email} / ${ownerPassword}`);
  console.log(`Internal: ${internal.email} / ${internalPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

