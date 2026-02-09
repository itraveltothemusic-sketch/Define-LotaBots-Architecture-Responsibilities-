import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/require-user";
import { AppShell } from "@/components/layout/AppShell";

export default async function AppLayout(props: { children: ReactNode }) {
  const user = await requireUser();
  return <AppShell user={user}>{props.children}</AppShell>;
}

