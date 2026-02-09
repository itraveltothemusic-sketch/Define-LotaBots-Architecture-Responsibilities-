import {
  HardHat,
  Plus,
  Search,
  Filter,
  Star,
  ArrowRight,
  Phone,
  Mail,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatPhone } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { mockContractors, mockScopeAssignments } from "@/lib/db/mock-data";
import Link from "next/link";

/**
 * Contractors List Page — Contractor Execution Module entry point.
 *
 * Shows all contractors with:
 * - Verification status (license, insurance)
 * - Specialties and ratings
 * - Active scope assignments
 * - Compliance status
 *
 * Trust verification is non-negotiable in this module.
 * Every contractor must be documentably qualified.
 */

const statusVariantMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
  pending_approval: { label: "Pending Approval", variant: "warning" },
  approved: { label: "Approved", variant: "info" },
  active: { label: "Active", variant: "success" },
  suspended: { label: "Suspended", variant: "danger" },
  inactive: { label: "Inactive", variant: "neutral" },
};

export default function ContractorsPage() {
  const activeScopes = mockScopeAssignments.filter(
    (s) => s.status !== "completed" && s.status !== "disputed"
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Contractors</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Verified contractor management, scope assignment, and compliance
            tracking
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Add Contractor
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
            Total Contractors
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {mockContractors.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {mockContractors.filter((c) => c.status === "active").length} active
          </div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
            Active Scopes
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {activeScopes.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            In progress assignments
          </div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
            Average Rating
          </div>
          <div className="flex items-center gap-1.5">
            <div className="text-2xl font-bold text-slate-900">
              {(
                mockContractors.reduce((sum, c) => sum + (c.rating || 0), 0) /
                mockContractors.length
              ).toFixed(1)}
            </div>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across {mockContractors.reduce((sum, c) => sum + c.completedProjects, 0)} projects
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search contractors..."
            className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-slate-400"
          />
        </div>
        <Button variant="secondary" size="sm">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </Button>
      </div>

      {/* Contractors grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockContractors.map((contractor) => {
          const statusConfig = statusVariantMap[contractor.status] || statusVariantMap.inactive;
          const activeScope = mockScopeAssignments.find(
            (s) =>
              s.contractorId === contractor.id &&
              s.status !== "completed" &&
              s.status !== "disputed"
          );

          return (
            <Link
              key={contractor.id}
              href={`/contractors/${contractor.id}`}
              className="group block"
            >
              <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-100 transition-colors">
                      <HardHat className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {contractor.companyName}
                      </h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {contractor.contactName}
                      </div>
                    </div>
                  </div>
                  <StatusBadge
                    label={statusConfig.label}
                    variant={statusConfig.variant}
                    size="sm"
                  />
                </div>

                {/* Rating & projects */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-3.5 h-3.5",
                          star <= Math.round(contractor.rating || 0)
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200"
                        )}
                      />
                    ))}
                    <span className="text-xs font-semibold text-slate-600 ml-1">
                      {contractor.rating}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {contractor.completedProjects} projects
                  </span>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {contractor.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* Verification badges */}
                <div className="flex items-center gap-3 mb-4">
                  {contractor.licenseNumber && (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600">
                      <ShieldCheck className="w-3 h-3" />
                      <span className="font-medium">Licensed</span>
                    </div>
                  )}
                  {contractor.insuranceCertificateUrl && (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600">
                      <Award className="w-3 h-3" />
                      <span className="font-medium">Insured</span>
                    </div>
                  )}
                </div>

                {/* Active scope indicator */}
                {activeScope && (
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 mb-3">
                    <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-0.5">
                      Active Assignment
                    </div>
                    <div className="text-xs font-semibold text-blue-800">
                      {activeScope.title}
                    </div>
                  </div>
                )}

                {/* Contact info */}
                <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {formatPhone(contractor.phone)}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3" />
                    {contractor.email}
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
