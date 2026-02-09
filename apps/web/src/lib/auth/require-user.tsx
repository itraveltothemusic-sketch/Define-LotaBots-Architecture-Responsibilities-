import { redirect } from "next/navigation";
import type { Role, SessionUser } from "./types";
import { readSessionUser } from "./session";

export async function requireUser(): Promise<SessionUser> {
  const user = await readSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(allowed: readonly Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!allowed.includes(user.role)) redirect("/app");
  return user;
}

