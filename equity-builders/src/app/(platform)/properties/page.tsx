"use client";

/**
 * Properties Module — Forensic Property Profiles
 * 
 * Lists all properties with filtering, search, and status indicators.
 * Each card provides a quick overview with navigation to the full profile.
 */

import { useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { properties } from "@/lib/mock-data";
import { formatCurrency, formatStatus, cn } from "@/lib/utils";
import {
  Building2,
  MapPin,
  Cloud,
  Calendar,
  Ruler,
  ChevronRight,
  Plus,
  Filter,
  Search,
} from "lucide-react";
import type { PropertyStatus } from "@/types";

const statusFilters: { label: string; value: PropertyStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Intake", value: "intake" },
  { label: "Inspection", value: "inspection" },
  { label: "Assessment", value: "assessment" },
  { label: "Claim Filed", value: "claim_filed" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Approved", value: "approved" },
  { label: "In Repair", value: "in_repair" },
  { label: "Completed", value: "completed" },
  { label: "Equity Verified", value: "equity_verified" },
];

const statusBadgeVariant = (status: PropertyStatus) => {
  if (status === "equity_verified" || status === "completed") return "success" as const;
  if (status === "negotiation" || status === "claim_filed") return "warning" as const;
  if (status === "inspection" || status === "assessment" || status === "in_repair") return "info" as const;
  return "neutral" as const;
};

export default function PropertiesPage() {
  const [filter, setFilter] = useState<PropertyStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = properties.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <Topbar
        title="Forensic Property Profiles"
        subtitle="Manage properties, inspections, and damage documentation"
      />

      <div className="p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
            <input
              type="text"
              placeholder="Search by name, address, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy-800/60 border border-navy-700/50 rounded-lg text-sm text-navy-200 placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 transition-colors"
            />
          </div>
          <Button>
            <Plus className="w-4 h-4" />
            Add Property
          </Button>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-navy-500 flex-shrink-0" />
          {statusFilters.map((sf) => (
            <button
              key={sf.value}
              onClick={() => setFilter(sf.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap",
                filter === sf.value
                  ? "bg-brand-600/15 text-brand-300 border-brand-500/30"
                  : "bg-navy-800/40 text-navy-400 border-navy-700/40 hover:text-navy-200 hover:border-navy-600",
              )}
            >
              {sf.label}
            </button>
          ))}
        </div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((property) => (
            <Link key={property.id} href={`/properties/${property.id}`}>
              <Card hover className="p-5 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-brand-400" />
                  </div>
                  <Badge variant={statusBadgeVariant(property.status)} size="sm">
                    {formatStatus(property.status)}
                  </Badge>
                </div>

                <h3 className="text-base font-semibold text-white mb-1 group-hover:text-brand-300">
                  {property.name}
                </h3>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-navy-400">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{property.address}, {property.city}, {property.state} {property.zip}</span>
                  </div>
                  {property.stormDate && (
                    <div className="flex items-center gap-1.5 text-xs text-navy-400">
                      <Cloud className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{property.stormType}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-navy-400">
                    <Ruler className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{property.squareFootage.toLocaleString()} sq ft &middot; Built {property.yearBuilt}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-navy-700/40">
                  <div>
                    <p className="text-[11px] text-navy-500">Estimated Value</p>
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(property.estimatedValue)}
                    </p>
                  </div>
                  <div className="text-xs text-navy-500 capitalize">
                    {property.propertyType}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-10 h-10 text-navy-600 mx-auto mb-3" />
            <p className="text-navy-400">No properties match your criteria</p>
            <p className="text-xs text-navy-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
