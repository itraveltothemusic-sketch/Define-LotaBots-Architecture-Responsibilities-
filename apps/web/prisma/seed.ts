import { PrismaClient, type EvidenceType, type Peril, type Role, type WorkflowStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Seed script for local/dev environments.
 *
 * This intentionally creates a small, coherent dataset that matches the
 * app's demo scenarios and provides real database-backed auth credentials.
 *
 * Run:
 *   DATABASE_URL=... npm --workspace apps/web run db:migrate
 *   npm --workspace apps/web run db:seed
 */

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: { id: "org_demo_equity_builders" },
    update: { name: "Equity Builders (Demo Org)" },
    create: { id: "org_demo_equity_builders", name: "Equity Builders (Demo Org)" },
  });

  const passwordHash = await bcrypt.hash("password", 12);

  const users: Array<{ id: string; email: string; name: string; role: Role }> = [
    { id: "demo_owner_001", email: "owner@equitybuilders.demo", name: "Demo Owner", role: "OWNER" },
    { id: "demo_contractor_001", email: "contractor@equitybuilders.demo", name: "Demo Contractor", role: "CONTRACTOR" },
    { id: "demo_adjuster_001", email: "adjuster@equitybuilders.demo", name: "Demo Adjuster", role: "ADJUSTER" },
    { id: "demo_internal_001", email: "internal@equitybuilders.demo", name: "Demo Internal", role: "INTERNAL" },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, orgId: org.id, passwordHash },
      create: { ...u, orgId: org.id, passwordHash },
    });
  }

  const properties: Array<{
    id: string;
    name: string;
    address: string;
    peril: Peril;
    reportedLossDate: string;
    status: WorkflowStatus;
  }> = [
    {
      id: "prop_aston_ridge",
      name: "Aston Ridge Commerce Park",
      address: "1120 Ridgeview Blvd, Austin, TX",
      peril: "HAIL",
      reportedLossDate: "2025-09-18T00:00:00.000Z",
      status: "INSPECTION",
    },
    {
      id: "prop_lakeview_plaza",
      name: "Lakeview Plaza",
      address: "48 Lakeshore Dr, Orlando, FL",
      peril: "WIND",
      reportedLossDate: "2025-10-02T00:00:00.000Z",
      status: "CLAIM",
    },
    {
      id: "prop_northgate_warehouse",
      name: "Northgate Warehouse",
      address: "7700 Northgate Rd, Denver, CO",
      peril: "HAIL",
      reportedLossDate: "2025-08-11T00:00:00.000Z",
      status: "EXECUTION",
    },
  ];

  for (const p of properties) {
    await prisma.property.upsert({
      where: { id: p.id },
      update: { ...p, orgId: org.id, reportedLossDate: new Date(p.reportedLossDate) },
      create: { ...p, orgId: org.id, reportedLossDate: new Date(p.reportedLossDate) },
    });
  }

  const evidence: Array<{
    id: string;
    propertyId: string;
    createdByEmail: string;
    type: EvidenceType;
    title: string;
    capturedAt: string;
    notes?: string;
    tags: string[];
  }> = [
    {
      id: "ev_001",
      propertyId: "prop_aston_ridge",
      createdByEmail: "contractor@equitybuilders.demo",
      type: "PHOTO",
      title: "Roof overview — north elevation",
      capturedAt: "2025-09-22T15:11:00.000Z",
      notes: "Wide shot. No close-ups of impacts visible from this distance.",
      tags: ["roof", "overview", "context"],
    },
    {
      id: "ev_002",
      propertyId: "prop_aston_ridge",
      createdByEmail: "contractor@equitybuilders.demo",
      type: "PHOTO",
      title: "HVAC fins — suspected hail impacts",
      capturedAt: "2025-09-22T15:17:00.000Z",
      notes: "Impacts visible; needs measurement reference and more angles.",
      tags: ["hvac", "hail", "impacts"],
    },
    {
      id: "ev_003",
      propertyId: "prop_aston_ridge",
      createdByEmail: "internal@equitybuilders.demo",
      type: "DOCUMENT",
      title: "Weather report excerpt (local station)",
      capturedAt: "2025-09-23T10:02:00.000Z",
      tags: ["weather", "loss_date", "support"],
    },
    {
      id: "ev_004",
      propertyId: "prop_aston_ridge",
      createdByEmail: "owner@equitybuilders.demo",
      type: "NOTE",
      title: "Tenant report summary",
      capturedAt: "2025-09-19T18:20:00.000Z",
      notes: "Multiple tenants reported interior leaks within 48 hours of storm.",
      tags: ["intake", "symptoms"],
    },
    {
      id: "ev_lv_001",
      propertyId: "prop_lakeview_plaza",
      createdByEmail: "adjuster@equitybuilders.demo",
      type: "PHOTO",
      title: "Parapet coping displacement",
      capturedAt: "2025-10-05T13:02:00.000Z",
      tags: ["wind", "parapet", "displacement"],
    },
    {
      id: "ev_ng_001",
      propertyId: "prop_northgate_warehouse",
      createdByEmail: "internal@equitybuilders.demo",
      type: "DOCUMENT",
      title: "Carrier estimate (summary)",
      capturedAt: "2025-08-25T16:40:00.000Z",
      tags: ["carrier", "estimate"],
    },
  ];

  const usersByEmail = new Map(
    (await prisma.user.findMany({ where: { orgId: org.id } })).map((u) => [u.email, u]),
  );

  for (const e of evidence) {
    const actor = usersByEmail.get(e.createdByEmail);
    await prisma.evidenceItem.upsert({
      where: { id: e.id },
      update: {
        propertyId: e.propertyId,
        createdById: actor?.id ?? null,
        type: e.type,
        title: e.title,
        notes: e.notes,
        tags: e.tags,
        capturedAt: new Date(e.capturedAt),
      },
      create: {
        id: e.id,
        propertyId: e.propertyId,
        createdById: actor?.id ?? null,
        type: e.type,
        title: e.title,
        notes: e.notes,
        tags: e.tags,
        capturedAt: new Date(e.capturedAt),
      },
    });
  }

  await prisma.auditEvent.create({
    data: {
      orgId: org.id,
      actorUserId: usersByEmail.get("internal@equitybuilders.demo")?.id ?? null,
      action: "SEED_COMPLETED",
      entityType: "SYSTEM",
      metadata: { properties: properties.length, evidence: evidence.length, users: users.length },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

