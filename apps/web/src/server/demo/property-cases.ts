import type { Role } from "@/lib/auth/types";

export type EvidenceType = "PHOTO" | "VIDEO" | "DOCUMENT" | "MEASUREMENT" | "NOTE";

export type EvidenceItem = {
  id: string;
  type: EvidenceType;
  title: string;
  capturedAt: string; // ISO
  capturedBy: { name: string; role: Role };
  notes?: string;
  tags: string[];
};

export type PropertyCase = {
  id: string;
  name: string;
  address: string;
  event: {
    peril: "HAIL" | "WIND" | "HURRICANE";
    reportedLossDate: string; // ISO
  };
  status: "INTAKE" | "INSPECTION" | "CLAIM" | "EXECUTION" | "OUTCOME";
  facts: Array<{ id: string; label: string; value: string; sourceEvidenceId?: string }>;
  evidence: EvidenceItem[];
};

const CASES: readonly PropertyCase[] = [
  {
    id: "prop_aston_ridge",
    name: "Aston Ridge Commerce Park",
    address: "1120 Ridgeview Blvd, Austin, TX",
    event: { peril: "HAIL", reportedLossDate: "2025-09-18T00:00:00.000Z" },
    status: "INSPECTION",
    facts: [
      {
        id: "fact_roof_type",
        label: "Roof system",
        value: "TPO membrane (approx.)",
      },
      {
        id: "fact_stories",
        label: "Building profile",
        value: "Single-story, multi-tenant light industrial",
      },
      {
        id: "fact_access",
        label: "Roof access",
        value: "Exterior ladder access on north elevation",
      },
    ],
    evidence: [
      {
        id: "ev_001",
        type: "PHOTO",
        title: "Roof overview — north elevation",
        capturedAt: "2025-09-22T15:11:00.000Z",
        capturedBy: { name: "Demo Contractor", role: "CONTRACTOR" },
        tags: ["roof", "overview", "context"],
        notes:
          "Wide shot. No close-ups of impacts visible from this distance.",
      },
      {
        id: "ev_002",
        type: "PHOTO",
        title: "HVAC fins — suspected hail impacts",
        capturedAt: "2025-09-22T15:17:00.000Z",
        capturedBy: { name: "Demo Contractor", role: "CONTRACTOR" },
        tags: ["hvac", "hail", "impacts"],
        notes:
          "Impacts visible; needs measurement reference and more angles.",
      },
      {
        id: "ev_003",
        type: "DOCUMENT",
        title: "Weather report excerpt (local station)",
        capturedAt: "2025-09-23T10:02:00.000Z",
        capturedBy: { name: "Demo Internal", role: "INTERNAL" },
        tags: ["weather", "loss_date", "support"],
      },
      {
        id: "ev_004",
        type: "NOTE",
        title: "Tenant report summary",
        capturedAt: "2025-09-19T18:20:00.000Z",
        capturedBy: { name: "Demo Owner", role: "OWNER" },
        tags: ["intake", "symptoms"],
        notes:
          "Multiple tenants reported interior leaks within 48 hours of storm.",
      },
    ],
  },
  {
    id: "prop_lakeview_plaza",
    name: "Lakeview Plaza",
    address: "48 Lakeshore Dr, Orlando, FL",
    event: { peril: "WIND", reportedLossDate: "2025-10-02T00:00:00.000Z" },
    status: "CLAIM",
    facts: [
      { id: "fact_roof", label: "Roof system", value: "Modified bitumen" },
      { id: "fact_units", label: "Units affected", value: "3 storefront bays" },
    ],
    evidence: [
      {
        id: "ev_lv_001",
        type: "PHOTO",
        title: "Parapet coping displacement",
        capturedAt: "2025-10-05T13:02:00.000Z",
        capturedBy: { name: "Demo Adjuster", role: "ADJUSTER" },
        tags: ["wind", "parapet", "displacement"],
      },
    ],
  },
  {
    id: "prop_northgate_warehouse",
    name: "Northgate Warehouse",
    address: "7700 Northgate Rd, Denver, CO",
    event: { peril: "HAIL", reportedLossDate: "2025-08-11T00:00:00.000Z" },
    status: "EXECUTION",
    facts: [
      {
        id: "fact_scope",
        label: "Approved scope",
        value: "Roof coating + HVAC fin combing",
      },
    ],
    evidence: [
      {
        id: "ev_ng_001",
        type: "DOCUMENT",
        title: "Carrier estimate (summary)",
        capturedAt: "2025-08-25T16:40:00.000Z",
        capturedBy: { name: "Demo Internal", role: "INTERNAL" },
        tags: ["carrier", "estimate"],
      },
    ],
  },
] as const;

export function listPropertyCases(): PropertyCase[] {
  return [...CASES];
}

export function getPropertyCase(propertyId: string): PropertyCase | null {
  return CASES.find((c) => c.id === propertyId) ?? null;
}

