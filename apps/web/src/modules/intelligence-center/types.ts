import type { EvidenceType, VerificationStatus } from "@prisma/client";

export type IntelligenceEvidenceItem = {
  id: string;
  type: EvidenceType;
  title: string;
  description?: string | null;
  verificationStatus: VerificationStatus;
  capturedAt?: Date | null;
  createdAt: Date;
};

export type IntelligenceProperty = {
  id: string;
  displayName: string;
  addressLine1?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
};

export type IntelligenceSnapshot = {
  mode: "live" | "stub";
  property: IntelligenceProperty | null;
  evidence: IntelligenceEvidenceItem[];
};

