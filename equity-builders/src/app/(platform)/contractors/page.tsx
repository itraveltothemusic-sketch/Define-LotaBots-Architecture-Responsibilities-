"use client";

/**
 * Contractor Execution Module
 * 
 * Manages contractor onboarding, scope assignments,
 * progress verification, and compliance tracking.
 * 
 * WHY: Verified execution is critical to equity outcomes.
 * Uncontrolled repairs can lead to scope creep, compliance
 * failures, and reduced equity gains. This module ensures
 * every contractor action is documented and verified.
 */

import { useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { contractors, scopeAssignments, properties } from "@/lib/mock-data";
import { formatCurrency, formatStatus, cn } from "@/lib/utils";
import {
  HardHat,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Phone,
  Mail,
  Building2,
  Plus,
  Wrench,
  Award,
  ChevronRight,
  Calendar,
  AlertTriangle,
} from "lucide-react";

export default function ContractorsPage() {
  const [activeTab, setActiveTab] = useState<"contractors" | "assignments">("contractors");

  return (
    <div>
      <Topbar
        title="Contractor Execution"
        subtitle="Onboarding, scope assignments, progress verification, and compliance"
      />

      <div className="p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-500/10 rounded-lg border border-brand-500/20">
                <HardHat className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="text-xs text-navy-400">Active Contractors</p>
                <p className="text-xl font-bold text-white">
                  {contractors.filter((c) => c.status === "active").length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-forensic-500/10 rounded-lg border border-forensic-500/20">
                <Wrench className="w-5 h-5 text-forensic-400" />
              </div>
              <div>
                <p className="text-xs text-navy-400">Active Assignments</p>
                <p className="text-xl font-bold text-white">
                  {scopeAssignments.filter((a) => a.status === "in_progress").length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-alert-500/10 rounded-lg border border-alert-500/20">
                <Award className="w-5 h-5 text-alert-400" />
              </div>
              <div>
                <p className="text-xs text-navy-400">Avg Rating</p>
                <p className="text-xl font-bold text-white">
                  {(contractors.reduce((sum, c) => sum + c.rating, 0) / contractors.length).toFixed(1)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-navy-600/20 rounded-lg border border-navy-600/30">
                <CheckCircle2 className="w-5 h-5 text-navy-300" />
              </div>
              <div>
                <p className="text-xs text-navy-400">Total Completed</p>
                <p className="text-xl font-bold text-white">
                  {contractors.reduce((sum, c) => sum + c.completedJobs, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-navy-900/60 border border-navy-700/50 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("contractors")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === "contractors"
                ? "bg-brand-600/20 text-brand-300"
                : "text-navy-400 hover:text-navy-200",
            )}
          >
            Contractors
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === "assignments"
                ? "bg-brand-600/20 text-brand-300"
                : "text-navy-400 hover:text-navy-200",
            )}
          >
            Scope Assignments
          </button>
        </div>

        {/* Contractors Tab */}
        {activeTab === "contractors" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Verified Contractors</h3>
              <Button>
                <Plus className="w-4 h-4" />
                Add Contractor
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contractors.map((contractor) => (
                <Card key={contractor.id} hover className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-lg flex items-center justify-center">
                        <HardHat className="w-5 h-5 text-brand-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{contractor.name}</h4>
                        <p className="text-xs text-navy-400">{contractor.company}</p>
                      </div>
                    </div>
                    <Badge
                      variant={contractor.status === "active" ? "success" : "neutral"}
                      size="sm"
                    >
                      {formatStatus(contractor.status)}
                    </Badge>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {contractor.specializations.slice(0, 3).map((spec) => (
                      <span key={spec} className="text-[10px] px-2 py-0.5 bg-navy-700/40 text-navy-300 rounded-full border border-navy-600/30">
                        {spec}
                      </span>
                    ))}
                    {contractor.specializations.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 text-navy-400">
                        +{contractor.specializations.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 text-alert-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-semibold">{contractor.rating}</span>
                    </div>
                    <span className="text-navy-400">{contractor.completedJobs} jobs completed</span>
                    <div className="flex items-center gap-1">
                      {contractor.insuranceVerified ? (
                        <div className="flex items-center gap-1 text-forensic-400">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-alert-400">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Unverified</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-navy-700/30 text-xs text-navy-400">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {contractor.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {contractor.phone}
                    </div>
                  </div>
                  <p className="text-[11px] text-navy-500 mt-1.5">
                    License: {contractor.licenseNumber}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">Active Scope Assignments</h3>
              <Button>
                <Plus className="w-4 h-4" />
                New Assignment
              </Button>
            </div>
            {scopeAssignments.map((assignment) => {
              const contractor = contractors.find((c) => c.id === assignment.contractorId);
              const property = properties.find((p) => p.id === assignment.propertyId);

              return (
                <Card key={assignment.id} className="p-5">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Assignment Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          variant={assignment.status === "completed" ? "success" : assignment.status === "in_progress" ? "info" : "warning"}
                          size="sm"
                        >
                          {formatStatus(assignment.status)}
                        </Badge>
                        {property && (
                          <Link
                            href={`/properties/${property.id}`}
                            className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
                          >
                            <Building2 className="w-3.5 h-3.5" />
                            {property.name}
                          </Link>
                        )}
                      </div>
                      <h4 className="text-base font-semibold text-white mb-1">
                        {assignment.description}
                      </h4>
                      {contractor && (
                        <div className="flex items-center gap-2 text-sm text-navy-400">
                          <HardHat className="w-4 h-4" />
                          {contractor.name} — {contractor.company}
                        </div>
                      )}

                      {/* Progress */}
                      <div className="mt-4">
                        <ProgressBar
                          value={assignment.progressPercentage}
                          label="Completion"
                          color={assignment.progressPercentage >= 100 ? "forensic" : "brand"}
                        />
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-4 mt-3 text-xs text-navy-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Start: {new Date(assignment.startDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Due: {new Date(assignment.expectedEndDate).toLocaleDateString()}
                        </div>
                        <div>
                          Budget: <span className="text-white font-medium">{formatCurrency(assignment.estimatedCost)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Compliance Checks */}
                    <div className="lg:w-72 flex-shrink-0">
                      <p className="text-xs text-navy-500 uppercase tracking-wider font-semibold mb-2">
                        Compliance Checks
                      </p>
                      <div className="space-y-2">
                        {assignment.complianceChecks.map((check) => (
                          <div
                            key={check.id}
                            className={cn(
                              "flex items-center gap-2 p-2 rounded-lg text-xs",
                              check.passed
                                ? "bg-forensic-500/10 border border-forensic-500/20"
                                : "bg-navy-800/40 border border-navy-700/30",
                            )}
                          >
                            {check.passed ? (
                              <CheckCircle2 className="w-4 h-4 text-forensic-400 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-navy-500 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={cn("font-medium truncate", check.passed ? "text-forensic-300" : "text-navy-400")}>
                                {check.name}
                              </p>
                              {check.checkedAt && (
                                <p className="text-navy-500">{new Date(check.checkedAt).toLocaleDateString()}</p>
                              )}
                              {check.notes && !check.passed && (
                                <p className="text-navy-400">{check.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
