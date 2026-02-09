import { z } from "zod";
import { generateAtosGuidance } from "@/server/atos/engine";
import { getPropertyCase } from "@/server/demo/property-cases";

const BodySchema = z.object({
  propertyId: z.string().min(1),
  question: z.string().min(1).max(500).optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const caseData = getPropertyCase(parsed.data.propertyId);
  if (!caseData) {
    return Response.json(
      { ok: false, error: "Unknown property case." },
      { status: 404 },
    );
  }

  const guidance = generateAtosGuidance({
    caseData,
    question: parsed.data.question,
  });

  return Response.json({ ok: true, guidance });
}

