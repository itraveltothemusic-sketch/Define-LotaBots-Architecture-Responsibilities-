/**
 * Claims Page
 * 
 * Insurance claims management interface with tracking, status updates,
 * and scope comparison.
 */

import { getCurrentUser } from "@/lib/auth/session";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { 
  PlusIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils/format";

export default async function ClaimsPage() {
  const user = await getCurrentUser();

  // Mock data - will be replaced with real database queries
  const claims = [
    {
      id: "1",
      claimNumber: "CLM-2024-001",
      propertyName: "1401 Main Street Office Complex",
      carrierName: "ABC Insurance Group",
      status: "under_review",
      filedDate: new Date("2024-07-01"),
      initialClaimAmount: 450000,
      approvedAmount: null,
      daysPending: 47,
      scopeCount: 3,
      interactionCount: 12,
      lastUpdate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      claimNumber: "CLM-2024-002",
      propertyName: "789 Commerce Boulevard Retail Center",
      carrierName: "National Property Insurance",
      status: "submitted",
      filedDate: new Date("2024-08-15"),
      initialClaimAmount: 890000,
      approvedAmount: null,
      daysPending: 12,
      scopeCount: 2,
      interactionCount: 5,
      lastUpdate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: "3",
      claimNumber: "CLM-2024-003",
      propertyName: "555 Industrial Way Warehouse",
      carrierName: "Premier Commercial Insurance",
      status: "approved",
      filedDate: new Date("2024-06-10"),
      initialClaimAmount: 320000,
      approvedAmount: 285000,
      daysPending: 68,
      scopeCount: 4,
      interactionCount: 24,
      lastUpdate: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: "4",
      claimNumber: "CLM-2024-004",
      propertyName: "2200 Technology Drive Tech Campus",
      carrierName: "Texas Commercial Coverage",
      status: "pending_info",
      filedDate: new Date("2024-08-20"),
      initialClaimAmount: 680000,
      approvedAmount: null,
      daysPending: 7,
      scopeCount: 1,
      interactionCount: 3,
      lastUpdate: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      draft: { variant: "default", label: "Draft" },
      submitted: { variant: "info", label: "Submitted" },
      under_review: { variant: "warning", label: "Under Review" },
      pending_info: { variant: "danger", label: "Pending Info" },
      approved: { variant: "success", label: "Approved" },
      partially_approved: { variant: "warning", label: "Partially Approved" },
      denied: { variant: "danger", label: "Denied" },
      settled: { variant: "success", label: "Settled" },
    };
    const statusInfo = statusMap[status] || { variant: "default", label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    if (status === "approved" || status === "settled") {
      return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    }
    if (status === "pending_info" || status === "denied") {
      return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
    }
    return <ClockIcon className="h-5 w-5 text-yellow-600" />;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Insurance Claims</h1>
          <p className="text-gray-600">
            Track claim status, compare scopes, and manage carrier interactions
          </p>
        </div>
        <Link href="/dashboard/claims/new">
          <Button variant="primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            File New Claim
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total Claims</p>
            <p className="text-3xl font-bold text-gray-900">{claims.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total Claimed</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(claims.reduce((sum, c) => sum + c.initialClaimAmount, 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Approved Amount</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(
                claims.reduce((sum, c) => sum + (c.approvedAmount || 0), 0)
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Avg Processing Time</p>
            <p className="text-3xl font-bold text-gray-900">
              {Math.round(claims.reduce((sum, c) => sum + c.daysPending, 0) / claims.length)}
            </p>
            <p className="text-sm text-gray-500">days</p>
          </CardContent>
        </Card>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims.map((claim) => (
          <Card key={claim.id} variant="elevated" className="hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    {getStatusIcon(claim.status)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {claim.claimNumber}
                      </h3>
                      {getStatusBadge(claim.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{claim.propertyName}</p>
                    <p className="text-sm text-gray-500">Carrier: {claim.carrierName}</p>
                  </div>
                </div>
                <Link href={`/dashboard/claims/${claim.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Filed Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(claim.filedDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Days Pending</p>
                  <p className="text-sm font-medium text-gray-900">{claim.daysPending} days</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Initial Claim</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(claim.initialClaimAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Approved Amount</p>
                  <p className="text-sm font-medium text-green-600">
                    {claim.approvedAmount ? formatCurrency(claim.approvedAmount) : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Update</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatRelativeTime(claim.lastUpdate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-6 text-sm">
                  <div>
                    <span className="text-gray-600">Scopes: </span>
                    <span className="font-medium text-gray-900">{claim.scopeCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Interactions: </span>
                    <span className="font-medium text-gray-900">{claim.interactionCount}</span>
                  </div>
                </div>
                {claim.approvedAmount && (
                  <div className="text-sm">
                    <span className="text-gray-600">Recovery Rate: </span>
                    <span className="font-bold text-green-600">
                      {((claim.approvedAmount / claim.initialClaimAmount) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>

              {claim.status === "pending_info" && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800 font-medium">
                    <ExclamationTriangleIcon className="h-4 w-4 inline mr-2" />
                    Additional information required. Check claim details for requested documents.
                  </p>
                </div>
              )}

              {claim.daysPending > 45 && claim.status === "under_review" && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 font-medium">
                    <ClockIcon className="h-4 w-4 inline mr-2" />
                    This claim has been pending for {claim.daysPending} days. Consider following up with the carrier.
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
