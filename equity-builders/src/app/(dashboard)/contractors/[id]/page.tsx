/**
 * Contractor Detail Page
 * 
 * Full profile for a contractor including compliance status,
 * assignment history, performance metrics, and ATOS guidance.
 */
"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  HardHat,
  Star,
  Shield,
  Building2,
  Calendar,
  Phone,
  Mail,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge, getStatusVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ATOSPanel } from "@/components/atos";
import { formatCurrency, formatDate } from "@/lib/utils";

const contractor = {
  id: "1",
  companyName: "Rivera Construction LLC",
  contactName: "Mike Rivera",
  email: "mike@riveraconstruction.com",
  phone: "(214) 555-0234",
  status: "ACTIVE",
  specialties: ["Roofing", "HVAC", "General Repair"],
  rating: 4.8,
  completedProjects: 12,
  licenseNumber: "TX-CON-2024-1847",
  insuranceCarrier: "Hartford Insurance",
  insurancePolicyNumber: "HI-2024-55123",
  insuranceExpiry: "2024-02-24",
  totalEarnings: 487000,
  onboardDate: "2023-08-15",
};

const completedAssignments = [
  { property: "2100 Office Park Ln", scope: "Complete roof replacement", cost: 145000, rating: 5, completedDate: "2024-01-28" },
  { property: "320 Elm Street", scope: "HVAC system repair", cost: 38000, rating: 4.5, completedDate: "2023-12-15" },
  { property: "890 Retail Center Dr", scope: "Storm damage assessment support", cost: 8500, rating: 5, completedDate: "2023-11-20" },
];

const complianceChecks = [
  { type: "General Liability Insurance", status: "WARNING", date: "Expires Feb 24, 2024", notes: "15 days remaining" },
  { type: "Workers Compensation", status: "PASSED", date: "Valid through Dec 2024", notes: "" },
  { type: "Contractor License", status: "PASSED", date: "Valid through Aug 2024", notes: "" },
  { type: "Background Check", status: "PASSED", date: "Completed Aug 15, 2023", notes: "" },
  { type: "Safety Certification", status: "PASSED", date: "Valid through Jun 2024", notes: "" },
];

export default function ContractorDetailPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/contractors" className="hover:text-slate-300 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Contractors
        </Link>
        <span>/</span>
        <span className="text-slate-300">{contractor.companyName}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">{contractor.companyName}</h1>
            <Badge variant={getStatusVariant(contractor.status)} dot>
              {contractor.status}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span>{contractor.contactName}</span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              {contractor.rating} rating
            </span>
            <span>{contractor.completedProjects} completed projects</span>
            <span>Since {formatDate(contractor.onboardDate)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={<Phone className="w-4 h-4" />}>
            Contact
          </Button>
          <Button variant="primary" size="sm" icon={<Building2 className="w-4 h-4" />}>
            Assign to Property
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact & License Info */}
          <Card variant="default" padding="md">
            <CardHeader>
              <CardTitle className="text-base">Contractor Details</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Contact</p>
                <p className="text-sm text-slate-200">{contractor.contactName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm text-slate-200">{contractor.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-sm text-slate-200">{contractor.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">License</p>
                <p className="text-sm text-slate-200">{contractor.licenseNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Insurance Carrier</p>
                <p className="text-sm text-slate-200">{contractor.insuranceCarrier}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Earnings</p>
                <p className="text-sm text-slate-200 font-semibold">{formatCurrency(contractor.totalEarnings)}</p>
              </div>
            </div>
          </Card>

          {/* Compliance Checks */}
          <Card variant="default" padding="md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-slate-400" />
                <CardTitle className="text-base">Compliance Status</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-2">
              {complianceChecks.map((check, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/20"
                >
                  <div className="flex items-center gap-3">
                    {check.status === "PASSED" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                    <div>
                      <p className="text-sm text-slate-200">{check.type}</p>
                      <p className="text-xs text-slate-500">{check.date}</p>
                    </div>
                  </div>
                  <Badge variant={check.status === "PASSED" ? "success" : "warning"} size="sm">
                    {check.status === "PASSED" ? "Compliant" : "Action Needed"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Completed Work */}
          <Card variant="default" padding="md">
            <CardHeader>
              <CardTitle className="text-base">Completed Assignments</CardTitle>
              <CardDescription>{completedAssignments.length} projects</CardDescription>
            </CardHeader>
            <div className="space-y-3">
              {completedAssignments.map((assignment, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/20"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{assignment.property}</p>
                    <p className="text-xs text-slate-400">{assignment.scope}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Completed {formatDate(assignment.completedDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{formatCurrency(assignment.cost)}</p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-amber-400">{assignment.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ATOS */}
        <div>
          <ATOSPanel
            context="CONTRACTOR_REVIEW"
            initialInsights={[
              { type: "alert", text: "General liability insurance expires in 15 days — request updated certificate immediately" },
              { type: "recommendation", text: "Strong track record with 4.8 rating. Good candidate for 450 Commerce Blvd facade repair." },
              { type: "opportunity", text: "Consider assigning HVAC scope for 450 Commerce — specialty match and availability confirmed" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
