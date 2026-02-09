import { z } from "zod";

export const CreatePropertySchema = z.object({
  displayName: z.string().min(2).max(160),
  address1: z.string().min(2).max(200),
  address2: z.string().max(200).optional().or(z.literal("")),
  city: z.string().min(2).max(120),
  region: z.string().min(2).max(80),
  postalCode: z.string().min(2).max(20),
  country: z.string().min(2).max(2).default("US"),
});

