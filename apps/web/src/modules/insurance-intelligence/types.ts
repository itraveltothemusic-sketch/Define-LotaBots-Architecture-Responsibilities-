import type { ClaimStatus, InteractionChannel } from "@prisma/client";

export type ClaimSummary = {
  id: string;
  propertyId: string;
  propertyDisplayName: string;
  carrierName: string;
  claimNumber?: string | null;
  status: ClaimStatus;
  updatedAt: Date;
  interactionCount: number;
};

export type ClaimListSnapshot = {
  mode: "live" | "stub";
  claims: ClaimSummary[];
};

export type CarrierInteractionItem = {
  id: string;
  occurredAt: Date;
  channel: InteractionChannel;
  summary: string;
  createdAt: Date;
};

export type ClaimDetailSnapshot = {
  mode: "live" | "stub";
  claim: (ClaimSummary & { interactions: CarrierInteractionItem[] }) | null;
};

