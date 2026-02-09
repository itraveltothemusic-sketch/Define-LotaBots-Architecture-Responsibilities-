/**
 * Properties List Page
 * 
 * The master view of all properties in the portfolio.
 * Provides filtering, sorting, and quick access to each property's
 * detail view. Designed for rapid scanning and triage.
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  ArrowUpDown,
  Eye,
  MoreVertical,
  Camera,
  FileText,
  Shield,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, getStatusVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatStatus, formatDate, formatSquareFeet } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";
import type { PropertyStatus, PropertyType } from "@/types";

interface PropertyListItem {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  ownerName: string;
  squareFootage: number;
  yearBuilt: number;
  estimatedValue: number;
  roofType: string;
  inspectionCount: number;
  claimCount: number;
  lastActivity: string;
  createdAt: string;
}

/**
 * Demo property data reflecting realistic commercial property scenarios.
 */
const properties: PropertyListItem[] = [
  {
    id: "1",
    address: "450 Commerce Blvd",
    city: "Dallas",
    state: "TX",
    zipCode: "75201",
    propertyType: "COMMERCIAL",
    status: "CLAIM_FILED",
    ownerName: "Sarah Chen",
    squareFootage: 28000,
    yearBuilt: 2004,
    estimatedValue: 2_400_000,
    roofType: "Modified Bitumen",
    inspectionCount: 2,
    claimCount: 1,
    lastActivity: "2024-02-08",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    address: "1200 Industrial Pkwy",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    propertyType: "INDUSTRIAL",
    status: "IN_REPAIR",
    ownerName: "James Wilson",
    squareFootage: 65000,
    yearBuilt: 1998,
    estimatedValue: 5_100_000,
    roofType: "TPO Membrane",
    inspectionCount: 3,
    claimCount: 2,
    lastActivity: "2024-02-07",
    createdAt: "2023-12-10",
  },
  {
    id: "3",
    address: "890 Retail Center Dr",
    city: "San Antonio",
    state: "TX",
    zipCode: "78201",
    propertyType: "RETAIL",
    status: "INSPECTION",
    ownerName: "Maria Garcia",
    squareFootage: 15000,
    yearBuilt: 2012,
    estimatedValue: 1_850_000,
    roofType: "Standing Seam Metal",
    inspectionCount: 1,
    claimCount: 0,
    lastActivity: "2024-02-06",
    createdAt: "2024-01-28",
  },
  {
    id: "4",
    address: "2100 Office Park Ln",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    propertyType: "OFFICE",
    status: "EQUITY_VERIFIED",
    ownerName: "David Kim",
    squareFootage: 42000,
    yearBuilt: 2008,
    estimatedValue: 3_200_000,
    roofType: "EPDM",
    inspectionCount: 3,
    claimCount: 1,
    lastActivity: "2024-02-05",
    createdAt: "2023-11-20",
  },
  {
    id: "5",
    address: "675 Warehouse Row",
    city: "Fort Worth",
    state: "TX",
    zipCode: "76102",
    propertyType: "WAREHOUSE",
    status: "UNDER_REVIEW",
    ownerName: "Sarah Chen",
    squareFootage: 80000,
    yearBuilt: 1995,
    estimatedValue: 1_500_000,
    roofType: "Built-Up Roof (BUR)",
    inspectionCount: 1,
    claimCount: 1,
    lastActivity: "2024-02-04",
    createdAt: "2024-01-20",
  },
  {
    id: "6",
    address: "320 Tech Campus Way",
    city: "Plano",
    state: "TX",
    zipCode: "75024",
    propertyType: "OFFICE",
    status: "INTAKE",
    ownerName: "Lisa Thompson",
    squareFootage: 35000,
    yearBuilt: 2015,
    estimatedValue: 4_200_000,
    roofType: "TPO Membrane",
    inspectionCount: 0,
    claimCount: 0,
    lastActivity: "2024-02-09",
    createdAt: "2024-02-09",
  },
];

const statusFilters: { value: PropertyStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Properties" },
  { value: "INTAKE", label: "Intake" },
  { value: "INSPECTION", label: "Inspection" },
  { value: "CLAIM_FILED", label: "Claim Filed" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "IN_REPAIR", label: "In Repair" },
  { value: "COMPLETED", label: "Completed" },
  { value: "EQUITY_VERIFIED", label: "Verified" },
];

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = filteredProperties.reduce(
    (sum, p) => sum + p.estimatedValue,
    0
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-500/10">
              <Building2 className="w-5 h-5 text-brand-400" />
            </div>
            Properties
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {filteredProperties.length} properties &middot; {formatCurrency(totalValue)} total estimated value
          </p>
        </div>
        <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
          Add Property
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by address, city, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {statusFilters.slice(0, 6).map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                "text-xs px-3 py-2 rounded-lg border whitespace-nowrap transition-colors",
                statusFilter === filter.value
                  ? "bg-brand-600/20 border-brand-500/30 text-brand-300"
                  : "bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Table */}
      <Card variant="default" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/30">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                  Property
                </th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                  Type
                </th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                  Owner
                </th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                  Size / Year
                </th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                  Est. Value
                </th>
                <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                  Evidence
                </th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20">
              {filteredProperties.map((property) => (
                <tr
                  key={property.id}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <Link href={`/properties/${property.id}`} className="block">
                      <p className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors">
                        {property.address}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {property.city}, {property.state} {property.zipCode}
                      </p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">
                      {formatStatus(property.propertyType)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusVariant(property.status)} dot size="sm">
                      {formatStatus(property.status)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">{property.ownerName}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm text-slate-300">
                      {formatSquareFeet(property.squareFootage)}
                    </p>
                    <p className="text-xs text-slate-500">Built {property.yearBuilt}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-white">
                      {formatCurrency(property.estimatedValue)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500" title="Inspections">
                        <Camera className="w-3 h-3" />
                        <span>{property.inspectionCount}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500" title="Claims">
                        <Shield className="w-3 h-3" />
                        <span>{property.claimCount}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/properties/${property.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProperties.length === 0 && (
          <div className="py-16 text-center">
            <Building2 className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">No properties match your search criteria</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </Card>
    </div>
  );
}
