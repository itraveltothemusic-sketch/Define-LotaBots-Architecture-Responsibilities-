import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/server/auth/require-user";
import { canAccessModule } from "@/server/auth/rbac";

export default async function ExecutionPage() {
  const session = await requireUser();
  if (!canAccessModule(session.user.role, "execution")) redirect("/unauthorized");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Contractor Execution</CardTitle>
          <CardDescription>
            Contractor onboarding, scope assignment, progress verification, and compliance checkpoints.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="font-medium text-zinc-900 dark:text-zinc-100">What happens here</div>
          <ul className="list-inside list-disc space-y-1">
            <li>Assign scopes to contractors with required evidence artifacts.</li>
            <li>Verify progress with timestamped photo/video and inspector sign-off.</li>
            <li>Track compliance (permits, safety docs, closeout packages).</li>
          </ul>
          <div className="pt-2">
            This route is scaffolded; next iteration will add task boards and verification workflows.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

