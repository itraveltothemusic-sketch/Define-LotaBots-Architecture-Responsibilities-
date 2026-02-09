import { z } from "zod";

export const CreateInspectionSchema = z.object({
  performedAt: z.string().min(1),
  inspectorName: z.string().min(2).max(120),
  summary: z.string().min(10).max(4000),
});

