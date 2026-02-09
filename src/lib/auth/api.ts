import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth/session";

export async function ensureApiSession() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Authentication required." },
      { status: 401 },
    );
  }

  return null;
}
