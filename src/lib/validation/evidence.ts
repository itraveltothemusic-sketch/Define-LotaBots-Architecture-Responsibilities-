import { z } from "zod";

export const EvidenceTypes = ["PHOTO", "VIDEO", "DOCUMENT", "NOTE"] as const;

export const CreateEvidenceSchema = z.object({
  type: z.enum(EvidenceTypes),
  title: z.string().min(2).max(160),
  description: z.string().max(4000).optional().or(z.literal("")),
  capturedAt: z.string().optional().or(z.literal("")),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  sha256: z
    .string()
    .regex(/^[a-fA-F0-9]{64}$/)
    .optional()
    .or(z.literal("")),
});

