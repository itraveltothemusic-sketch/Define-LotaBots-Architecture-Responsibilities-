import { NextResponse } from "next/server";
import { clearSessionOnResponse } from "@/lib/auth/session";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  clearSessionOnResponse(response);
  return response;
}
