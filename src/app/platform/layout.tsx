import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/layout/platform-shell";
import { getSessionUser } from "@/lib/auth/session";

export default async function PlatformLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return <PlatformShell user={user}>{children}</PlatformShell>;
}
