import { NextResponse } from "next/server";
import { z } from "zod";

import { getSession } from "@/lib/auth/session";
import { generateAtosGuidance } from "@/lib/atos";
import { getRoleScopedSnapshot } from "@/server/repositories/platform-repository";

const contextSchema = z.enum(["intelligence", "forensic", "insurance", "execution", "equity"]);

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parseResult = contextSchema.safeParse(searchParams.get("context"));
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid context. Use intelligence, forensic, insurance, execution, or equity." },
      { status: 400 },
    );
  }

  const snapshot = await getRoleScopedSnapshot(session.role);
  const guidance = generateAtosGuidance(parseResult.data, snapshot);

  return NextResponse.json({ guidance }, { status: 200 });
}
