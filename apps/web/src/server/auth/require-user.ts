import "server-only";

import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";

/**
 * Enforces an authenticated session for server-rendered routes.
 * Redirects to `/sign-in` if not authenticated.
 */
export async function requireUser() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");
  return session;
}

