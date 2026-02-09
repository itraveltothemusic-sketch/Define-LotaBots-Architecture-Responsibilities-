export type PropertySummary = {
  id: string;
  displayName: string;
  city?: string | null;
  region?: string | null;
  createdAt: Date;
  evidenceCount: number;
};

export type PropertyListSnapshot = {
  mode: "live" | "stub";
  properties: PropertySummary[];
};

