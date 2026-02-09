/**
 * Contractor Execution Module — Contractor List
 * 
 * Manages the contractor network: onboarding, compliance verification,
 * assignment tracking, and performance monitoring.
 * 
 * Why this matters: Contractor quality directly impacts equity outcomes.
 * Poor execution = reduced property value = lower equity gain.
 * This module ensures every contractor is verified, compliant, and tracked.
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HardHat,
  Plus,
  Search,
  Star,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Building2,
  Eye,
  Award,
  Clock,
  FileCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge, getStatusVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";

interface ContractorItem {
  id: string;
  companyName: string;
  contactName: string;
  status: string;
  specialties: string[];
  rating: number;
  completedProjects: number;
  activeAssignments: number;
  licenseNumber: string;
  insuranceExpiry: string;
  isInsuranceExpiring: boolean;
  totalEarnings: number;
}

const contractors: ContractorItem[] = [
  {
    id: "1",
    companyName: "Rivera Construction LLC",
    contactName: "Mike Rivera",
    status: "ACTIVE",
    specialties: ["Roofing", "HVAC", "General Repair"],
    rating: 4.8,
    completedProjects: 12,
    activeAssignments: 2,
    licenseNumber: "TX-CON-2024-1847",
    insuranceExpiry: "2024-02-24",
    isInsuranceExpiring: true,
    totalEarnings: 487000,
  },
  {
    id: "2",
    companyName: "Summit Roofing Solutions",
    contactName: "Emily Wright",
    status: "ACTIVE",
    specialties: ["Roofing", "Waterproofing", "Facade"],
    rating: 4.9,
    completedProjects: 18,
    activeAssignments: 1,
    licenseNumber: "TX-CON-2023-9912",
    insuranceExpiry: "2024-09-15",
    isInsuranceExpiring: false,
    totalEarnings: 723000,
  },
  {
    id: "3",
    companyName: "Lone Star HVAC Services",
    contactName: "Carlos Mendez",
    status: "APPROVED",
    specialties: ["HVAC", "Electrical"],
    rating: 4.6,
    completedProjects: 8,
    activeAssignments: 0,
    licenseNumber: "TX-CON-2024-3345",
    insuranceExpiry: "2024-12-01",
    isInsuranceExpiring: false,
    totalEarnings: 218000,
  },
  {
    id: "4",
    companyName: "DFW Interior Specialists",
    contactName: "Andrea Collins",
    status: "ACTIVE",
    specialties: ["Interior", "Drywall", "Painting", "Flooring"],
    rating: 4.7,
    completedProjects: 15,
    activeAssignments: 3,
    licenseNumber: "TX-CON-2023-7788",
    insuranceExpiry: "2024-07-30",
    isInsuranceExpiring: false,
    totalEarnings: 562000,
  },
  {
    id: "5",
    companyName: "Texas Storm Restoration",
    contactName: "Brian Foster",
    status: "PENDING",
    specialties: ["General Repair", "Roofing", "Water Damage"],
    rating: 0,
    completedProjects: 0,
    activeAssignments: 0,
    licenseNumber: "TX-CON-2024-5521",
    insuranceExpiry: "2025-01-15",
    isInsuranceExpiring: false,
    totalEarnings: 0,
  },
];

const assignments = [
  {
    id: "1",
    contractor: "Rivera Construction LLC",
    property: "1200 Industrial Pkwy",
    scope: "Roof membrane replacement + HVAC repair",
    status: "IN_PROGRESS",
    progress: 65,
    estimatedCost: 145000,
    startDate: "2024-02-03",
  },
  {
    id: "2",
    contractor: "Rivera Construction LLC",
    property: "450 Commerce Blvd",
    scope: "North facade repair",
    status: "ASSIGNED",
    progress: 0,
    estimatedCost: 12400,
    startDate: null,
  },
  {
    id: "3",
    contractor: "DFW Interior Specialists",
    property: "1200 Industrial Pkwy",
    scope: "2nd floor water damage remediation + drywall",
    status: "IN_PROGRESS",
    progress: 40,
    estimatedCost: 26500,
    startDate: "2024-02-05",
  },
];

export default function ContractorsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContractors = contractors.filter((c) =>
    searchQuery === "" ||
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeContractors = contractors.filter((c) => c.status === "ACTIVE").length;
  const totalAssignments = assignments.length;
  const avgRating = contractors.filter((c) => c.rating > 0).reduce((s, c) => s + c.rating, 0) / contractors.filter((c) => c.rating > 0).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-500/10">
              <HardHat className="w-5 h-5 text-brand-400" />
            </div>
            Contractor Network
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Onboarding, compliance, assignment tracking, and performance monitoring
          </p>
        </div>
        <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
          Onboard Contractor
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Contractors"
          value={activeContractors}
          icon={<HardHat className="w-5 h-5" />}
        />
        <StatCard
          label="Active Assignments"
          value={totalAssignments}
          icon={<Building2 className="w-5 h-5" />}
        />
        <StatCard
          label="Avg. Rating"
          value={avgRating.toFixed(1)}
          icon={<Star className="w-5 h-5" />}
        />
        <StatCard
          label="Compliance Alerts"
          value={contractors.filter((c) => c.isInsuranceExpiring).length}
          icon={<AlertTriangle className="w-5 h-5" />}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contractors List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by company, contact, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div className="space-y-3">
            {filteredContractors.map((contractor) => (
              <Card
                key={contractor.id}
                variant="default"
                padding="md"
                className={cn(
                  "hover:border-slate-600/50 transition-all group",
                  contractor.isInsuranceExpiring && "border-amber-500/20"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">
                        {contractor.companyName}
                      </h3>
                      <Badge variant={getStatusVariant(contractor.status)} dot size="sm">
                        {contractor.status}
                      </Badge>
                      {contractor.isInsuranceExpiring && (
                        <Badge variant="warning" size="sm" dot>
                          Insurance Expiring
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{contractor.contactName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      License: {contractor.licenseNumber}
                    </p>
                  </div>
                  <Link href={`/contractors/${contractor.id}`}>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {contractor.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="text-xs px-2 py-0.5 rounded bg-slate-800/50 text-slate-400 border border-slate-700/30"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 pt-3 border-t border-slate-700/20">
                  <div>
                    <p className="text-xs text-slate-500">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium text-white">
                        {contractor.rating > 0 ? contractor.rating : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Completed</p>
                    <p className="text-sm font-medium text-white">{contractor.completedProjects}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Active</p>
                    <p className="text-sm font-medium text-white">{contractor.activeAssignments}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Earnings</p>
                    <p className="text-sm font-medium text-white">
                      {contractor.totalEarnings > 0 ? formatCurrency(contractor.totalEarnings) : "—"}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel — Active Assignments */}
        <div className="space-y-6">
          <Card variant="elevated" padding="md">
            <CardHeader>
              <CardTitle className="text-base">Active Assignments</CardTitle>
              <CardDescription>{assignments.length} in progress</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={getStatusVariant(assignment.status)} size="sm">
                      {assignment.status.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {formatCurrency(assignment.estimatedCost)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-white mb-0.5">
                    {assignment.property}
                  </p>
                  <p className="text-xs text-slate-400 mb-3">{assignment.scope}</p>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-500 transition-all duration-500"
                        style={{ width: `${assignment.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-white min-w-[35px] text-right">
                      {assignment.progress}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {assignment.contractor}
                    {assignment.startDate && ` · Started ${formatDate(assignment.startDate)}`}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Compliance Overview */}
          <Card variant="default" padding="md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-slate-400" />
                <CardTitle className="text-base">Compliance</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3">
              {contractors.filter((c) => c.status !== "PENDING").map((contractor) => (
                <div key={contractor.id} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{contractor.companyName}</span>
                  <div className="flex items-center gap-2">
                    {contractor.isInsuranceExpiring ? (
                      <Badge variant="warning" size="sm" dot>Expiring</Badge>
                    ) : (
                      <Badge variant="success" size="sm" dot>Compliant</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
