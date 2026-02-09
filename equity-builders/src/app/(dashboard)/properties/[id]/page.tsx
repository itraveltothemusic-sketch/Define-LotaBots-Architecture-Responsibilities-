/**
 * Property Detail Page
 * 
 * The complete forensic profile of a single property.
 * Shows everything from basic details through inspection records,
 * insurance claims, contractor assignments, and equity outcomes.
 * 
 * ATOS is embedded here with PROPERTY_OVERVIEW context to provide
 * property-specific intelligence and guidance.
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Calendar,
  ArrowLeft,
  Camera,
  Shield,
  HardHat,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Edit,
  Upload,
  Ruler,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge, getStatusVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { ATOSPanel } from "@/components/atos";
import { formatCurrency, formatDate, formatStatus, formatSquareFeet } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";

/**
 * Demo property detail data.
 * In production, this would be fetched server-side using the route params.
 */
const property = {
  id: "1",
  address: "450 Commerce Blvd",
  city: "Dallas",
  state: "TX",
  zipCode: "75201",
  propertyType: "COMMERCIAL" as const,
  status: "CLAIM_FILED" as const,
  ownerName: "Sarah Chen",
  ownerEmail: "sarah.chen@example.com",
  squareFootage: 28000,
  yearBuilt: 2004,
  estimatedValue: 2_400_000,
  roofType: "Modified Bitumen",
  stories: 2,
  createdAt: "2024-01-15",
  lastInspectionDate: "2024-01-22",
};

const inspections = [
  {
    id: "insp-1",
    type: "INITIAL",
    date: "2024-01-22",
    inspector: "Alex Morgan",
    severity: "SEVERE",
    findings: "Significant hail damage to roofing membrane with multiple puncture points. HVAC condenser units on roof show denting consistent with 2-inch hail. Facade damage on north-facing walls.",
    damageItems: [
      { type: "ROOF", severity: "SEVERE", location: "Main roof area - Sections A, B", cost: 87000 },
      { type: "HVAC", severity: "MODERATE", location: "Rooftop units 1-4", cost: 58200 },
      { type: "FACADE", severity: "MINOR", location: "North wall exterior", cost: 12400 },
      { type: "WATER", severity: "MODERATE", location: "2nd floor interior - water intrusion", cost: 18000 },
    ],
    photoCount: 47,
  },
  {
    id: "insp-2",
    type: "FOLLOW_UP",
    date: "2024-02-01",
    inspector: "Alex Morgan",
    severity: "SEVERE",
    findings: "Follow-up inspection confirmed initial findings. Additional water damage discovered in ceiling tiles on 2nd floor. Roof membrane sample extracted for laboratory analysis.",
    damageItems: [
      { type: "WATER", severity: "MODERATE", location: "2nd floor ceiling tiles - rooms 201-205", cost: 8500 },
      { type: "INTERIOR", severity: "MINOR", location: "2nd floor drywall", cost: 4200 },
    ],
    photoCount: 23,
  },
];

const claim = {
  id: "claim-1",
  claimNumber: "TRV-2024-08847",
  carrier: "Travelers Insurance",
  policyNumber: "POL-8847-2024",
  status: "UNDER_REVIEW" as const,
  filedDate: "2024-01-28",
  claimedAmount: 188300,
  approvedAmount: null,
  adjusterName: "Robert Taylor",
  adjusterPhone: "(214) 555-0187",
  interactions: [
    { date: "2024-01-28", type: "SUBMISSION", summary: "Initial claim filed with full forensic documentation" },
    { date: "2024-02-05", type: "ACKNOWLEDGMENT", summary: "Carrier acknowledged receipt. Claim number assigned." },
    { date: "2024-02-08", type: "INSPECTION", summary: "Carrier adjuster scheduled for Feb 12" },
  ],
};

const timeline = [
  { date: "Jan 15", event: "Property registered in system", type: "milestone" as const },
  { date: "Jan 18", event: "Initial documentation uploaded (12 photos)", type: "update" as const },
  { date: "Jan 22", event: "Forensic inspection completed — SEVERE damage", type: "milestone" as const },
  { date: "Jan 28", event: "Insurance claim filed with Travelers ($188,300)", type: "milestone" as const },
  { date: "Feb 1", event: "Follow-up inspection — additional damage documented", type: "update" as const },
  { date: "Feb 5", event: "Carrier acknowledgment received", type: "update" as const },
  { date: "Feb 8", event: "ATOS: Scope discrepancy detected — HVAC items at risk", type: "alert" as const },
];

type TabType = "overview" | "inspections" | "claims" | "documents" | "timeline";

export default function PropertyDetailPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Building2 className="w-4 h-4" /> },
    { id: "inspections", label: "Inspections", icon: <Camera className="w-4 h-4" /> },
    { id: "claims", label: "Claims", icon: <Shield className="w-4 h-4" /> },
    { id: "documents", label: "Documents", icon: <FileText className="w-4 h-4" /> },
    { id: "timeline", label: "Timeline", icon: <Clock className="w-4 h-4" /> },
  ];

  const totalDamageCost = inspections.reduce(
    (sum, insp) => sum + insp.damageItems.reduce((s, d) => s + d.cost, 0),
    0
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/properties" className="hover:text-slate-300 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Properties
        </Link>
        <span>/</span>
        <span className="text-slate-300">{property.address}</span>
      </div>

      {/* Property Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">{property.address}</h1>
            <Badge variant={getStatusVariant(property.status)} dot>
              {formatStatus(property.status)}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {property.city}, {property.state} {property.zipCode}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {formatStatus(property.propertyType)}
            </span>
            <span className="flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              {formatSquareFeet(property.squareFootage)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Built {property.yearBuilt}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={<Edit className="w-4 h-4" />}>
            Edit
          </Button>
          <Button variant="outline" size="sm" icon={<Upload className="w-4 h-4" />}>
            Upload Evidence
          </Button>
          <Button variant="primary" size="sm" icon={<Shield className="w-4 h-4" />}>
            File Claim
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Estimated Value"
          value={formatCurrency(property.estimatedValue)}
          icon={<Building2 className="w-5 h-5" />}
        />
        <StatCard
          label="Total Damage Scope"
          value={formatCurrency(totalDamageCost)}
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <StatCard
          label="Claim Amount"
          value={formatCurrency(claim.claimedAmount)}
          icon={<Shield className="w-5 h-5" />}
        />
        <StatCard
          label="Inspections"
          value={inspections.length}
          change={{ value: inspections.reduce((s, i) => s + i.photoCount, 0), label: "photos" }}
          trend="neutral"
          icon={<Camera className="w-5 h-5" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "border-brand-500 text-brand-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content + ATOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Property Details */}
              <Card variant="default" padding="md">
                <CardHeader>
                  <CardTitle className="text-base">Property Details</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Owner", value: property.ownerName },
                    { label: "Contact", value: property.ownerEmail },
                    { label: "Roof Type", value: property.roofType },
                    { label: "Stories", value: property.stories.toString() },
                    { label: "Last Inspection", value: formatDate(property.lastInspectionDate) },
                    { label: "Added to Platform", value: formatDate(property.createdAt) },
                  ].map((detail) => (
                    <div key={detail.label}>
                      <p className="text-xs text-slate-500 mb-0.5">{detail.label}</p>
                      <p className="text-sm text-slate-200">{detail.value}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Damage Summary */}
              <Card variant="default" padding="md">
                <CardHeader>
                  <CardTitle className="text-base">Damage Summary</CardTitle>
                  <CardDescription>{inspections.length} inspections completed</CardDescription>
                </CardHeader>
                <div className="space-y-3">
                  {inspections[0].damageItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/20"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusVariant(item.severity)} size="sm">
                          {item.severity}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium text-white">{item.type} Damage</p>
                          <p className="text-xs text-slate-400">{item.location}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-white">{formatCurrency(item.cost)}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Active Claim */}
              <Card variant="default" padding="md">
                <CardHeader>
                  <CardTitle className="text-base">Active Claim</CardTitle>
                  <Badge variant={getStatusVariant(claim.status)} dot>
                    {formatStatus(claim.status)}
                  </Badge>
                </CardHeader>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    { label: "Claim Number", value: claim.claimNumber },
                    { label: "Carrier", value: claim.carrier },
                    { label: "Filed Date", value: formatDate(claim.filedDate) },
                    { label: "Adjuster", value: claim.adjusterName },
                    { label: "Amount Claimed", value: formatCurrency(claim.claimedAmount) },
                    { label: "Amount Approved", value: claim.approvedAmount ? formatCurrency(claim.approvedAmount) : "Pending" },
                  ].map((detail) => (
                    <div key={detail.label}>
                      <p className="text-xs text-slate-500 mb-0.5">{detail.label}</p>
                      <p className="text-sm text-slate-200">{detail.value}</p>
                    </div>
                  ))}
                </div>
                <Link href={`/insurance/${claim.id}`}>
                  <Button variant="outline" size="sm">
                    View Full Claim Details
                  </Button>
                </Link>
              </Card>
            </div>
          )}

          {activeTab === "inspections" && (
            <div className="space-y-4">
              {inspections.map((inspection) => (
                <Card key={inspection.id} variant="default" padding="md">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge variant="info">{formatStatus(inspection.type)}</Badge>
                      <CardTitle className="text-base">{formatDate(inspection.date)}</CardTitle>
                    </div>
                    <Badge variant={getStatusVariant(inspection.severity)}>
                      {inspection.severity}
                    </Badge>
                  </CardHeader>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {inspection.findings}
                  </p>
                  <div className="space-y-2 mb-4">
                    {inspection.damageItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 px-3 rounded bg-slate-800/30"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusVariant(item.severity)} size="sm">
                            {item.severity}
                          </Badge>
                          <span className="text-sm text-slate-300">
                            {item.type} — {item.location}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-white">
                          {formatCurrency(item.cost)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      {inspection.photoCount} photos
                    </span>
                    <span>Inspector: {inspection.inspector}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "claims" && (
            <Card variant="default" padding="md">
              <CardHeader>
                <CardTitle className="text-base">
                  {claim.claimNumber} — {claim.carrier}
                </CardTitle>
                <Badge variant={getStatusVariant(claim.status)} dot>
                  {formatStatus(claim.status)}
                </Badge>
              </CardHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Claimed Amount</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(claim.claimedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Status</p>
                    <p className="text-lg font-bold text-amber-400">Pending Review</p>
                  </div>
                </div>
                <div className="border-t border-slate-700/30 pt-4">
                  <p className="text-sm font-medium text-white mb-3">Carrier Interactions</p>
                  <div className="space-y-3">
                    {claim.interactions.map((interaction, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-slate-300">{interaction.summary}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {interaction.date} &middot; {interaction.type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "documents" && (
            <Card variant="default" padding="lg">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Document Management
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                  Upload and manage inspection photos, carrier correspondence, 
                  scope documents, and compliance records.
                </p>
                <Button variant="primary" icon={<Upload className="w-4 h-4" />}>
                  Upload Documents
                </Button>
              </div>
            </Card>
          )}

          {activeTab === "timeline" && (
            <Card variant="default" padding="md">
              <CardHeader>
                <CardTitle className="text-base">Property Timeline</CardTitle>
                <CardDescription>Complete event history</CardDescription>
              </CardHeader>
              <div className="relative ml-2 border-l border-slate-700/50 pl-6 space-y-6">
                {timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    <div
                      className={cn(
                        "absolute -left-[29px] w-3 h-3 rounded-full border-2",
                        event.type === "milestone" && "bg-brand-500 border-brand-400",
                        event.type === "update" && "bg-blue-500 border-blue-400",
                        event.type === "alert" && "bg-red-500 border-red-400"
                      )}
                    />
                    <p className="text-xs text-slate-500 mb-0.5">{event.date}</p>
                    <p className={cn(
                      "text-sm",
                      event.type === "alert" ? "text-red-300" : "text-slate-300"
                    )}>
                      {event.event}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* ATOS Panel */}
        <div className="lg:col-span-1">
          <ATOSPanel
            context="PROPERTY_OVERVIEW"
            initialInsights={[
              { type: "risk", text: "HVAC scope discrepancy of $35,200 — prepare supplemental documentation" },
              { type: "recommendation", text: "Carrier adjuster visit scheduled for Feb 12 — ensure all damage areas are accessible" },
              { type: "opportunity", text: "2nd floor water damage from follow-up inspection adds $12,700 to scope" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
