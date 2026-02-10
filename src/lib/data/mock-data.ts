import type {
  CarrierInteractionLog,
  ClaimRecord,
  ContractorProfile,
  EquityOutcome,
  EvidenceItem,
  ExecutionMilestone,
  InspectionRecord,
  PropertyProfile,
  ScopeDiscrepancy,
} from "@/types/domain";

export const properties: PropertyProfile[] = [
  {
    id: "prop_1001",
    name: "Northpoint Retail Plaza",
    address: "1280 Northpoint Blvd, Orlando, FL",
    occupancyType: "retail",
    stormEvent: "Hurricane Iris (2025-09-18)",
    inspectionStatus: "needs_reinspection",
    confidenceScore: 78,
    lastInspectionAt: "2026-01-29T15:30:00.000Z",
    evidenceCoverage: {
      photos: 132,
      videos: 18,
      documents: 24,
    },
  },
  {
    id: "prop_1002",
    name: "Cypress Exchange Offices",
    address: "662 Cypress Exchange, Tampa, FL",
    occupancyType: "office",
    stormEvent: "Hurricane Iris (2025-09-18)",
    inspectionStatus: "completed",
    confidenceScore: 92,
    lastInspectionAt: "2026-02-03T10:00:00.000Z",
    evidenceCoverage: {
      photos: 210,
      videos: 34,
      documents: 43,
    },
  },
  {
    id: "prop_1003",
    name: "Harborline Industrial Park",
    address: "59 Harborline Dr, St. Petersburg, FL",
    occupancyType: "industrial",
    stormEvent: "Hurricane Iris (2025-09-18)",
    inspectionStatus: "in_progress",
    confidenceScore: 84,
    lastInspectionAt: "2026-02-06T09:25:00.000Z",
    evidenceCoverage: {
      photos: 98,
      videos: 13,
      documents: 19,
    },
  },
];

export const inspections: InspectionRecord[] = [
  {
    id: "ins_2001",
    propertyId: "prop_1001",
    inspector: "Nadia Holt, PE",
    inspectedAt: "2026-01-29T15:30:00.000Z",
    severity: "critical",
    damageClasses: ["wind", "water", "structural"],
    findingsSummary:
      "Primary roof membrane uplift and interior water pathway expansion over Unit C.",
  },
  {
    id: "ins_2002",
    propertyId: "prop_1002",
    inspector: "Mason Price, CMI",
    inspectedAt: "2026-02-03T10:00:00.000Z",
    severity: "high",
    damageClasses: ["hail", "wind"],
    findingsSummary:
      "Impact strikes and seam compromise observed across east roof span and facade flashing.",
  },
  {
    id: "ins_2003",
    propertyId: "prop_1003",
    inspector: "Nadia Holt, PE",
    inspectedAt: "2026-02-06T09:25:00.000Z",
    severity: "high",
    damageClasses: ["wind", "structural"],
    findingsSummary:
      "Dock canopy frame shows torsional displacement requiring engineering signoff before repair.",
  },
  {
    id: "ins_2004",
    propertyId: "prop_1001",
    inspector: "Eli Vasquez, CFM",
    inspectedAt: "2026-02-07T12:10:00.000Z",
    severity: "medium",
    damageClasses: ["water"],
    findingsSummary:
      "Additional moisture mapping captured in retail corridors pending infrared validation.",
  },
];

export const evidenceTimeline: EvidenceItem[] = [
  {
    id: "ev_3001",
    propertyId: "prop_1001",
    occurredAt: "2026-02-07T13:05:00.000Z",
    type: "document",
    title: "Thermal moisture report - Corridor A",
    source: "Field tablet sync",
    verificationStatus: "verified",
  },
  {
    id: "ev_3002",
    propertyId: "prop_1003",
    occurredAt: "2026-02-06T15:20:00.000Z",
    type: "video",
    title: "Canopy displacement walkthrough",
    source: "Drone Operator 12",
    verificationStatus: "pending",
  },
  {
    id: "ev_3003",
    propertyId: "prop_1002",
    occurredAt: "2026-02-05T09:40:00.000Z",
    type: "photo",
    title: "Roof seam puncture sequence",
    source: "Inspection upload batch 44",
    verificationStatus: "verified",
  },
  {
    id: "ev_3004",
    propertyId: "prop_1001",
    occurredAt: "2026-02-03T16:45:00.000Z",
    type: "note",
    title: "Tenant statement on recurring leak",
    source: "Internal claims analyst",
    verificationStatus: "flagged",
  },
];

export const claims: ClaimRecord[] = [
  {
    id: "clm_4001",
    propertyId: "prop_1001",
    carrier: "Beacon Mutual",
    policyNumber: "BM-77-88291",
    status: "scope_dispute",
    reserveEstimate: 1180000,
    payoutAmount: 645000,
    openedAt: "2025-09-21T08:00:00.000Z",
    updatedAt: "2026-02-08T14:10:00.000Z",
  },
  {
    id: "clm_4002",
    propertyId: "prop_1002",
    carrier: "Granite Specialty",
    policyNumber: "GS-55-90122",
    status: "approved",
    reserveEstimate: 910000,
    payoutAmount: 882000,
    openedAt: "2025-09-22T11:30:00.000Z",
    updatedAt: "2026-02-07T17:00:00.000Z",
  },
  {
    id: "clm_4003",
    propertyId: "prop_1003",
    carrier: "Summit Commercial",
    policyNumber: "SC-14-33742",
    status: "under_review",
    reserveEstimate: 1320000,
    payoutAmount: 0,
    openedAt: "2025-09-24T09:15:00.000Z",
    updatedAt: "2026-02-06T12:20:00.000Z",
  },
];

export const carrierInteractions: CarrierInteractionLog[] = [
  {
    id: "car_5001",
    claimId: "clm_4001",
    occurredAt: "2026-02-08T14:00:00.000Z",
    channel: "meeting",
    summary:
      "Carrier requested supplemental engineering packet before expanding structural line items.",
    owner: "Taylor Reed",
  },
  {
    id: "car_5002",
    claimId: "clm_4003",
    occurredAt: "2026-02-06T12:00:00.000Z",
    channel: "portal",
    summary:
      "Carrier acknowledged receipt of initial scope; adjustment review window set to 10 days.",
    owner: "Casey Flynn",
  },
  {
    id: "car_5003",
    claimId: "clm_4002",
    occurredAt: "2026-02-05T10:10:00.000Z",
    channel: "email",
    summary:
      "Carrier approved final scope with depreciation holdback released post completion proof.",
    owner: "Riley Morgan",
  },
];

export const scopeDiscrepancies: ScopeDiscrepancy[] = [
  {
    id: "scp_6001",
    claimId: "clm_4001",
    category: "roof",
    carrierValue: 410000,
    forensicValue: 705000,
    rationale:
      "Carrier omitted full membrane replacement despite uplift exceeding engineering threshold.",
  },
  {
    id: "scp_6002",
    claimId: "clm_4001",
    category: "interior",
    carrierValue: 112000,
    forensicValue: 198000,
    rationale:
      "Moisture remediation line item does not include verified wall cavity treatment.",
  },
  {
    id: "scp_6003",
    claimId: "clm_4003",
    category: "mechanical",
    carrierValue: 228000,
    forensicValue: 341000,
    rationale:
      "Mechanical scope excludes control systems recalibration after surge exposure.",
  },
];

export const contractors: ContractorProfile[] = [
  {
    id: "ctr_7001",
    companyName: "Summit Restoration Group",
    trade: "general",
    onboardingStatus: "approved",
    complianceScore: 97,
    assignedScopeCount: 4,
  },
  {
    id: "ctr_7002",
    companyName: "Falcon Roofing Systems",
    trade: "roofing",
    onboardingStatus: "approved",
    complianceScore: 92,
    assignedScopeCount: 2,
  },
  {
    id: "ctr_7003",
    companyName: "Prime Mechanical Response",
    trade: "mechanical",
    onboardingStatus: "pending",
    complianceScore: 81,
    assignedScopeCount: 1,
  },
];

export const executionMilestones: ExecutionMilestone[] = [
  {
    id: "ms_8001",
    propertyId: "prop_1001",
    contractorId: "ctr_7002",
    title: "Roof membrane replacement section A",
    dueAt: "2026-02-14T18:00:00.000Z",
    status: "in_progress",
  },
  {
    id: "ms_8002",
    propertyId: "prop_1002",
    contractorId: "ctr_7001",
    title: "Facade flashing remediation",
    dueAt: "2026-02-11T18:00:00.000Z",
    verifiedAt: "2026-02-09T14:00:00.000Z",
    status: "verified",
  },
  {
    id: "ms_8003",
    propertyId: "prop_1003",
    contractorId: "ctr_7003",
    title: "Mechanical controls replacement mobilization",
    dueAt: "2026-02-13T18:00:00.000Z",
    status: "blocked",
  },
];

export const equityOutcomes: EquityOutcome[] = [
  {
    id: "eq_9001",
    propertyId: "prop_1001",
    baselineValue: 12100000,
    postRecoveryValue: 13420000,
    claimEstimate: 1180000,
    payoutValue: 645000,
    narrative:
      "Equity lift remains high, but unresolved carrier scope gap creates avoidable capital exposure.",
  },
  {
    id: "eq_9002",
    propertyId: "prop_1002",
    baselineValue: 9800000,
    postRecoveryValue: 10930000,
    claimEstimate: 910000,
    payoutValue: 882000,
    narrative:
      "Strong payout alignment and verified completion generated predictable valuation recovery.",
  },
  {
    id: "eq_9003",
    propertyId: "prop_1003",
    baselineValue: 14600000,
    postRecoveryValue: 15670000,
    claimEstimate: 1320000,
    payoutValue: 0,
    narrative:
      "Potential upside is material, but review-cycle delay is the key threat to conversion.",
  },
];

export const propertyNameById = Object.fromEntries(
  properties.map((property) => [property.id, property.name]),
) as Record<string, string>;

export const claimById = Object.fromEntries(
  claims.map((claim) => [claim.id, claim]),
) as Record<string, ClaimRecord>;
