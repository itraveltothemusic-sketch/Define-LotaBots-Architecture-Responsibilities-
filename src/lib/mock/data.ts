import type {
  CarrierInteraction,
  ClaimLifecycle,
  ComplianceRecord,
  ContractorProfile,
  DamageClassification,
  EquityOutcome,
  EvidenceItem,
  InspectionRecord,
  ProgressVerification,
  PropertyProfile,
  ScopeAssignment,
  ScopeDiscrepancy,
} from "@/types/domain";

export const propertyProfiles: PropertyProfile[] = [
  {
    id: "prop-atl-001",
    name: "Cedar Point Commerce Center",
    address: "1610 Howell Mill Rd NW, Atlanta, GA",
    assetType: "Mixed Use",
    stormDate: "2025-09-18T18:00:00.000Z",
    occupancyRate: 0.91,
    insuredValueUsd: 18400000,
    valuationBeforeUsd: 20250000,
    valuationAfterUsd: 22870000,
    forensicConfidenceScore: 0.94,
  },
  {
    id: "prop-hou-002",
    name: "Bayline Industrial Campus",
    address: "4125 Bay Area Blvd, Houston, TX",
    assetType: "Industrial",
    stormDate: "2025-10-03T13:10:00.000Z",
    occupancyRate: 0.86,
    insuredValueUsd: 13650000,
    valuationBeforeUsd: 15100000,
    valuationAfterUsd: 16420000,
    forensicConfidenceScore: 0.9,
  },
];

export const inspectionRecords: InspectionRecord[] = [
  {
    id: "insp-101",
    propertyId: "prop-atl-001",
    inspectionDate: "2025-09-20T09:45:00.000Z",
    inspector: "Maya Ortiz, P.E.",
    weatherEvent: "Hail + Wind Gusts",
    roofDamagePct: 0.41,
    envelopeDamagePct: 0.26,
    interiorDamagePct: 0.13,
    recommendedAction:
      "Initiate full membrane replacement analysis and immediate moisture mitigation.",
    chainOfCustodyVerified: true,
  },
  {
    id: "insp-102",
    propertyId: "prop-atl-001",
    inspectionDate: "2025-09-24T14:10:00.000Z",
    inspector: "Kellan Price, Forensic Analyst",
    weatherEvent: "Secondary Water Intrusion",
    roofDamagePct: 0.47,
    envelopeDamagePct: 0.28,
    interiorDamagePct: 0.19,
    recommendedAction:
      "Escalate claim scope with interior systems remediation and mold-prevention controls.",
    chainOfCustodyVerified: true,
  },
  {
    id: "insp-201",
    propertyId: "prop-hou-002",
    inspectionDate: "2025-10-06T10:05:00.000Z",
    inspector: "Riley Campos, P.E.",
    weatherEvent: "Convective Wind + Heavy Rain",
    roofDamagePct: 0.32,
    envelopeDamagePct: 0.22,
    interiorDamagePct: 0.08,
    recommendedAction:
      "Prioritize roof seam repairs and loading dock drainage corrections.",
    chainOfCustodyVerified: false,
  },
];

export const evidenceItems: EvidenceItem[] = [
  {
    id: "ev-501",
    propertyId: "prop-atl-001",
    capturedAt: "2025-09-20T10:12:00.000Z",
    capturedBy: "Maya Ortiz, P.E.",
    type: "photo",
    title: "Roof uplift panels - sector B",
    fileCount: 38,
    integrityHash: "sha256:4f1ae8f5f1f8e9202d76a8848b2e9a851adf84fca350",
    verificationStatus: "Verified",
  },
  {
    id: "ev-502",
    propertyId: "prop-atl-001",
    capturedAt: "2025-09-20T12:08:00.000Z",
    capturedBy: "Maya Ortiz, P.E.",
    type: "video",
    title: "Thermal moisture scan walkthrough",
    fileCount: 7,
    integrityHash: "sha256:a9a53d46e3322f1f72bfccf4a2639c213777e7f2f0c2",
    verificationStatus: "Verified",
  },
  {
    id: "ev-503",
    propertyId: "prop-atl-001",
    capturedAt: "2025-09-23T16:30:00.000Z",
    capturedBy: "Claims Ops Desk",
    type: "document",
    title: "Carrier initial scope PDF",
    fileCount: 1,
    integrityHash: "sha256:18b1d4878b0c67520cfb8566de577f3d91f85af204fa",
    verificationStatus: "Pending",
  },
  {
    id: "ev-504",
    propertyId: "prop-atl-001",
    capturedAt: "2025-09-25T09:02:00.000Z",
    capturedBy: "Kellan Price",
    type: "report",
    title: "Forensic causation report v2",
    fileCount: 1,
    integrityHash: "sha256:3f2d4c34b0eb4706d95071d6fbf4761ed2c9153147dc",
    verificationStatus: "Verified",
  },
  {
    id: "ev-601",
    propertyId: "prop-hou-002",
    capturedAt: "2025-10-06T15:45:00.000Z",
    capturedBy: "Riley Campos, P.E.",
    type: "photo",
    title: "Dock canopy deformation images",
    fileCount: 19,
    integrityHash: "sha256:b9f6ad16445f60513e8f7a3f3203d4d1224f8fd929f4",
    verificationStatus: "Flagged",
  },
];

export const damageClassifications: DamageClassification[] = [
  {
    id: "dmg-01",
    propertyId: "prop-atl-001",
    component: "Roof membrane and flashing",
    severity: "critical",
    estimatedRepairUsd: 1120000,
    confidenceScore: 0.95,
    rationale:
      "Patterned puncture clusters and uplift vectors match hail impact and uplift event signatures.",
  },
  {
    id: "dmg-02",
    propertyId: "prop-atl-001",
    component: "Interior insulation / drywall",
    severity: "high",
    estimatedRepairUsd: 340000,
    confidenceScore: 0.9,
    rationale:
      "Moisture mapping indicates spread beyond carrier-defined boundary conditions.",
  },
  {
    id: "dmg-03",
    propertyId: "prop-hou-002",
    component: "Dock canopies",
    severity: "medium",
    estimatedRepairUsd: 185000,
    confidenceScore: 0.83,
    rationale:
      "Wind-borne impact marks observed; causation package needs chain-of-custody strengthening.",
  },
];

export const claimLifecycles: ClaimLifecycle[] = [
  {
    id: "clm-1001",
    propertyId: "prop-atl-001",
    claimNumber: "CR-ATL-55293",
    carrier: "North Meridian Specialty",
    stage: "Negotiation",
    reserveUsd: 1620000,
    submittedScopeUsd: 2215000,
    carrierScopeUsd: 1560000,
    payoutUsd: 1420000,
    lastUpdatedAt: "2025-09-27T17:22:00.000Z",
  },
  {
    id: "clm-1002",
    propertyId: "prop-hou-002",
    claimNumber: "CR-HOU-19114",
    carrier: "West Basin Commercial",
    stage: "Carrier Review",
    reserveUsd: 940000,
    submittedScopeUsd: 1185000,
    carrierScopeUsd: 0,
    payoutUsd: 0,
    lastUpdatedAt: "2025-10-08T11:05:00.000Z",
  },
];

export const carrierInteractions: CarrierInteraction[] = [
  {
    id: "car-01",
    claimId: "clm-1001",
    interactionAt: "2025-09-26T09:30:00.000Z",
    channel: "Meeting",
    owner: "Alyssa Tran",
    summary:
      "Carrier requested annotated causation overlays for roof quadrants C/D.",
    responseDueAt: "2025-09-29T21:00:00.000Z",
    status: "Awaiting Carrier",
  },
  {
    id: "car-02",
    claimId: "clm-1001",
    interactionAt: "2025-09-27T14:00:00.000Z",
    channel: "Portal",
    owner: "Alyssa Tran",
    summary:
      "Submitted revised moisture spread model and interior restoration line item support.",
    responseDueAt: "2025-10-01T18:00:00.000Z",
    status: "Open",
  },
  {
    id: "car-03",
    claimId: "clm-1002",
    interactionAt: "2025-10-08T09:12:00.000Z",
    channel: "Email",
    owner: "Micah Holt",
    summary:
      "Carrier flagged missing timestamp metadata for 6 evidence files; requested corrected package.",
    responseDueAt: "2025-10-10T18:00:00.000Z",
    status: "Open",
  },
];

export const scopeDiscrepancies: ScopeDiscrepancy[] = [
  {
    id: "sd-11",
    claimId: "clm-1001",
    lineItem: "Roof membrane full replacement",
    submittedUsd: 1025000,
    carrierUsd: 690000,
    deltaUsd: 335000,
    rationaleGap: "Carrier applied patch-only assumption not aligned to uplift map.",
    severity: "critical",
  },
  {
    id: "sd-12",
    claimId: "clm-1001",
    lineItem: "Interior moisture mitigation",
    submittedUsd: 215000,
    carrierUsd: 112000,
    deltaUsd: 103000,
    rationaleGap: "Dry-out duration underestimated versus measured humidity index.",
    severity: "high",
  },
  {
    id: "sd-21",
    claimId: "clm-1002",
    lineItem: "Dock canopy steel replacement",
    submittedUsd: 245000,
    carrierUsd: 0,
    deltaUsd: 245000,
    rationaleGap: "Carrier review not yet complete pending evidence metadata correction.",
    severity: "medium",
  },
];

export const contractorProfiles: ContractorProfile[] = [
  {
    id: "ctr-77",
    companyName: "Summit Envelope Group",
    specialty: "Commercial Roofing",
    status: "Onboarded",
    complianceScore: 0.98,
    activeAssignments: 2,
  },
  {
    id: "ctr-88",
    companyName: "Delta Restoration Partners",
    specialty: "Interior Remediation",
    status: "Vetted",
    complianceScore: 0.91,
    activeAssignments: 1,
  },
  {
    id: "ctr-99",
    companyName: "Harbor Structural Works",
    specialty: "Steel and Exterior",
    status: "Invited",
    complianceScore: 0.84,
    activeAssignments: 0,
  },
];

export const scopeAssignments: ScopeAssignment[] = [
  {
    id: "asn-301",
    propertyId: "prop-atl-001",
    contractorId: "ctr-77",
    scopeName: "Roof membrane replacement",
    status: "Active",
    targetCompletionDate: "2025-11-14T00:00:00.000Z",
    verifiedProgressPct: 0.37,
  },
  {
    id: "asn-302",
    propertyId: "prop-atl-001",
    contractorId: "ctr-88",
    scopeName: "Interior moisture remediation",
    status: "Queued",
    targetCompletionDate: "2025-11-03T00:00:00.000Z",
    verifiedProgressPct: 0.08,
  },
  {
    id: "asn-303",
    propertyId: "prop-hou-002",
    contractorId: "ctr-99",
    scopeName: "Dock canopy replacement",
    status: "Blocked",
    targetCompletionDate: "2025-11-28T00:00:00.000Z",
    verifiedProgressPct: 0.04,
  },
];

export const progressVerifications: ProgressVerification[] = [
  {
    id: "pv-1",
    assignmentId: "asn-301",
    checkedAt: "2025-10-02T18:40:00.000Z",
    checkedBy: "Internal QA - R. Walker",
    completionPct: 0.37,
    evidenceLinkCount: 23,
    qualityRisk: "low",
  },
  {
    id: "pv-2",
    assignmentId: "asn-302",
    checkedAt: "2025-10-02T18:55:00.000Z",
    checkedBy: "Internal QA - R. Walker",
    completionPct: 0.08,
    evidenceLinkCount: 4,
    qualityRisk: "medium",
  },
  {
    id: "pv-3",
    assignmentId: "asn-303",
    checkedAt: "2025-10-09T12:05:00.000Z",
    checkedBy: "Internal QA - J. Leone",
    completionPct: 0.04,
    evidenceLinkCount: 2,
    qualityRisk: "high",
  },
];

export const complianceRecords: ComplianceRecord[] = [
  {
    id: "cmp-1",
    contractorId: "ctr-77",
    category: "Insurance COI",
    expiresAt: "2026-01-12T00:00:00.000Z",
    status: "Valid",
  },
  {
    id: "cmp-2",
    contractorId: "ctr-88",
    category: "OSHA 30 Certification",
    expiresAt: "2025-10-30T00:00:00.000Z",
    status: "Expiring Soon",
  },
  {
    id: "cmp-3",
    contractorId: "ctr-99",
    category: "W-9 + Tax Packet",
    expiresAt: "2025-08-15T00:00:00.000Z",
    status: "Expired",
  },
];

export const equityOutcomes: EquityOutcome[] = [
  {
    id: "eq-1",
    propertyId: "prop-atl-001",
    valuationBeforeUsd: 20250000,
    valuationAfterUsd: 22870000,
    claimSubmittedUsd: 2215000,
    payoutReceivedUsd: 1420000,
    recoveryEfficiencyPct: 0.64,
    equityGainUsd: 2620000,
    narrative:
      "Roof and envelope remediation unlocked occupancy stabilization and restored tenant confidence.",
  },
  {
    id: "eq-2",
    propertyId: "prop-hou-002",
    valuationBeforeUsd: 15100000,
    valuationAfterUsd: 16420000,
    claimSubmittedUsd: 1185000,
    payoutReceivedUsd: 0,
    recoveryEfficiencyPct: 0,
    equityGainUsd: 1320000,
    narrative:
      "Value improvement potential is strong, but payout capture remains at risk pending evidence correction.",
  },
];
