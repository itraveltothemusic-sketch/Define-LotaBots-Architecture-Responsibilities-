import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeModule, answerQuestion } from "@/lib/atos/engine";
import { getSessionUser } from "@/lib/auth/session";
import { getAtosModuleContext } from "@/lib/data/repository";
import { atosModules } from "@/types/domain";

const requestSchema = z.object({
  module: z.enum(atosModules),
  question: z.string().trim().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized request. Sign in to access ATOS." },
        { status: 401 },
      );
    }

    const raw = await request.json();
    const payload = requestSchema.parse(raw);
    const moduleData = await getAtosModuleContext(payload.module);
    const analysis = analyzeModule(payload.module, moduleData);

    const questionResponse =
      payload.question && payload.question.length > 0
        ? answerQuestion(payload.module, payload.question, analysis)
        : null;

    return NextResponse.json({
      module: payload.module,
      summary: analysis.summary,
      guidance: analysis.guidance,
      questionResponse,
      guardrail: "ATOS answers are derived only from current platform records.",
    });
  } catch {
    return NextResponse.json(
      {
        error: "Invalid ATOS request payload.",
      },
      { status: 400 },
    );
  }
}
