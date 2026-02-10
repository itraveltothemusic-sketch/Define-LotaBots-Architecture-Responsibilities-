/**
 * Contractors Page
 * 
 * Contractor management interface showing verified contractors,
 * work orders, and performance metrics.
 */

import { getCurrentUser } from "@/lib/auth/session";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { 
  PlusIcon,
  UserGroupIcon,
  StarIcon,
  CheckBadgeIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

export default async function ContractorsPage() {
  const user = await getCurrentUser();

  // Mock data - will be replaced with real database queries
  const contractors = [
    {
      id: "1",
      companyName: "ABC Roofing & Restoration Inc",
      contactName: "Michael Johnson",
      email: "mike@abcroofing.com",
      phone: "(555) 123-4567",
      licenseNumber: "TX-ROOF-12345",
      licenseState: "TX",
      status: "active",
      rating: 4.8,
      specialties: ["Roofing", "Structural", "Water Damage"],
      completedProjects: 47,
      activeWorkOrders: 3,
      insuranceVerified: true,
      joinedDate: new Date("2023-03-15"),
    },
    {
      id: "2",
      companyName: "Premier HVAC Solutions",
      contactName: "Sarah Martinez",
      email: "sarah@premierhvac.com",
      phone: "(555) 234-5678",
      licenseNumber: "TX-HVAC-67890",
      licenseState: "TX",
      status: "active",
      rating: 4.9,
      specialties: ["HVAC", "Electrical", "Mechanical"],
      completedProjects: 62,
      activeWorkOrders: 5,
      insuranceVerified: true,
      joinedDate: new Date("2022-11-20"),
    },
    {
      id: "3",
      companyName: "Elite Construction & Repair",
      contactName: "David Chen",
      email: "david@eliteconstruction.com",
      phone: "(555) 345-6789",
      licenseNumber: "TX-GEN-45678",
      licenseState: "TX",
      status: "verified",
      rating: 4.7,
      specialties: ["General Construction", "Structural", "Fire Damage"],
      completedProjects: 89,
      activeWorkOrders: 2,
      insuranceVerified: true,
      joinedDate: new Date("2021-06-10"),
    },
    {
      id: "4",
      companyName: "Rapid Response Restoration",
      contactName: "Jennifer Williams",
      email: "jennifer@rapidresponse.com",
      phone: "(555) 456-7890",
      licenseNumber: "TX-REST-23456",
      licenseState: "TX",
      status: "pending",
      rating: null,
      specialties: ["Water Damage", "Mold Remediation", "Emergency Services"],
      completedProjects: 0,
      activeWorkOrders: 0,
      insuranceVerified: false,
      joinedDate: new Date("2024-08-25"),
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      pending: { variant: "warning", label: "Pending Verification" },
      verified: { variant: "info", label: "Verified" },
      active: { variant: "success", label: "Active" },
      suspended: { variant: "danger", label: "Suspended" },
      inactive: { variant: "default", label: "Inactive" },
    };
    const statusInfo = statusMap[status] || { variant: "default", label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contractors</h1>
          <p className="text-gray-600">
            Manage verified contractors and coordinate restoration work
          </p>
        </div>
        <Link href="/dashboard/contractors/invite">
          <Button variant="primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Invite Contractor
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total Contractors</p>
            <p className="text-3xl font-bold text-gray-900">{contractors.length}</p>
            <p className="text-sm text-green-600 mt-1">
              {contractors.filter((c) => c.status === "active").length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Active Work Orders</p>
            <p className="text-3xl font-bold text-gray-900">
              {contractors.reduce((sum, c) => sum + c.activeWorkOrders, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Completed Projects</p>
            <p className="text-3xl font-bold text-gray-900">
              {contractors.reduce((sum, c) => sum + c.completedProjects, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
            <p className="text-3xl font-bold text-gray-900">
              {(
                contractors
                  .filter((c) => c.rating !== null)
                  .reduce((sum, c) => sum + (c.rating || 0), 0) /
                contractors.filter((c) => c.rating !== null).length
              ).toFixed(1)}
            </p>
            <div className="flex items-center mt-1">
              <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contractors Grid */}
      <div className="grid gap-6">
        {contractors.map((contractor) => (
          <Card key={contractor.id} variant="elevated" className="hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {contractor.companyName}
                      </h3>
                      {getStatusBadge(contractor.status)}
                      {contractor.insuranceVerified && (
                        <CheckBadgeIcon className="h-5 w-5 text-green-600" title="Insurance Verified" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Contact: {contractor.contactName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {contractor.email} • {contractor.phone}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {contractor.rating && (
                    <div className="flex items-center space-x-1 mb-2">
                      <StarIcon className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-lg font-bold text-gray-900">{contractor.rating}</span>
                    </div>
                  )}
                  <Link href={`/dashboard/contractors/${contractor.id}`}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">License</p>
                  <p className="text-sm font-medium text-gray-900">
                    {contractor.licenseNumber}
                  </p>
                  <p className="text-xs text-gray-500">{contractor.licenseState}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Completed Projects</p>
                  <p className="text-sm font-medium text-gray-900">
                    {contractor.completedProjects}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Active Work Orders</p>
                  <p className="text-sm font-medium text-primary-600">
                    {contractor.activeWorkOrders}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Joined</p>
                  <p className="text-sm font-medium text-gray-900">
                    {contractor.joinedDate.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {contractor.specialties.map((specialty, index) => (
                    <Badge key={index} variant="info" size="sm">
                      <WrenchScrewdriverIcon className="h-3 w-3 mr-1 inline" />
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {contractor.status === "pending" && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 font-medium">
                    Verification pending. Review credentials and insurance documentation before activating.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
