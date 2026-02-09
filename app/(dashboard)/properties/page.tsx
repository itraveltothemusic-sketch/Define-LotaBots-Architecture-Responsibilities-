/**
 * Properties Page
 * 
 * Comprehensive property management interface showing all properties
 * with their status, claims, and key metrics.
 */

import { getCurrentUser } from "@/lib/auth/session";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { 
  PlusIcon, 
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency, formatDate, formatEnumLabel } from "@/lib/utils/format";

export default async function PropertiesPage() {
  const user = await getCurrentUser();

  // Mock data - will be replaced with real database queries
  const properties = [
    {
      id: "1",
      name: "1401 Main Street Office Complex",
      address: "1401 Main Street, Dallas, TX 75201",
      propertyType: "Office",
      status: "work_in_progress",
      stormDate: new Date("2024-06-15"),
      stormType: "Hurricane",
      squareFeet: 45000,
      preStormValue: 8500000,
      estimatedDamageValue: 450000,
      claimCount: 1,
      documentCount: 47,
    },
    {
      id: "2",
      name: "789 Commerce Boulevard Retail Center",
      address: "789 Commerce Boulevard, Houston, TX 77002",
      propertyType: "Retail",
      status: "claim_filed",
      stormDate: new Date("2024-07-22"),
      stormType: "Tornado",
      squareFeet: 62000,
      preStormValue: 12300000,
      estimatedDamageValue: 890000,
      claimCount: 1,
      documentCount: 89,
    },
    {
      id: "3",
      name: "555 Industrial Way Warehouse",
      address: "555 Industrial Way, Austin, TX 78701",
      propertyType: "Warehouse",
      status: "under_review",
      stormDate: new Date("2024-05-10"),
      stormType: "Hail Storm",
      squareFeet: 125000,
      preStormValue: 15800000,
      estimatedDamageValue: 320000,
      claimCount: 1,
      documentCount: 34,
    },
    {
      id: "4",
      name: "2200 Technology Drive Tech Campus",
      address: "2200 Technology Drive, San Antonio, TX 78205",
      propertyType: "Office",
      status: "inspection",
      stormDate: new Date("2024-08-01"),
      stormType: "Wind Damage",
      squareFeet: 95000,
      preStormValue: 22000000,
      estimatedDamageValue: 680000,
      claimCount: 0,
      documentCount: 12,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      intake: { variant: "default", label: "Intake" },
      inspection: { variant: "info", label: "Inspection" },
      documentation: { variant: "info", label: "Documentation" },
      claim_filed: { variant: "warning", label: "Claim Filed" },
      under_review: { variant: "warning", label: "Under Review" },
      approved: { variant: "success", label: "Approved" },
      work_in_progress: { variant: "info", label: "Work In Progress" },
      completed: { variant: "success", label: "Completed" },
      closed: { variant: "default", label: "Closed" },
    };
    const statusInfo = statusMap[status] || { variant: "default", label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties</h1>
          <p className="text-gray-600">
            Manage all commercial properties and track their restoration progress
          </p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button variant="primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total Properties</p>
            <p className="text-3xl font-bold text-gray-900">{properties.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total Value</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(properties.reduce((sum, p) => sum + p.preStormValue, 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total Damage</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(properties.reduce((sum, p) => sum + p.estimatedDamageValue, 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Avg Recovery Time</p>
            <p className="text-3xl font-bold text-gray-900">127</p>
            <p className="text-sm text-gray-500">days</p>
          </CardContent>
        </Card>
      </div>

      {/* Properties Grid */}
      <div className="grid gap-6">
        {properties.map((property) => (
          <Card key={property.id} variant="elevated" className="hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BuildingOfficeIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {property.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {property.address}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Storm: {formatDate(property.stormDate)}
                      </div>
                    </div>
                  </div>
                </div>
                {getStatusBadge(property.status)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Property Type</p>
                  <p className="text-sm font-medium text-gray-900">{property.propertyType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Square Feet</p>
                  <p className="text-sm font-medium text-gray-900">
                    {property.squareFeet.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pre-Storm Value</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(property.preStormValue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Estimated Damage</p>
                  <p className="text-sm font-medium text-red-600">
                    {formatCurrency(property.estimatedDamageValue)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-6 text-sm">
                  <div>
                    <span className="text-gray-600">Storm Type: </span>
                    <span className="font-medium text-gray-900">{property.stormType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Claims: </span>
                    <span className="font-medium text-gray-900">{property.claimCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Documents: </span>
                    <span className="font-medium text-gray-900">{property.documentCount}</span>
                  </div>
                </div>
                <Link href={`/dashboard/properties/${property.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
