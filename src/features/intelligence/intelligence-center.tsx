import { AtosAssistantPanel } from "@/components/atos/assistant-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeader } from "@/components/ui/section-header";
import type { IntelligenceCenterData } from "@/lib/data/repository";
import { formatCurrency, formatDate, formatPercent } from "@/lib/utils";
import type { AtosAnalysis } from "@/lib/atos/engine";

interface IntelligenceCenterProps {
  data: IntelligenceCenterData;
  atos: AtosAnalysis;
}

function statusTone(status: string) {
  if (status === "RESTORING") return "warning";
  if (status === "ACTIVE_CLAIM") return "high";
  if (status === "RESOLVED") return "success";
  return "low";
}

export function IntelligenceCenter({ data, atos }: IntelligenceCenterProps) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module 01"
        title="Intelligence Center"
        description="The operational heart of Equity Builders. This workspace combines claim posture, forensic chronology, and action-ready guidance from ATOS."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Tracked Properties" value={String(data.snapshot.propertyCount)} />
        <MetricCard
          label="Claim Approval"
          value={formatCurrency(data.snapshot.totalApprovedUsd)}
          support={`of ${formatCurrency(data.snapshot.totalClaimedUsd)} claimed`}
        />
        <MetricCard
          label="Open Evidence Risks"
          value={String(data.snapshot.unresolvedEvidenceCount)}
          support="pending or flagged documentation"
        />
        <MetricCard
          label="Portfolio Confidence"
          value={formatPercent(data.snapshot.weightedConfidence)}
          support="cross-module data confidence"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardTitle
              title="Property Overview"
              subtitle="Primary recovery asset under active strategic guidance."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-lg font-semibold text-white">{data.focusProperty.label}</p>
                <p className="text-sm text-slate-400">
                  {data.focusProperty.address}, {data.focusProperty.city}, {data.focusProperty.state}{" "}
                  {data.focusProperty.postalCode}
                </p>
                <div className="mt-3">
                  <Badge tone={statusTone(data.focusProperty.status)}>
                    {data.focusProperty.status}
                  </Badge>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-slate-400">Asset class</dt>
                  <dd className="mt-1 text-slate-100">{data.focusProperty.assetClass}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Gross SF</dt>
                  <dd className="mt-1 text-slate-100">
                    {data.focusProperty.grossSquareFeet.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Current valuation</dt>
                  <dd className="mt-1 text-slate-100">
                    {formatCurrency(data.focusProperty.currentValuationUsd)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Occupancy</dt>
                  <dd className="mt-1 text-slate-100">
                    {formatPercent(data.focusProperty.occupancyRate)}
                  </dd>
                </div>
              </dl>
            </div>
          </Card>

          <Card>
            <CardTitle
              title="Evidence & Documentation Timeline"
              subtitle="Forensic chronology used for claim defensibility and execution sequencing."
            />
            <ol className="space-y-3">
              {data.propertyTimeline.slice(0, 8).map((event) => (
                <li
                  key={`${event.kind}-${event.at}-${event.title}`}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{event.title}</p>
                    <span className="text-xs text-slate-400">{formatDate(event.at)}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{event.summary}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    {event.kind} · {event.severity}
                  </p>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <AtosAssistantPanel module="intelligence" summary={atos.summary} guidance={atos.guidance} />
      </section>
    </div>
  );
}
