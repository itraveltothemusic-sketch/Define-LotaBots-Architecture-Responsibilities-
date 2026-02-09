"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma";
import { SignUpSchema } from "@/lib/validation/auth";
import { hashPassword } from "@/lib/security/password";

export async function createAccount(formData: FormData) {
  const raw = {
    email: String(formData.get("email") || ""),
    name: String(formData.get("name") || ""),
    organizationName: String(formData.get("organizationName") || ""),
    password: String(formData.get("password") || ""),
  };

  const parsed = SignUpSchema.safeParse(raw);
  if (!parsed.success) {
    // Minimal error handling for now; UI upgrades will provide field-level feedback.
    redirect("/sign-up?error=invalid");
  }

  const email = parsed.data.email.toLowerCase();
  const passwordHash = await hashPassword(parsed.data.password);

  try {
    const { user } = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name: parsed.data.organizationName },
      });

      const user = await tx.user.create({
        data: {
          email,
          name: parsed.data.name,
          passwordHash,
          memberships: { create: { orgId: org.id, role: "OWNER" } },
        },
      });

      await tx.auditEvent.create({
        data: {
          orgId: org.id,
          userId: user.id,
          actorType: "USER",
          eventType: "AUTH_SIGNUP",
          resourceType: "user",
          resourceId: email,
          metadata: { orgName: org.name },
        },
      });

      return { user };
    });

    // Redirect to sign-in with prefilled email. We do not auto-login on purpose:
    // it keeps the auth boundary explicit and makes audit trails clearer.
    redirect(`/sign-in?email=${encodeURIComponent(user.email)}`);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      redirect("/sign-up?error=exists");
    }
    redirect("/sign-up?error=unknown");
  }

}

