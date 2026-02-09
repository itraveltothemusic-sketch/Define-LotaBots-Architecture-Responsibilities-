import { requireUser } from "@/server/auth/require-user";
import { DashboardShell } from "@/components/shell/dashboard-shell";

export default async function DashboardLayout({
  children,
  atos,
}: {
  children: React.ReactNode;
  atos: React.ReactNode;
}) {
  const session = await requireUser();

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }}
      atosPanel={atos}
    >
      {children}
    </DashboardShell>
  );
}

