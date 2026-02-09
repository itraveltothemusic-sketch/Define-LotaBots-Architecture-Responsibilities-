import { NextResponse } from "next/server";
import { z } from "zod";

import { getSession, destroySession, establishSession } from "@/lib/auth/session";
import { ROLE_VALUES } from "@/lib/auth/types";

const sessionPayloadSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  role: z.enum(ROLE_VALUES),
});

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, session }, { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = sessionPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid session payload." }, { status: 400 });
  }

  await establishSession({
    userId: parsed.data.email.toLowerCase(),
    fullName: parsed.data.fullName,
    email: parsed.data.email.toLowerCase(),
    role: parsed.data.role,
  });

  return NextResponse.json({ authenticated: true }, { status: 201 });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ authenticated: false }, { status: 200 });
}
