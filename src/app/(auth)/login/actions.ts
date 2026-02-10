"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createSession } from "@/lib/auth/session";
import { validateUserCredentials } from "@/lib/auth/user-store";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export interface LoginFormState {
  error?: string;
}

export async function loginAction(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid credentials." };
  }

  const user = await validateUserCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    return { error: "Credentials were not recognized. Verify and try again." };
  }

  await createSession(user);
  redirect("/dashboard");
}
