import { NextResponse } from "next/server";
import { z } from "zod";

import { generateAtosResponse } from "@/lib/intelligence/atos";

const requestSchema = z.object({
  module: z.enum([
    "intelligence",
    "forensic-property",
    "insurance-intelligence",
    "contractor-execution",
    "equity-outcome",
  ]),
  prompt: z.string().min(1).max(500),
  propertyId: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid ATOS request payload." },
      { status: 400 },
    );
  }

  const response = await generateAtosResponse(parsed.data);
  return NextResponse.json(response);
}
