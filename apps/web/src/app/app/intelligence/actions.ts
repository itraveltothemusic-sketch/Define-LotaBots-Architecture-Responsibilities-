"use server";

import { z } from "zod";
import { generateAtosGuidance } from "@/server/atos/engine";
import { getPropertyCase } from "@/server/demo/property-cases";

const AskSchema = z.object({
  propertyId: z.string().min(1),
  question: z.string().min(1).max(500),
});

export type AskAtosState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ok"; guidance: ReturnType<typeof generateAtosGuidance> };

export async function askAtosAction(
  _prev: AskAtosState,
  formData: FormData,
): Promise<AskAtosState> {
  const parsed = AskSchema.safeParse({
    propertyId: formData.get("propertyId"),
    question: formData.get("question"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Invalid input." };
  }

  const caseData = getPropertyCase(parsed.data.propertyId);
  if (!caseData) {
    return { status: "error", message: "Unknown property case." };
  }

  const guidance = generateAtosGuidance({
    caseData,
    question: parsed.data.question,
  });

  return { status: "ok", guidance };
}

