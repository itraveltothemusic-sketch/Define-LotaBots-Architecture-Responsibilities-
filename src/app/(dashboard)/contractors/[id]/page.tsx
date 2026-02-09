import {
  ArrowLeft,
  HardHat,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Star,
  MapPin,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate, formatPhone } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  mockContractors,
  mockScopeAssignments,
  mockProperties,
} from "@/lib/db/mock-data";

/**
 * Contractor Detail Page
 *
 * Full contractor profile with:
 * - Verification status and credentials
 * - Active and completed scope assignments
 * - Compliance tracking
 * - Performance metrics
 *
 * Every contractor working on insured properties must be
 * documentably qualified and traceable.
 */

const statusVariantMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
  pending_approval: { label: "Pending Approval", variant: "warning" },
  approved: { label: "Approved", variant: "info" },
  active: { label: "Active", variant: "success" },
  suspended: { label: "Suspended", variant: "danger" },
  inactive: { label: "Inactive", variant: "neutral" },
};

const scopeStatusVariant: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" | "purple" }> = {
  draft: { label: "Draft", variant: "neutral" },
  assigned: { label: "Assigned", variant: "info" },
  accepted: { label: "Accepted", variant: "info" },
  in_progress: { label: "In Progress", variant: "warning" },
  pending_verification: { label: "Pending Verification", variant: "purple" },
  verified: { label: "Verified", variant: "success" },
  completed: { label: "Completed", variant: "success" },
  disputed: { label: "Disputed", variant: "danger" },
};

export default async function ContractorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const contractor = mockContractors.find((c) => c.id === id) || mockContractors[0];
  const scopes = mockScopeAssignments.filter((s) => s.contractorId === contractor.id);
  const statusConfig = statusVariantMap[contractor.status] || statusVariantMap.inactive;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/contractors"
          className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Contractors
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 font-medium">
          {contractor.companyName}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-50">
            <HardHat className="w-7 h-7 text-orange-600" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">
                {contractor.companyName}
              </h1>
              <StatusBadge
                label={statusConfig.label}
                variant={statusConfig.variant}
                size="md"
              />
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-slate-500">
              <span>{contractor.contactName}</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {formatPhone(contractor.phone)}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {contractor.email}
              </span>
            </div>
          </div>
        </div>
        <Button variant="secondary" size="sm">
          <Download className="w-3.5 h-3.5" />
          Export Profile
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
            Rating
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-slate-900">
              {contractor.rating}
            </span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
            Completed Projects
          </div>
          <div className="text-lg font-bold text-slate-900">
            {contractor.completedProjects}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
            Active Scopes
          </div>
          <div className="text-lg font-bold text-slate-900">
            {scopes.filter((s) => s.status !== "completed").length}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
            Total Scope Value
          </div>
          <div className="text-lg font-bold text-slate-900">
            {formatCurrency(scopes.reduce((sum, s) => sum + s.totalAmount, 0))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scope assignments — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {scopes.map((scope) => {
            const property = mockProperties.find((p) => p.id === scope.propertyId);
            const scopeStatus = scopeStatusVariant[scope.status] || scopeStatusVariant.draft;
            const completedItems = scope.lineItems.filter(
              (li) => li.status === "completed" || li.status === "verified"
            ).length;
            const progressPct = scope.lineItems.length > 0
              ? (completedItems / scope.lineItems.length) * 100
              : 0;

            return (
              <Card key={scope.id}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        {scope.title}
                      </h3>
                      <StatusBadge
                        label={scopeStatus.label}
                        variant={scopeStatus.variant}
                        size="sm"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {scope.description}
                    </p>
                    {property && (
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                        <MapPin className="w-3 h-3" />
                        {property.address}, {property.city}, {property.state}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">
                      {formatCurrency(scope.totalAmount)}
                    </div>
                    <div className="text-[10px] text-slate-400">Total value</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-500">
                      {completedItems} of {scope.lineItems.length} items
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {Math.round(progressPct)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Line items table */}
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2">
                          Item
                        </th>
                        <th className="text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2">
                          Qty
                        </th>
                        <th className="text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2">
                          Cost
                        </th>
                        <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {scope.lineItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {item.status === "completed" || item.status === "verified" ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              ) : item.status === "in_progress" ? (
                                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                              )}
                              <span className="text-xs text-slate-700">
                                {item.description}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-xs text-slate-500">
                            {item.quantity.toLocaleString()} {item.unit}
                          </td>
                          <td className="px-4 py-3 text-right text-xs font-semibold text-slate-700">
                            {formatCurrency(item.totalCost)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={cn(
                                "px-2 py-0.5 text-[9px] font-bold uppercase rounded",
                                item.status === "completed" || item.status === "verified"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : item.status === "in_progress"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-500"
                              )}
                            >
                              {item.status.replace("_", " ")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Compliance */}
                {scope.complianceChecks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 mb-3">
                      Compliance Checks
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {scope.complianceChecks.map((check) => (
                        <div
                          key={check.id}
                          className={cn(
                            "flex items-start gap-2 p-3 rounded-lg border",
                            check.status === "passed"
                              ? "bg-emerald-50 border-emerald-200"
                              : check.status === "failed"
                              ? "bg-red-50 border-red-200"
                              : "bg-slate-50 border-slate-200"
                          )}
                        >
                          {check.status === "passed" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          ) : check.status === "failed" ? (
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="text-xs font-semibold text-slate-900">
                              {check.name}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {check.description}
                            </div>
                            {check.notes && (
                              <div className="text-[10px] text-slate-400 mt-1">
                                {check.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-400">
                  {scope.startDate && (
                    <span>Started: {formatDate(scope.startDate)}</span>
                  )}
                  {scope.estimatedCompletionDate && (
                    <span>
                      Est. Complete: {formatDate(scope.estimatedCompletionDate)}
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Credentials */}
          <Card title="Credentials & Verification">
            <div className="space-y-4">
              {contractor.licenseNumber && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-800">
                      Licensed
                    </div>
                    <div className="text-[10px] text-emerald-600 mt-0.5">
                      {contractor.licenseNumber}
                    </div>
                  </div>
                </div>
              )}
              {contractor.insuranceCertificateUrl && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <Award className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-800">
                      Insurance Certificate on File
                    </div>
                    <div className="text-[10px] text-emerald-600 mt-0.5">
                      Certificate verified
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Specialties */}
          <Card title="Specialties">
            <div className="flex flex-wrap gap-2">
              {contractor.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </Card>

          {/* Contact */}
          <Card title="Contact Information">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">
                  {formatPhone(contractor.phone)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">
                  {contractor.email}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">
                  Member since {formatDate(contractor.createdAt)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
