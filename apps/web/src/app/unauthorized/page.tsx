import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-14 dark:bg-black">
      <div className="mx-auto w-full max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Access restricted</CardTitle>
            <CardDescription>
              Your role does not have access to that module. If you believe this is an error, contact an internal operator.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
            <Link className="underline underline-offset-4 hover:no-underline" href="/dashboard">
              Return to dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

