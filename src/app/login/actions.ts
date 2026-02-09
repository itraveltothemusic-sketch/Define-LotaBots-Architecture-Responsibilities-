"use server";

import { redirect } from "next/navigation";

import { isUserRole, writeSession } from "@/lib/auth/session";

export async function authenticateAction(formData: FormData) {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();

  if (!displayName || !isUserRole(role)) {
    redirect("/login?error=invalid-credentials");
  }

  await writeSession({ displayName, role });
  redirect("/dashboard/intelligence");
}
