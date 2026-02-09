"use client";

/**
 * Property overview list for the Intelligence Center dashboard.
 * Shows all properties with their current status, claim info, and key metrics.
 */

import Link from "next/link";
import {
  Building2,
  MapPin,
  Calendar,
  ChevronRight,
  Cloud,
} from "lucide-react";
import { cn, formatCurrency, formatStatus, getStatusColor } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { properties } from "@/lib/mock-data";
import type { Property } from "@/types";

function PropertyRow({ property }: { property: Property }) {
  const statusColor = getStatusColor(property.status);
  
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group flex items-center gap-4 px-4 py-3 hover:bg-navy-800/40 transition-colors rounded-lg cursor-pointer">
        {/* Property Icon */}
        <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-brand-400" />
        </div>

        {/* Property Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-white truncate group-hover:text-brand-300 transition-colors">
              {property.name}
            </h4>
            <Badge
              variant={
                property.status === "equity_verified"
                  ? "success"
                  : property.status === "negotiation" || property.status === "claim_filed"
                  ? "warning"
                  : property.status === "inspection" || property.status === "assessment"
                  ? "info"
                  : "neutral"
              }
              size="sm"
            >
              {formatStatus(property.status)}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-navy-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {property.city}, {property.state}
            </span>
            {property.stormDate && (
              <span className="text-xs text-navy-400 flex items-center gap-1">
                <Cloud className="w-3 h-3" />
                {property.stormType?.split("—")[0].trim()}
              </span>
            )}
          </div>
        </div>

        {/* Value */}
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-white">
            {formatCurrency(property.estimatedValue)}
          </p>
          <p className="text-xs text-navy-400">
            {property.squareFootage.toLocaleString()} sq ft
          </p>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-4 h-4 text-navy-600 group-hover:text-navy-400 transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}

export function PropertyList() {
  return (
    <Card>
      <div className="px-5 py-4 border-b border-navy-700/50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Active Properties</h3>
          <p className="text-xs text-navy-400 mt-0.5">
            {properties.length} properties under management
          </p>
        </div>
        <Link
          href="/properties"
          className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
        >
          View All
        </Link>
      </div>
      <div className="p-2 space-y-0.5">
        {properties.map((property) => (
          <PropertyRow key={property.id} property={property} />
        ))}
      </div>
    </Card>
  );
}
