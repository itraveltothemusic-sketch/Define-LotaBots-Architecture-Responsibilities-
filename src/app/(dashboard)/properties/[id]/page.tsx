import {
  Building2,
  MapPin,
  Calendar,
  Camera,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Download,
  Upload,
  Plus,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, getPropertyStatusVariant } from "@/components/ui/status-badge";
import { ATOSInsightPanel } from "@/components/atos/insight-panel";
import { PropertyTimeline } from "@/components/dashboard/property-timeline";
import { formatCurrency, formatDate, formatAddress } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  mockProperties,
  mockInspections,
  mockEvidence,
  mockClaims,
  mockATOSInsights,
  mockTimelineEvents,
  mockScopeAssignments,
} from "@/lib/db/mock-data";

/**
 * Property Detail Page — The forensic profile.
 *
 * This is where all intelligence about a single property converges:
 * - Property overview with key metrics
 * - Inspection records and damage areas
 * - Evidence library (photos, documents)
 * - Linked claims and contractor work
 * - ATOS insights specific to this property
 * - Complete timeline of all events
 *
 * This page must feel like opening a forensic case file.
 */

// Map damage severity to visual style
const severityConfig: Record<string, { color: string; bg: string; label: string }> = {
  minor: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", label: "Minor" },
  moderate: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", label: "Moderate" },
  severe: { color: "text-orange-700", bg: "bg-orange-50 border-orange-200", label: "Severe" },
  critical: { color: "text-red-700", bg: "bg-red-50 border-red-200", label: "Critical" },
};

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Resolve all data for this property
  const property = mockProperties.find((p) => p.id === id) || mockProperties[0];
  const inspection = mockInspections.find((i) => i.propertyId === property.id);
  const evidence = mockEvidence.filter((e) => e.propertyId === property.id);
  const claim = mockClaims.find((c) => c.propertyId === property.id);
  const insights = mockATOSInsights.filter((i) => i.propertyId === property.id);
  const timeline = mockTimelineEvents.filter((e) => e.propertyId === property.id);
  const scopes = mockScopeAssignments.filter((s) => s.propertyId === property.id);
  const status = getPropertyStatusVariant(property.status);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & back navigation */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/properties"
          className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Properties
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 font-medium">{property.address}</span>
      </div>

      {/* Property header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100">
            <Building2 className="w-7 h-7 text-slate-500" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">
                {property.address}
              </h1>
              <StatusBadge label={status.label} variant={status.variant} size="md" />
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {formatAddress(property.address, property.city, property.state, property.zipCode)}
              </span>
              <span className="capitalize">{property.propertyType.replace("_", " ")}</span>
              {property.squareFootage && (
                <span>{property.squareFootage.toLocaleString()} sq ft</span>
              )}
              {property.yearBuilt && <span>Built {property.yearBuilt}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Download className="w-3.5 h-3.5" />
            Export Report
          </Button>
          <Button size="sm">
            <Upload className="w-3.5 h-3.5" />
            Upload Evidence
          </Button>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Pre-Event Value</div>
          <div className="text-lg font-bold text-slate-900">
            {property.preEventValue ? formatCurrency(property.preEventValue) : "—"}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Claim Amount</div>
          <div className="text-lg font-bold text-slate-900">
            {claim?.claimedAmount ? formatCurrency(claim.claimedAmount) : "—"}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Post-Restoration Value</div>
          <div className="text-lg font-bold text-emerald-600">
            {property.postRestorationValue ? formatCurrency(property.postRestorationValue) : "Pending"}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Storm Event</div>
          <div className="text-sm font-bold text-slate-900">
            {property.stormEventType || "—"}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {property.stormEventDate ? formatDate(property.stormEventDate) : "—"}
          </div>
        </div>
      </div>

      {/* ATOS Insights for this property */}
      {insights.length > 0 && <ATOSInsightPanel insights={insights} />}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Damage Assessment */}
          {inspection && (
            <Card
              title="Forensic Damage Assessment"
              description={`Inspection completed ${inspection.completedAt ? formatDate(inspection.completedAt) : "pending"}`}
            >
              {inspection.findings && (
                <div className="p-4 mb-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    Inspector Findings
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {inspection.findings}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {inspection.damageAreas.map((area) => {
                  const severity = severityConfig[area.severity] || severityConfig.moderate;
                  return (
                    <div
                      key={area.id}
                      className={cn("p-4 rounded-xl border", severity.bg)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {area.location}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn("text-[10px] font-bold uppercase", severity.color)}>
                              {severity.label}
                            </span>
                            <span className="text-[10px] text-slate-400">·</span>
                            <span className="text-[10px] text-slate-500 capitalize">
                              {area.classification} damage
                            </span>
                          </div>
                        </div>
                        {area.estimatedRepairCost && (
                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-900">
                              {formatCurrency(area.estimatedRepairCost)}
                            </div>
                            <div className="text-[10px] text-slate-400">Est. repair</div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {area.description}
                      </p>
                    </div>
                  );
                })}

                {/* Total estimate */}
                {inspection.damageAreas.length > 0 && (
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <span className="text-sm font-semibold text-slate-700">
                      Total Estimated Damage
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      {formatCurrency(
                        inspection.damageAreas.reduce(
                          (sum, da) => sum + (da.estimatedRepairCost || 0),
                          0
                        )
                      )}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Evidence Library */}
          <Card
            title="Evidence Library"
            description={`${evidence.length} items documented`}
            action={
              <Button variant="secondary" size="sm">
                <Plus className="w-3.5 h-3.5" />
                Upload
              </Button>
            }
          >
            {evidence.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {evidence.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 hover:shadow-sm transition-all"
                  >
                    {item.type === "photo" || item.type === "video" ? (
                      <div className="aspect-[4/3] bg-slate-200 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-slate-400" />
                        {/* In production: actual image thumbnail */}
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                    <div className="p-3">
                      <h5 className="text-xs font-semibold text-slate-900 truncate">
                        {item.title}
                      </h5>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[10px] text-slate-400 capitalize">
                          {item.type}
                        </span>
                        <span className="text-[10px] text-slate-300">·</span>
                        <span className="text-[10px] text-slate-400">
                          {formatDate(item.capturedAt)}
                        </span>
                      </div>
                      {/* Classification tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.damageClassifications.map((cls) => (
                          <span
                            key={cls}
                            className="px-1.5 py-0.5 text-[9px] font-medium bg-slate-100 text-slate-500 rounded capitalize"
                          >
                            {cls}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90 shadow-sm">
                        <Eye className="w-4 h-4 text-slate-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Camera className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No evidence uploaded yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Upload photos, videos, and documents to build the forensic case file.
                </p>
              </div>
            )}
          </Card>

          {/* Restoration Scope */}
          {scopes.length > 0 && (
            <Card
              title="Restoration Scope"
              description="Active contractor assignments and progress"
            >
              {scopes.map((scope) => {
                const completedItems = scope.lineItems.filter(
                  (li) => li.status === "completed" || li.status === "verified"
                ).length;
                const totalItems = scope.lineItems.length;
                const progressPct = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

                return (
                  <div key={scope.id} className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {scope.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {scope.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">
                          {formatCurrency(scope.totalAmount)}
                        </div>
                        <div className="text-[10px] text-slate-400">Total scope</div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-500">
                          {completedItems} of {totalItems} items complete
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          {Math.round(progressPct)}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Line items */}
                    <div className="space-y-2">
                      {scope.lineItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50"
                        >
                          <div className="flex items-center gap-2">
                            {item.status === "completed" || item.status === "verified" ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : item.status === "in_progress" ? (
                              <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                            )}
                            <span className="text-xs text-slate-700">{item.description}</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-600">
                            {formatCurrency(item.totalCost)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Compliance checks */}
                    <div className="pt-3 border-t border-slate-100">
                      <h5 className="text-xs font-bold text-slate-700 mb-2">
                        Compliance Checks
                      </h5>
                      <div className="space-y-1.5">
                        {scope.complianceChecks.map((check) => (
                          <div key={check.id} className="flex items-center gap-2">
                            {check.status === "passed" ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : check.status === "failed" ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300" />
                            )}
                            <span className="text-xs text-slate-600">{check.name}</span>
                            {check.notes && (
                              <span className="text-[10px] text-slate-400 ml-auto">
                                {check.notes}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Card>
          )}
        </div>

        {/* Right column — 1/3: Timeline */}
        <div className="space-y-6">
          <PropertyTimeline
            events={timeline.reverse()}
            title="Property Timeline"
          />

          {/* Quick stats */}
          <Card title="Property Intelligence">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-xs text-slate-500">Evidence Items</span>
                <span className="text-xs font-bold text-slate-900">{evidence.length}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-xs text-slate-500">Damage Areas</span>
                <span className="text-xs font-bold text-slate-900">
                  {inspection?.damageAreas.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-xs text-slate-500">Active Claims</span>
                <span className="text-xs font-bold text-slate-900">{claim ? 1 : 0}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-xs text-slate-500">Active Scopes</span>
                <span className="text-xs font-bold text-slate-900">{scopes.length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-slate-500">ATOS Insights</span>
                <span className="text-xs font-bold text-violet-600">{insights.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
