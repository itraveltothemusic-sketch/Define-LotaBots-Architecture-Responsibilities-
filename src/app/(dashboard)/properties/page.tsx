import {
  Building2,
  Plus,
  Search,
  Filter,
  ArrowRight,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, getPropertyStatusVariant } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { mockProperties, mockClaims, mockInspections } from "@/lib/db/mock-data";
import Link from "next/link";

/**
 * Properties List Page — Forensic Property Module entry point.
 *
 * Shows all managed properties with:
 * - Visual status indicators
 * - Key financial data (pre-event value, claim amount)
 * - Storm event information
 * - Quick access to property detail
 *
 * Designed for rapid scanning — a user should be able to
 * assess the state of their entire portfolio in 10 seconds.
 */
export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Properties</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Forensic property profiles, inspections, and damage documentation
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Add Property
        </Button>
      </div>

      {/* Filters bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by address, city, or status..."
            className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-slate-400"
          />
        </div>
        <Button variant="secondary" size="sm">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </Button>
      </div>

      {/* Properties grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockProperties.map((property) => {
          const status = getPropertyStatusVariant(property.status);
          const claim = mockClaims.find((c) => c.propertyId === property.id);
          const inspection = mockInspections.find((i) => i.propertyId === property.id);
          const damageCount = inspection?.damageAreas.length || 0;
          const totalDamageEstimate = inspection?.damageAreas.reduce(
            (sum, da) => sum + (da.estimatedRepairCost || 0),
            0
          ) || 0;

          return (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group block"
            >
              <Card className="hover:shadow-md hover:border-slate-200 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-emerald-50 transition-colors">
                      <Building2 className="w-6 h-6 text-slate-500 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {property.address}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {property.city}, {property.state} {property.zipCode}
                      </div>
                    </div>
                  </div>
                  <StatusBadge label={status.label} variant={status.variant} size="md" />
                </div>

                {/* Property stats grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-slate-50">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                      Pre-Event Value
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {property.preEventValue
                        ? formatCurrency(property.preEventValue)
                        : "—"}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                      Damage Est.
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {totalDamageEstimate > 0
                        ? formatCurrency(totalDamageEstimate)
                        : "—"}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                      Claim Amount
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {claim?.claimedAmount
                        ? formatCurrency(claim.claimedAmount)
                        : "—"}
                    </div>
                  </div>
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {property.stormEventDate
                        ? formatDate(property.stormEventDate)
                        : "No event"}
                    </span>
                    <span className="capitalize">
                      {property.propertyType.replace("_", " ")}
                    </span>
                    {property.squareFootage && (
                      <span>
                        {property.squareFootage.toLocaleString()} sq ft
                      </span>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>

                {/* Storm event tag */}
                {property.stormEventType && (
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[11px] font-medium text-amber-700">
                      {property.stormEventType}
                    </span>
                    {damageCount > 0 && (
                      <span className="text-[10px] text-amber-500 ml-auto">
                        {damageCount} damage area{damageCount !== 1 ? "s" : ""} documented
                      </span>
                    )}
                  </div>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
