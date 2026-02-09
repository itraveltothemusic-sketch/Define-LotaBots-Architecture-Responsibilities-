import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { getSessionUser } from "@/lib/auth/session";
import { getAccessiblePlatformRoutes } from "@/lib/auth/authorization";
import { getDashboardSnapshot } from "@/lib/data/repository";
import { formatCurrency } from "@/lib/utils";

type PlatformHomeProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function resolveSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PlatformHome({ searchParams }: PlatformHomeProps) {
  const user = await getSessionUser();
  const snapshot = await getDashboardSnapshot();
  const routes = getAccessiblePlatformRoutes(user?.role ?? "INTERNAL");
  const params = (await searchParams) ?? {};
  const denied = resolveSingle(params.denied) === "1";

  return (
    <div className="space-y-6">
      {denied ? (
        <Card className="border-amber-600/40 bg-amber-950/20">
          <p className="text-sm text-amber-200">
            Your role does not have access to the requested module. ATOS redirected you to the
            nearest authorized workspace.
          </p>
        </Card>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Tracked assets" value={String(snapshot.propertyCount)} />
        <MetricCard label="Active claims" value={String(snapshot.activeClaimCount)} />
        <MetricCard
          label="Approval volume"
          value={formatCurrency(snapshot.totalApprovedUsd)}
          support={`against ${formatCurrency(snapshot.totalClaimedUsd)} claimed`}
        />
        <MetricCard
          label="Verified equity gain"
          value={formatCurrency(snapshot.totalEquityGainUsd)}
          support="valuation uplift from tracked assets"
        />
      </section>

      <Card>
        <CardTitle
          title="Authenticated Dashboard Shell"
          subtitle="Role-aware launch surface for every platform module."
        />
        <div className="grid gap-3 md:grid-cols-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-colors hover:border-slate-700"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{route.title}</h3>
                <Badge tone="neutral">Module</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-300">{route.description}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
