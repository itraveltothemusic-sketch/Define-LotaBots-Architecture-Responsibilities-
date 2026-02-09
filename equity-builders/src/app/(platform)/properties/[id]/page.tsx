"use client";

/**
 * Property Detail Page — Full forensic property profile.
 * 
 * Shows the complete picture for a single property:
 * - Property info and status
 * - Inspection findings and damage classification
 * - Evidence documentation
 * - Related insurance claim
 * - ATOS intelligence specific to this property
 * - Timeline of all events
 */

import { use } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AtosPanel } from "@/components/atos/atos-panel";
import { Timeline } from "@/components/dashboard/timeline";
import { properties, inspections, insuranceClaims, evidence } from "@/lib/mock-data";
import { formatCurrency, formatStatus, cn } from "@/lib/utils";
import {
  Building2,
  MapPin,
  Cloud,
  Calendar,
  Ruler,
  ArrowLeft,
  Camera,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Shield,
  ExternalLink,
} from "lucide-react";
import type { DamageClassification } from "@/types";

const damageColors: Record<DamageClassification, string> = {
  wind: "bg-brand-500/15 text-brand-300 border-brand-500/25",
  hail: "bg-alert-500/15 text-alert-300 border-alert-500/25",
  water: "bg-brand-400/15 text-brand-200 border-brand-400/25",
  structural: "bg-danger-500/15 text-danger-300 border-danger-500/25",
  roof: "bg-alert-400/15 text-alert-200 border-alert-400/25",
  facade: "bg-navy-400/15 text-navy-200 border-navy-400/25",
  interior: "bg-forensic-500/15 text-forensic-300 border-forensic-500/25",
  electrical: "bg-danger-400/15 text-danger-200 border-danger-400/25",
  plumbing: "bg-brand-300/15 text-brand-100 border-brand-300/25",
  hvac: "bg-alert-500/15 text-alert-300 border-alert-500/25",
  other: "bg-navy-500/15 text-navy-200 border-navy-500/25",
};

const severityColors: Record<string, string> = {
  minor: "text-forensic-400",
  moderate: "text-alert-400",
  severe: "text-alert-500",
  catastrophic: "text-danger-400",
};

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <div>
        <Topbar title="Property Not Found" />
        <div className="p-6 text-center py-20">
          <Building2 className="w-12 h-12 text-navy-600 mx-auto mb-4" />
          <p className="text-navy-400 text-lg">Property not found</p>
          <Link href="/properties" className="text-brand-400 hover:text-brand-300 text-sm mt-2 inline-block">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const propertyInspections = inspections.filter((i) => i.propertyId === id);
  const propertyClaim = insuranceClaims.find((c) => c.propertyId === id);
  const propertyEvidence = evidence.filter((e) => e.propertyId === id);

  // Calculate a rough lifecycle progress percentage
  const statusProgress: Record<string, number> = {
    intake: 5,
    inspection: 15,
    assessment: 25,
    claim_filed: 40,
    negotiation: 55,
    approved: 70,
    in_repair: 85,
    completed: 95,
    equity_verified: 100,
  };

  return (
    <div>
      <Topbar
        title={property.name}
        subtitle={`${property.address}, ${property.city}, ${property.state} ${property.zip}`}
      />

      <div className="p-6 space-y-6">
        {/* Back Navigation */}
        <Link
          href="/properties"
          className="inline-flex items-center gap-1.5 text-sm text-navy-400 hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Link>

        {/* Property Header Card */}
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Property Icon / Image Placeholder */}
            <div className="w-20 h-20 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-10 h-10 text-brand-400" />
            </div>

            {/* Property Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">{property.name}</h1>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <span className="text-sm text-navy-400 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {property.address}, {property.city}, {property.state} {property.zip}
                    </span>
                    <span className="text-sm text-navy-400 flex items-center gap-1.5">
                      <Ruler className="w-4 h-4" />
                      {property.squareFootage.toLocaleString()} sq ft
                    </span>
                    <span className="text-sm text-navy-400 capitalize">
                      {property.propertyType} &middot; Built {property.yearBuilt}
                    </span>
                  </div>
                </div>
                <Badge
                  variant={
                    property.status === "equity_verified" ? "success" :
                    property.status === "negotiation" || property.status === "claim_filed" ? "warning" :
                    "info"
                  }
                  size="md"
                >
                  {formatStatus(property.status)}
                </Badge>
              </div>

              {/* Storm Info */}
              {property.stormDate && (
                <div className="flex items-center gap-4 mt-4 p-3 bg-navy-800/40 rounded-lg border border-navy-700/30">
                  <Cloud className="w-5 h-5 text-alert-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">{property.stormType}</p>
                    <p className="text-xs text-navy-400">
                      Storm date: {new Date(property.stormDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>
              )}

              {/* Progress */}
              <div className="mt-4">
                <ProgressBar
                  value={statusProgress[property.status] || 0}
                  label="Lifecycle Progress"
                  color={property.status === "equity_verified" ? "forensic" : "brand"}
                />
              </div>
            </div>

            {/* Key Values */}
            <div className="grid grid-cols-2 gap-4 lg:w-64 flex-shrink-0">
              <div className="p-3 bg-navy-800/40 rounded-lg border border-navy-700/30">
                <p className="text-[11px] text-navy-500 uppercase tracking-wider">Est. Value</p>
                <p className="text-lg font-bold text-white mt-0.5">
                  {formatCurrency(property.estimatedValue)}
                </p>
              </div>
              {propertyClaim && (
                <div className="p-3 bg-navy-800/40 rounded-lg border border-navy-700/30">
                  <p className="text-[11px] text-navy-500 uppercase tracking-wider">Claimed</p>
                  <p className="text-lg font-bold text-white mt-0.5">
                    {formatCurrency(propertyClaim.claimedAmount)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column (2/3) */}
          <div className="xl:col-span-2 space-y-6">
            {/* Inspection Findings */}
            {propertyInspections.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-sm font-semibold text-white">Forensic Inspection Findings</h3>
                  <p className="text-xs text-navy-400 mt-0.5">
                    {propertyInspections.length} inspection{propertyInspections.length !== 1 ? "s" : ""} on record
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {propertyInspections.map((inspection) => (
                    <div key={inspection.id} className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {inspection.inspectorName}
                          </p>
                          <p className="text-xs text-navy-400">
                            {new Date(inspection.inspectionDate).toLocaleDateString("en-US", {
                              year: "numeric", month: "long", day: "numeric"
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={inspection.status === "completed" ? "success" : "info"}
                            size="sm"
                          >
                            {formatStatus(inspection.status)}
                          </Badge>
                          <span className={cn("text-sm font-semibold capitalize", severityColors[inspection.severity])}>
                            {inspection.severity}
                          </span>
                        </div>
                      </div>

                      {/* Damage Classifications */}
                      <div className="flex flex-wrap gap-1.5">
                        {inspection.damageClassifications.map((dc) => (
                          <span
                            key={dc}
                            className={cn(
                              "text-xs font-medium px-2 py-0.5 rounded-full border capitalize",
                              damageColors[dc],
                            )}
                          >
                            {dc}
                          </span>
                        ))}
                      </div>

                      {/* Findings */}
                      <p className="text-sm text-navy-200 leading-relaxed bg-navy-800/30 p-3 rounded-lg border border-navy-700/20">
                        {inspection.findings}
                      </p>

                      {/* Inspection Metrics */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 text-xs text-navy-400">
                          <Camera className="w-3.5 h-3.5" />
                          {inspection.photoCount} photos
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-navy-400">
                          <FileText className="w-3.5 h-3.5" />
                          {inspection.documentCount} documents
                        </div>
                        <div className="text-xs text-navy-400">
                          Est. repair: <span className="text-white font-medium">{formatCurrency(inspection.estimatedRepairCost)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Insurance Claim */}
            {propertyClaim && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Insurance Claim</h3>
                      <p className="text-xs text-navy-400 mt-0.5 font-mono">
                        {propertyClaim.claimNumber}
                      </p>
                    </div>
                    <Link href={`/insurance/${propertyClaim.id}`}>
                      <Button variant="secondary" size="sm">
                        View Full Claim
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-[11px] text-navy-500 uppercase tracking-wider">Carrier</p>
                      <p className="text-sm font-medium text-white mt-0.5">{propertyClaim.carrier}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-navy-500 uppercase tracking-wider">Status</p>
                      <p className="mt-0.5">
                        <Badge
                          variant={
                            propertyClaim.status === "settled" || propertyClaim.status === "approved"
                              ? "success"
                              : propertyClaim.status === "denied"
                              ? "danger"
                              : "warning"
                          }
                          size="sm"
                        >
                          {formatStatus(propertyClaim.status)}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-navy-500 uppercase tracking-wider">Claimed</p>
                      <p className="text-sm font-semibold text-white mt-0.5">
                        {formatCurrency(propertyClaim.claimedAmount)}
                      </p>
                    </div>
                    {propertyClaim.approvedAmount !== undefined && (
                      <div>
                        <p className="text-[11px] text-navy-500 uppercase tracking-wider">Approved</p>
                        <p className="text-sm font-semibold text-forensic-400 mt-0.5">
                          {formatCurrency(propertyClaim.approvedAmount)}
                        </p>
                      </div>
                    )}
                  </div>
                  {propertyClaim.notes && (
                    <p className="text-sm text-navy-200 leading-relaxed bg-navy-800/30 p-3 rounded-lg border border-navy-700/20">
                      {propertyClaim.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Evidence */}
            {propertyEvidence.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Evidence & Documentation</h3>
                      <p className="text-xs text-navy-400 mt-0.5">
                        {propertyEvidence.length} items documented
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Camera className="w-3.5 h-3.5" />
                      Upload Evidence
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {propertyEvidence.map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center gap-3 p-3 bg-navy-800/30 rounded-lg border border-navy-700/20 hover:border-navy-600/40 transition-colors"
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                          ev.type === "photo" ? "bg-brand-500/15 text-brand-400" : "bg-forensic-500/15 text-forensic-400",
                        )}>
                          {ev.type === "photo" ? <Camera className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{ev.title}</p>
                          <p className="text-xs text-navy-400">
                            {ev.uploadedBy} &middot; {new Date(ev.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {ev.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-navy-700/50 text-navy-300 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-6">
            <AtosPanel propertyId={id} />
            <Timeline propertyId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
