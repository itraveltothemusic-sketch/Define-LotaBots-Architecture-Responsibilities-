"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { destroySession, establishSession } from "@/lib/auth/session";
import { ROLE_VALUES } from "@/lib/auth/types";

const loginSchema = z.object({
  fullName: z.string().trim().min(2, "Provide your full name."),
  email: z.string().trim().email("Provide a valid email."),
  role: z.enum(ROLE_VALUES),
});

export async function loginAction(formData: FormData): Promise<void> {
  const parseResult = loginSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parseResult.success) {
    redirect("/login?error=validation");
  }

  const { fullName, email, role } = parseResult.data;
  await establishSession({
    userId: email.toLowerCase(),
    fullName,
    email: email.toLowerCase(),
    role,
  });

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
