/**
 * Intelligence Center Dashboard
 * 
 * The heart of the platform. Unified view of all properties, claims, and insights.
 */

import { getCurrentUser } from "@/lib/auth/session";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ATOSPanel from "@/components/modules/ATOSPanel";
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export default async function IntelligenceCenterPage() {
  const user = await getCurrentUser();

  // Mock data - will be replaced with real database queries
  const stats = {
    totalProperties: 12,
    activeProperties: 8,
    totalClaims: 15,
    pendingClaims: 5,
    totalDamageValue: 4250000,
    totalApprovedAmount: 3680000,
  };

  const recentActivity = [
    {
      id: "1",
      action: "Document Uploaded",
      description: "3 photos added to HVAC inspection for Property 1401 Main St",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: "John Contractor",
    },
    {
      id: "2",
      action: "Claim Status Updated",
      description: "Claim #CLM-2024-001 moved to 'Under Review'",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      user: "Insurance Adjuster",
    },
    {
      id: "3",
      action: "Inspection Scheduled",
      description: "Final walkthrough scheduled for 789 Commerce Blvd",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      user: user?.name || "Unknown",
    },
    {
      id: "4",
      action: "Work Order Completed",
      description: "Roof repair milestone verified for Property 555 Industrial Way",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      user: "ABC Roofing Inc",
    },
  ];

  const activeProperties = [
    {
      id: "1",
      name: "1401 Main Street",
      status: "work_in_progress",
      claimAmount: 450000,
      progress: 65,
    },
    {
      id: "2",
      name: "789 Commerce Boulevard",
      status: "claim_filed",
      claimAmount: 890000,
      progress: 30,
    },
    {
      id: "3",
      name: "555 Industrial Way",
      status: "under_review",
      claimAmount: 320000,
      progress: 45,
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-600">
          Your comprehensive intelligence center for all properties and claims
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Properties</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
                <p className="text-sm text-green-600 mt-1">{stats.activeProperties} active</p>
              </div>
              <BuildingOfficeIcon className="h-12 w-12 text-primary-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Claims</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClaims}</p>
                <p className="text-sm text-yellow-600 mt-1">{stats.pendingClaims} pending</p>
              </div>
              <DocumentTextIcon className="h-12 w-12 text-primary-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Damage Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalDamageValue)}
                </p>
                <p className="text-sm text-gray-500 mt-1">Estimated</p>
              </div>
              <CurrencyDollarIcon className="h-12 w-12 text-primary-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalApprovedAmount)}
                </p>
                <p className="text-sm text-gray-500 mt-1">86.6% of claim</p>
              </div>
              <CurrencyDollarIcon className="h-12 w-12 text-green-600 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* ATOS Intelligence Panel */}
        <div className="lg:col-span-2">
          <ATOSPanel compact />
        </div>

        {/* Active Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Active Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeProperties.map((property) => (
              <div
                key={property.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{property.name}</h4>
                    <p className="text-sm text-gray-600">
                      Claim: {formatCurrency(property.claimAmount)}
                    </p>
                  </div>
                  <Badge variant="info" size="sm">
                    {property.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{property.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${property.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <ClockIcon className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex space-x-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{formatDate(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
